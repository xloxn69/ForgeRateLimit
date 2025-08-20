import { ForgeExtension } from "@tryforge/forgescript";
import * as fn from "./functions.js";

/** ForgeRateLimit – comprehensive rate limiting and queueing system for ForgeScript */
export class ForgeRateLimit extends ForgeExtension {
  constructor() {
    super({
      name: "ForgeRateLimit",
      version: "1.0.0",
      author: "xloxn69"
    });

    // Rate limiting stores
    this.buckets = new Map();
    this.policy = this.createBalancedPolicy();
    this.initializeBuckets();
    this.startRefillProcess();

    /* helper to avoid repetition */
    const reg = (name, exec, returns = "String") =>
      this.addNativeFunction({
        name,
        brackets: true,
        unwrap: true,
        returns,
        version: "1.0.0",
        execute: exec
      });

    /** ───── core rate limiting functions ───── */
    reg("$estimateCost", (ctx, a) => fn.estimateCost(...a), "Number");
    reg("$reserveTokens", (ctx, a) => {
      const result = fn.reserveTokens(this.buckets, this.policy, ...a);
      ctx.setEnvironmentKey("rateLimitSuccess", result.success.toString());
      ctx.setEnvironmentKey("rateLimitReserved", result.reserved?.toString() || "0");
      ctx.setEnvironmentKey("rateLimitReason", result.reason || "");
      ctx.setEnvironmentKey("rateLimitEta", result.eta?.toString() || "0");
      return result.success;
    }, "Boolean");
    reg("$refundTokens", (ctx, a) => fn.refundTokens(this.buckets, this.policy, ...a), "Boolean");
    reg("$getBucketInfo", (ctx, a) => {
      const result = fn.getBucketInfo(this.buckets, this.policy, ...a);
      ctx.setEnvironmentKey("bucketExists", result.exists.toString());
      ctx.setEnvironmentKey("bucketTokens", result.tokens?.toString() || "0");
      ctx.setEnvironmentKey("bucketCapacity", result.capacity?.toString() || "0");
      ctx.setEnvironmentKey("bucketFillPercentage", result.fillPercentage?.toString() || "0");
      return result.exists;
    }, "Boolean");
    reg("$addToQueue", (ctx, a) => fn.addToQueue(this.buckets, this.policy, ...a), "Boolean");
    reg("$getRateLimitStats", (ctx, a) => fn.getRateLimitStats(this.buckets, this.policy, ...a));
  }

  createBalancedPolicy() {
    return {
      name: "Balanced",
      description: "Good default policy for most servers",
      global: { capacity: 1000, tokens: 1000, refillRate: 10, lastRefill: Date.now() },
      guild: { capacity: 150, tokens: 150, refillRate: 2.5, lastRefill: Date.now() },
      user: { capacity: 30, tokens: 30, refillRate: 0.5, lastRefill: Date.now() },
      flow: { capacity: 80, tokens: 80, refillRate: 1.33, lastRefill: Date.now() },
      actionTypes: {
        send_message: { capacity: 80, tokens: 80, refillRate: 1.33, lastRefill: Date.now() },
        send_embed: { capacity: 40, tokens: 40, refillRate: 0.67, lastRefill: Date.now() },
        role_edit: { capacity: 30, tokens: 30, refillRate: 0.5, lastRefill: Date.now() },
        timeout: { capacity: 20, tokens: 20, refillRate: 0.33, lastRefill: Date.now() },
        kick_ban: { capacity: 20, tokens: 20, refillRate: 0.33, lastRefill: Date.now() },
        create_delete: { capacity: 10, tokens: 10, refillRate: 0.17, lastRefill: Date.now() },
        http_request: { capacity: 40, tokens: 40, refillRate: 0.67, lastRefill: Date.now() }
      },
      concurrency: {
        maxRunsPerGuild: 12,
        queueThreshold: 15,
        maxQueueSize: 200
      }
    };
  }

  initializeBuckets() {
    this.buckets.set('global', { ...this.policy.global });
  }

  startRefillProcess() {
    setInterval(() => {
      this.refillAllBuckets();
    }, 1000);
  }

  refillAllBuckets() {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      const timeSinceLastRefill = (now - bucket.lastRefill) / 1000;
      const tokensToAdd = Math.floor(timeSinceLastRefill * bucket.refillRate);
      if (tokensToAdd > 0) {
        bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);
        bucket.lastRefill = now;
      }
    }
  }
}