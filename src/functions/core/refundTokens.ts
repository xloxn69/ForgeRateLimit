import { NativeFunction, ArgType } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$refundTokens",
  version: "1.0.0", 
  description: "Refunds tokens to buckets after operation completion",
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
      name: "amount",
      description: "Amount to refund",
      type: ArgType.Number,
      required: true,
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

    const amount = await this["resolveUnhandledArg"](ctx, 3);
    if (!this["isValidReturnType"](amount)) return amount;

    const numAmount = amount.value;
    if (isNaN(numAmount) || numAmount <= 0) {
      return this.success(false);
    }

    // Get rate limiting stores from client
    const buckets = (ctx.client as any).rateLimitBuckets || new Map();
    const policy = (ctx.client as any).rateLimitPolicy;

    if (!policy) {
      return this.success(false);
    }

    // Refund to all relevant buckets
    const globalBucket = buckets.get('global');
    if (globalBucket) {
      globalBucket.tokens = Math.min(policy.global.capacity, globalBucket.tokens + numAmount);
    }

    const guildBucket = buckets.get(`guild_${guildId.value}`);
    if (guildBucket) {
      guildBucket.tokens = Math.min(policy.guild.capacity, guildBucket.tokens + numAmount);
    }

    const userBucket = buckets.get(`user_${guildId.value}_${userId.value}`);
    if (userBucket) {
      userBucket.tokens = Math.min(policy.user.capacity, userBucket.tokens + numAmount);
    }

    const flowBucket = buckets.get(`flow_${guildId.value}_${flowId.value}`);
    if (flowBucket) {
      flowBucket.tokens = Math.min(policy.flow.capacity, flowBucket.tokens + numAmount);
    }

    return this.success(true);
  }
});