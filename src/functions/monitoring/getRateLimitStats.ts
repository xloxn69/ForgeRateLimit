import { NativeFunction, ArgType } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$getRateLimitStats",
  version: "1.0.0",
  description: "Gets comprehensive rate limiting statistics",
  brackets: true,
  unwrap: true,
  output: ArgType.String,
  args: [],
  async execute(ctx) {
    // Get rate limiting stores from client
    const buckets = ctx.client.rateLimitBuckets || new Map();
    const policy = ctx.client.rateLimitPolicy;

    if (!policy) {
      return this.success(JSON.stringify({
        error: "No rate limiting policy configured"
      }));
    }

    const stats = {
      totalBuckets: buckets.size,
      globalTokens: buckets.get('global')?.tokens || 0,
      globalCapacity: policy.global.capacity,
      activeBuckets: Array.from(buckets.keys()).filter(key => key !== 'global').length,
      policy: policy.name,
      bucketBreakdown: {
        guild: Array.from(buckets.keys()).filter(k => k.startsWith('guild_')).length,
        user: Array.from(buckets.keys()).filter(k => k.startsWith('user_')).length,
        flow: Array.from(buckets.keys()).filter(k => k.startsWith('flow_')).length
      }
    };
    
    return this.success(JSON.stringify(stats));
  }
});