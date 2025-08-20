"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$getBucketInfo",
    version: "1.0.0",
    description: "Gets information about a rate limiting bucket",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Boolean,
    args: [
        {
            name: "scope",
            description: "Bucket scope (global, guild, user, flow)",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "id",
            description: "Bucket ID (optional for global)",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false
        }
    ],
    async execute(ctx) {
        const scope = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](scope))
            return scope;
        const id = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](id))
            return id;
        // Get rate limiting stores from client
        const buckets = ctx.client.rateLimitBuckets || new Map();
        const policy = ctx.client.rateLimitPolicy;
        if (!policy) {
            ctx.setEnvironmentKey("bucketExists", "false");
            return this.success(false);
        }
        let bucketKey;
        let policyRef;
        switch (scope.value) {
            case 'global':
                bucketKey = 'global';
                policyRef = policy.global;
                break;
            case 'guild':
                bucketKey = `guild_${id?.value || ''}`;
                policyRef = policy.guild;
                break;
            case 'user':
                const [guildId, userId] = (id?.value || '').split('_');
                bucketKey = `user_${guildId}_${userId}`;
                policyRef = policy.user;
                break;
            case 'flow':
                const [gId, flowId] = (id?.value || '').split('_');
                bucketKey = `flow_${gId}_${flowId}`;
                policyRef = policy.flow;
                break;
            default:
                ctx.setEnvironmentKey("bucketExists", "false");
                return this.success(false);
        }
        const bucket = buckets.get(bucketKey);
        if (!bucket) {
            ctx.setEnvironmentKey("bucketExists", "false");
            return this.success(false);
        }
        const fillPercentage = Math.round((bucket.tokens / bucket.capacity) * 100);
        ctx.setEnvironmentKey("bucketExists", "true");
        ctx.setEnvironmentKey("bucketTokens", bucket.tokens.toString());
        ctx.setEnvironmentKey("bucketCapacity", bucket.capacity.toString());
        ctx.setEnvironmentKey("bucketFillPercentage", fillPercentage.toString());
        return this.success(true);
    }
});
//# sourceMappingURL=getBucketInfo.js.map