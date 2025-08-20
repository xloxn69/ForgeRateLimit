import { NativeFunction, ArgType } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$calculateETA",
  version: "1.0.0",
  description: "Calculates ETA across multiple rate limiting buckets",
  brackets: true,
  unwrap: true,
  output: ArgType.Number,
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
      description: "Token cost required",
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

    const cost = await this["resolveUnhandledArg"](ctx, 3);
    if (!this["isValidReturnType"](cost)) return cost;

    const numCost = cost.value;
    if (isNaN(numCost) || numCost <= 0) {
      return this.success(0);
    }

    // Get rate limiting stores from client
    const buckets = (ctx.client as any).rateLimitBuckets || new Map();
    const queues = (ctx.client as any).rateLimitQueues || new Map();
    const runs = (ctx.client as any).rateLimitRuns || new Map();
    const policy = (ctx.client as any).rateLimitPolicy;

    if (!policy) {
      return this.success(Infinity);
    }

    let maxETA = 0;
    const bucketETAs: Array<{bucket: string, eta: number, reason: string}> = [];

    // Check global bucket
    const globalBucket = buckets.get('global');
    if (globalBucket && globalBucket.tokens < numCost) {
      const shortage = numCost - globalBucket.tokens;
      const eta = Math.ceil(shortage / policy.global.refillRate);
      maxETA = Math.max(maxETA, eta);
      bucketETAs.push({
        bucket: 'global',
        eta,
        reason: `Need ${shortage} more tokens, refill at ${policy.global.refillRate}/sec`
      });
    }

    // Check guild bucket
    const guildKey = `guild_${guildId.value}`;
    let guildBucket = buckets.get(guildKey);
    if (!guildBucket) {
      guildBucket = { ...policy.guild };
    }
    if (guildBucket.tokens < numCost) {
      const shortage = numCost - guildBucket.tokens;
      const eta = Math.ceil(shortage / policy.guild.refillRate);
      maxETA = Math.max(maxETA, eta);
      bucketETAs.push({
        bucket: 'guild',
        eta,
        reason: `Need ${shortage} more tokens, refill at ${policy.guild.refillRate}/sec`
      });
    }

    // Check user bucket
    const userKey = `user_${guildId.value}_${userId.value}`;
    let userBucket = buckets.get(userKey);
    if (!userBucket) {
      userBucket = { ...policy.user };
    }
    if (userBucket.tokens < numCost) {
      const shortage = numCost - userBucket.tokens;
      const eta = Math.ceil(shortage / policy.user.refillRate);
      maxETA = Math.max(maxETA, eta);
      bucketETAs.push({
        bucket: 'user',
        eta,
        reason: `Need ${shortage} more tokens, refill at ${policy.user.refillRate}/sec`
      });
    }

    // Check flow bucket
    const flowKey = `flow_${guildId.value}_${flowId.value}`;
    let flowBucket = buckets.get(flowKey);
    if (!flowBucket) {
      flowBucket = { ...policy.flow };
    }
    if (flowBucket.tokens < numCost) {
      const shortage = numCost - flowBucket.tokens;
      const eta = Math.ceil(shortage / policy.flow.refillRate);
      maxETA = Math.max(maxETA, eta);
      bucketETAs.push({
        bucket: 'flow',
        eta,
        reason: `Need ${shortage} more tokens, refill at ${policy.flow.refillRate}/sec`
      });
    }

    // Add queue wait time if concurrency is full
    const queueKey = `queue_${guildId.value}`;
    const runsKey = `runs_${guildId.value}`;
    const queue = queues.get(queueKey) || [];
    const currentRuns = runs.get(runsKey) || [];

    let queueETA = 0;
    if (currentRuns.length >= policy.concurrency.maxRunsPerGuild) {
      // Estimate queue wait based on current queue size and average execution time
      const avgExecutionTime = 2000; // 2 seconds average
      queueETA = Math.ceil((queue.length + 1) * avgExecutionTime / policy.concurrency.maxRunsPerGuild / 1000);
      maxETA = Math.max(maxETA, queueETA);
    }

    // Find the limiting bucket (highest ETA)
    const limitingBucket = bucketETAs.reduce((max, current) => 
      current.eta > max.eta ? current : max, 
      { bucket: 'none', eta: 0, reason: 'No limits' }
    );

    ctx.setEnvironmentKey("totalETA", maxETA.toString());
    ctx.setEnvironmentKey("limitingBucket", limitingBucket.bucket);
    ctx.setEnvironmentKey("limitingReason", limitingBucket.reason);
    ctx.setEnvironmentKey("queueETA", queueETA.toString());
    ctx.setEnvironmentKey("bucketETAs", JSON.stringify(bucketETAs));

    return this.success(maxETA);
  }
});