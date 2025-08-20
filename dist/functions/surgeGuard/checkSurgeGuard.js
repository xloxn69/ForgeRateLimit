"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$checkSurgeGuard",
    version: "1.0.0",
    description: "Checks and manages surge guard system for queue wait times",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Boolean,
    args: [
        {
            name: "guildId",
            description: "Guild ID to check (optional, empty for global)",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false
        }
    ],
    async execute(ctx) {
        const guildId = await this["resolveUnhandledArg"](ctx, 0);
        // Get rate limiting stores from client
        const queues = ctx.client.rateLimitQueues || new Map();
        const runs = ctx.client.rateLimitRuns || new Map();
        const stats = ctx.client.rateLimitStats || new Map();
        const policy = ctx.client.rateLimitPolicy;
        if (!policy) {
            return this.success(false);
        }
        const scope = guildId && this["isValidReturnType"](guildId) ? guildId.value : "global";
        const statsKey = `surgeGuard_${scope}`;
        let surgeStats = stats.get(statsKey) || {
            queueWaitTimes: [],
            lastCheck: Date.now(),
            isActive: false,
            activatedAt: null,
            originalPolicy: null
        };
        const now = Date.now();
        // Calculate current queue wait times
        let totalWaitTime = 0;
        let queueCount = 0;
        if (scope === "global") {
            // Check all guild queues for global surge guard
            for (const [key, queue] of queues) {
                if (key.startsWith('queue_') && Array.isArray(queue)) {
                    const guildIdFromKey = key.replace('queue_', '');
                    const runsKey = `runs_${guildIdFromKey}`;
                    const currentRuns = runs.get(runsKey) || [];
                    for (const job of queue) {
                        const estimatedWait = (queue.length / Math.max(1, policy.concurrency.maxRunsPerGuild - currentRuns.length)) * 2000; // 2s average per job
                        totalWaitTime += estimatedWait;
                        queueCount++;
                    }
                }
            }
        }
        else {
            // Check specific guild queue
            const queueKey = `queue_${scope}`;
            const runsKey = `runs_${scope}`;
            const queue = queues.get(queueKey) || [];
            const currentRuns = runs.get(runsKey) || [];
            for (const job of queue) {
                const estimatedWait = (queue.length / Math.max(1, policy.concurrency.maxRunsPerGuild - currentRuns.length)) * 2000;
                totalWaitTime += estimatedWait;
                queueCount++;
            }
        }
        const averageWait = queueCount > 0 ? totalWaitTime / queueCount : 0;
        // Update rolling window of wait times (last 5 minutes)
        surgeStats.queueWaitTimes.push({ time: now, wait: averageWait });
        surgeStats.queueWaitTimes = surgeStats.queueWaitTimes.filter((entry) => now - entry.time < 5 * 60 * 1000);
        // Calculate P95 wait time
        const waitTimes = surgeStats.queueWaitTimes.map((entry) => entry.wait);
        waitTimes.sort((a, b) => a - b);
        const p95Index = Math.floor(waitTimes.length * 0.95);
        const p95Wait = waitTimes[p95Index] || 0;
        const threshold = 5000; // 5 seconds
        // Check if surge guard should activate
        if (!surgeStats.isActive && p95Wait > threshold && surgeStats.queueWaitTimes.length >= 10) {
            surgeStats.isActive = true;
            surgeStats.activatedAt = now;
            surgeStats.originalPolicy = JSON.stringify(policy);
            // Halve the refill rates to slow things down
            if (scope === "global") {
                policy.global.refillRate = policy.global.refillRate / 2;
                policy.guild.refillRate = policy.guild.refillRate / 2;
                policy.user.refillRate = policy.user.refillRate / 2;
                policy.flow.refillRate = policy.flow.refillRate / 2;
            }
            // Emit surge guard event
            const rateLimitExtension = ctx.client.getExtension?.("ForgeRateLimit");
            if (rateLimitExtension?.emitter) {
                rateLimitExtension.emitter.emit("surgeGuard", {
                    guildId: scope !== "global" ? scope : undefined,
                    queueWaitP95: p95Wait,
                    threshold,
                    action: "activated",
                    previousPolicy: "Balanced",
                    newPolicy: "Degraded",
                    timestamp: now
                });
            }
        }
        // Check if surge guard should deactivate
        else if (surgeStats.isActive && p95Wait < threshold * 0.7 && (now - surgeStats.activatedAt) > 60000) {
            surgeStats.isActive = false;
            // Restore original policy
            if (surgeStats.originalPolicy) {
                const originalPolicy = JSON.parse(surgeStats.originalPolicy);
                Object.assign(policy, originalPolicy);
            }
            // Emit surge guard event
            const rateLimitExtension = ctx.client.getExtension?.("ForgeRateLimit");
            if (rateLimitExtension?.emitter) {
                rateLimitExtension.emitter.emit("surgeGuard", {
                    guildId: scope !== "global" ? scope : undefined,
                    queueWaitP95: p95Wait,
                    threshold,
                    action: "deactivated",
                    previousPolicy: "Degraded",
                    newPolicy: "Balanced",
                    timestamp: now
                });
            }
        }
        stats.set(statsKey, surgeStats);
        ctx.setEnvironmentKey("surgeGuardActive", surgeStats.isActive.toString());
        ctx.setEnvironmentKey("queueWaitP95", Math.round(p95Wait).toString());
        ctx.setEnvironmentKey("surgeThreshold", threshold.toString());
        return this.success(surgeStats.isActive);
    }
});
//# sourceMappingURL=checkSurgeGuard.js.map