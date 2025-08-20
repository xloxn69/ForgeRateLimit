"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$processQueue",
    version: "1.0.0",
    description: "Processes queued jobs using weighted fair queuing by flow",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Boolean,
    args: [
        {
            name: "guildId",
            description: "Guild ID to process queue for",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx) {
        const guildId = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](guildId))
            return guildId;
        // Get rate limiting stores from client
        const queues = ctx.client.rateLimitQueues || new Map();
        const runs = ctx.client.rateLimitRuns || new Map();
        const policy = ctx.client.rateLimitPolicy;
        if (!policy) {
            return this.success(false);
        }
        const queueKey = `queue_${guildId.value}`;
        const runsKey = `runs_${guildId.value}`;
        let queue = queues.get(queueKey) || [];
        let currentRuns = runs.get(runsKey) || [];
        // Check concurrency limit
        if (currentRuns.length >= policy.concurrency.maxRunsPerGuild) {
            return this.success(false);
        }
        if (queue.length === 0) {
            return this.success(false);
        }
        // Implement weighted fair queuing by flow
        const flowCounts = new Map();
        const flowJobs = new Map();
        // Group jobs by flow and count them
        for (const job of queue) {
            const flowId = job.flowId || 'default';
            flowCounts.set(flowId, (flowCounts.get(flowId) || 0) + 1);
            if (!flowJobs.has(flowId)) {
                flowJobs.set(flowId, []);
            }
            flowJobs.get(flowId).push(job);
        }
        // Find flow with lowest ratio of processed jobs (fair scheduling)
        let selectedFlow = null;
        let lowestRatio = Infinity;
        for (const [flowId, count] of flowCounts) {
            const processedCount = currentRuns.filter((run) => run.flowId === flowId).length || 0;
            const ratio = processedCount / count;
            if (ratio < lowestRatio) {
                lowestRatio = ratio;
                selectedFlow = flowId;
            }
        }
        if (!selectedFlow) {
            return this.success(false);
        }
        // Get oldest job from selected flow
        const flowJobsList = flowJobs.get(selectedFlow);
        const selectedJob = flowJobsList.shift();
        if (!selectedJob) {
            return this.success(false);
        }
        // Remove job from main queue
        const jobIndex = queue.findIndex((job) => job.id === selectedJob.id);
        if (jobIndex !== -1) {
            queue.splice(jobIndex, 1);
        }
        // Add to running jobs
        const runningJob = {
            ...selectedJob,
            startedAt: Date.now(),
            flowId: selectedFlow
        };
        currentRuns.push(runningJob);
        // Update maps
        queues.set(queueKey, queue);
        runs.set(runsKey, currentRuns);
        // Emit queueExecuted event
        const rateLimitExtension = ctx.client.getExtension?.("ForgeRateLimit");
        if (rateLimitExtension?.emitter) {
            rateLimitExtension.emitter.emit("queueExecuted", {
                guildId: guildId.value,
                userId: selectedJob.userId || 'unknown',
                flowId: selectedFlow,
                jobId: selectedJob.id,
                waitTime: Date.now() - selectedJob.timestamp,
                timestamp: Date.now()
            });
        }
        ctx.setEnvironmentKey("processedJobId", selectedJob.id);
        ctx.setEnvironmentKey("processedFlow", selectedFlow);
        ctx.setEnvironmentKey("waitTime", (Date.now() - selectedJob.timestamp).toString());
        return this.success(true);
    }
});
//# sourceMappingURL=processQueue.js.map