"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$openCircuitBreaker",
    version: "1.0.0",
    description: "Opens a circuit breaker for a specific flow to prevent execution",
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
            name: "flowId",
            description: "Flow ID to break",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "reason",
            description: "Reason for opening circuit breaker",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false
        }
    ],
    async execute(ctx) {
        const guildId = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](guildId))
            return guildId;
        const flowId = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](flowId))
            return flowId;
        const reason = await this["resolveUnhandledArg"](ctx, 2);
        if (!this["isValidReturnType"](reason))
            return reason;
        // Get circuit breaker stores from client
        const circuitBreakers = ctx.client.rateLimitCircuitBreakers || new Map();
        if (!ctx.client.rateLimitCircuitBreakers) {
            ctx.client.rateLimitCircuitBreakers = circuitBreakers;
        }
        const breakerKey = `${guildId.value}_${flowId.value}`;
        const breaker = {
            guildId: guildId.value,
            flowId: flowId.value,
            state: "open",
            openedAt: Date.now(),
            reason: reason?.value || "Manual circuit breaker",
            errorCount: 0,
            totalRequests: 0
        };
        circuitBreakers.set(breakerKey, breaker);
        // Emit circuit breaker event
        const rateLimitExtension = ctx.client.getExtension?.("ForgeRateLimit");
        if (rateLimitExtension?.emitter) {
            rateLimitExtension.emitter.emit("circuitBreaker", {
                flowId: flowId.value,
                guildId: guildId.value,
                errorRate: 0,
                threshold: 15,
                action: "opened",
                timestamp: Date.now()
            });
        }
        return this.success(true);
    }
});
//# sourceMappingURL=openCircuitBreaker.js.map