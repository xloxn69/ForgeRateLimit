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
        }
    ],
    async execute(ctx) {
        const guildId = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](guildId))
            return guildId;
        const jobData = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](jobData))
            return jobData;
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
        // Add job to queue with timestamp
        queue.push({
            data: jobData.value,
            timestamp: Date.now(),
            id: Math.random().toString(36).substr(2, 9)
        });
        return this.success(true);
    }
});
//# sourceMappingURL=addToQueue.js.map