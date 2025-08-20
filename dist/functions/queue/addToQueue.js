"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$addToQueue",
    version: "1.0.0",
    description: "Adds a job to the rate limiting queue",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Boolean,
    args: [
        {
            name: "guildId",
            description: "Guild ID",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "jobData",
            description: "Job data to queue",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "priority",
            description: "Priority class (1=moderation, 2=system, 3=messaging, 4=heavy)",
            type: forgescript_1.ArgType.Number,
            required: false,
            rest: false
        },
        {
            name: "flowId",
            description: "Flow ID for fairness scheduling",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false
        },
        {
            name: "userId",
            description: "User ID",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false
        }
    ],
    async execute(ctx) {
        const guildId = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](guildId))
            return guildId;
        const jobData = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](jobData))
            return jobData;
        const priority = await this["resolveUnhandledArg"](ctx, 2);
        const flowId = await this["resolveUnhandledArg"](ctx, 3);
        const userId = await this["resolveUnhandledArg"](ctx, 4);
        // Get rate limiting stores from client
        const queues = ctx.client.rateLimitQueues || new Map();
        const policy = ctx.client.rateLimitPolicy;
        if (!policy) {
            return this.success(false);
        }
        const queueKey = `queue_${guildId.value}`;
        let queue = queues.get(queueKey);
        if (!queue) {
            queue = [];
            queues.set(queueKey, queue);
        }
        // Check if queue is at capacity
        if (queue.length >= policy.concurrency.maxQueueSize) {
            return this.success(false);
        }
        const jobId = Math.random().toString(36).substr(2, 9);
        const jobPriority = priority && this["isValidReturnType"](priority) ? priority.value : 3;
        // Add job to queue with priority-based insertion
        const job = {
            data: jobData.value,
            timestamp: Date.now(),
            id: jobId,
            priority: jobPriority,
            flowId: flowId && this["isValidReturnType"](flowId) ? flowId.value : 'default',
            userId: userId && this["isValidReturnType"](userId) ? userId.value : 'unknown'
        };
        // Insert job based on priority (lower number = higher priority)
        let insertIndex = queue.length;
        for (let i = 0; i < queue.length; i++) {
            if (queue[i].priority > jobPriority) {
                insertIndex = i;
                break;
            }
        }
        queue.splice(insertIndex, 0, job);
        queues.set(queueKey, queue);
        // Emit queued event
        const rateLimitExtension = ctx.client.getExtension?.("ForgeRateLimit");
        if (rateLimitExtension?.emitter) {
            rateLimitExtension.emitter.emit("queued", {
                guildId: guildId.value,
                userId: job.userId,
                flowId: job.flowId,
                jobId: jobId,
                cost: 0, // Cost not available here
                queuePosition: insertIndex + 1,
                timestamp: Date.now()
            });
        }
        ctx.setEnvironmentKey("jobId", jobId);
        ctx.setEnvironmentKey("queuePosition", (insertIndex + 1).toString());
        ctx.setEnvironmentKey("queueSize", queue.length.toString());
        return this.success(true);
    }
});
//# sourceMappingURL=addToQueue.js.map