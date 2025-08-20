import { NativeFunction, ArgType } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$reserveTokens",
  version: "1.0.0",
  description: "Reserves tokens from buckets for rate limiting",
  brackets: true,
  unwrap: true,
  output: ArgType.Boolean,
  args: [
    {
      name: "guildId",
      description: "Guild ID",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "userId", 
      description: "User ID",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "flowId",
      description: "Flow ID",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "cost",
      description: "Token cost",
      type: ArgType.Number,
      required: true,
      rest: false
    },
    {
      name: "actionTypes",
      description: "Action types",
      type: ArgType.String,
      required: false,
      rest: false
    }
  ],
  async execute(ctx) {
    const guildId = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](guildId)) return guildId;

    const userId = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](userId)) return userId;

    const flowId = await this["resolveUnhandledArg"](ctx, 2);
    if (!this["isValidReturnType"](flowId)) return flowId;

    const cost = await this["resolveUnhandledArg"](ctx, 3);
    if (!this["isValidReturnType"](cost)) return cost;

    const actionTypes = await this["resolveUnhandledArg"](ctx, 4);
    if (!this["isValidReturnType"](actionTypes)) return actionTypes;

    const numCost = cost.value;
    if (isNaN(numCost) || numCost <= 0) {
      ctx.setEnvironmentKey("rateLimitSuccess", "false");
      ctx.setEnvironmentKey("rateLimitReason", "Invalid cost");
      ctx.setEnvironmentKey("rateLimitEta", "0");
      return this.success(false);
    }

    // Get rate limiting stores from client
    const buckets = (ctx.client as any).rateLimitBuckets || new Map();
    const policy = (ctx.client as any).rateLimitPolicy;

    if (!policy) {
      ctx.setEnvironmentKey("rateLimitSuccess", "false");
      ctx.setEnvironmentKey("rateLimitReason", "No policy configured");
      ctx.setEnvironmentKey("rateLimitEta", "0");
      return this.success(false);
    }

    // Check global bucket
    const globalBucket = buckets.get('global');
    if (!globalBucket || globalBucket.tokens < numCost) {
      const eta = globalBucket ? Math.ceil((numCost - globalBucket.tokens) / policy.global.refillRate) : 60;
      ctx.setEnvironmentKey("rateLimitSuccess", "false");
      ctx.setEnvironmentKey("rateLimitReason", "global_limit");
      ctx.setEnvironmentKey("rateLimitEta", eta.toString());
      return this.success(false);
    }

    // Check guild bucket
    const guildKey = `guild_${guildId.value}`;
    let guildBucket = buckets.get(guildKey);
    if (!guildBucket) {
      guildBucket = { ...policy.guild };
      buckets.set(guildKey, guildBucket);
    }
    
    if (guildBucket.tokens < numCost) {
      const eta = Math.ceil((numCost - guildBucket.tokens) / policy.guild.refillRate);
      ctx.setEnvironmentKey("rateLimitSuccess", "false");
      ctx.setEnvironmentKey("rateLimitReason", "guild_limit");
      ctx.setEnvironmentKey("rateLimitEta", eta.toString());
      return this.success(false);
    }

    // Check user bucket
    const userKey = `user_${guildId.value}_${userId.value}`;
    let userBucket = buckets.get(userKey);
    if (!userBucket) {
      userBucket = { ...policy.user };
      buckets.set(userKey, userBucket);
    }
    
    if (userBucket.tokens < numCost) {
      const eta = Math.ceil((numCost - userBucket.tokens) / policy.user.refillRate);
      ctx.setEnvironmentKey("rateLimitSuccess", "false");
      ctx.setEnvironmentKey("rateLimitReason", "user_limit");
      ctx.setEnvironmentKey("rateLimitEta", eta.toString());
      return this.success(false);
    }

    // Check flow bucket
    const flowKey = `flow_${guildId.value}_${flowId.value}`;
    let flowBucket = buckets.get(flowKey);
    if (!flowBucket) {
      flowBucket = { ...policy.flow };
      buckets.set(flowKey, flowBucket);
    }
    
    if (flowBucket.tokens < numCost) {
      const eta = Math.ceil((numCost - flowBucket.tokens) / policy.flow.refillRate);
      ctx.setEnvironmentKey("rateLimitSuccess", "false");
      ctx.setEnvironmentKey("rateLimitReason", "flow_limit");
      ctx.setEnvironmentKey("rateLimitEta", eta.toString());
      return this.success(false);
    }

    // All checks passed - reserve tokens
    globalBucket.tokens -= numCost;
    guildBucket.tokens -= numCost;
    userBucket.tokens -= numCost;
    flowBucket.tokens -= numCost;

    ctx.setEnvironmentKey("rateLimitSuccess", "true");
    ctx.setEnvironmentKey("rateLimitReserved", numCost.toString());
    ctx.setEnvironmentKey("rateLimitReason", "");
    ctx.setEnvironmentKey("rateLimitEta", "0");

    return this.success(true);
  }
});