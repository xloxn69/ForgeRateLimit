"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$checkCircuitBreaker",
    version: "1.0.0",
    description: "Checks if a circuit breaker is open for a specific flow",
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
            description: "Flow ID to check",
            type: forgescript_1.ArgType.String,
            required: true,
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
        // Get circuit breaker stores from client
        const circuitBreakers = ctx.client.rateLimitCircuitBreakers || new Map();
        const breakerKey = `${guildId.value}_${flowId.value}`;
        const breaker = circuitBreakers.get(breakerKey);
        if (!breaker) {
            return this.success(false);
        }
        // Check if breaker should transition to half-open after timeout
        const now = Date.now();
        const timeout = 5 * 60 * 1000; // 5 minutes
        if (breaker.state === "open" && (now - breaker.openedAt) > timeout) {
            breaker.state = "halfOpen";
            breaker.errorCount = 0;
            breaker.totalRequests = 0;
        }
        ctx.setEnvironmentKey("circuitBreakerState", breaker.state);
        ctx.setEnvironmentKey("circuitBreakerReason", breaker.reason || "");
        ctx.setEnvironmentKey("circuitBreakerOpenedAt", breaker.openedAt.toString());
        return this.success(breaker.state === "open");
    }
});
//# sourceMappingURL=checkCircuitBreaker.js.map