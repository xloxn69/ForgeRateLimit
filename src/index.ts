import {
  ForgeExtension,
  ForgeClient
} from "@tryforge/forgescript";
import "./types.js";                // patches ForgeClient typing (no runtime code)

export class ForgeRateLimit extends ForgeExtension {
  name = "ForgeRateLimit";
  description = "Comprehensive rate limiting and queueing system for ForgeScript";
  version = "1.0.0";

  private instance!: ForgeClient;
  private buckets = new Map<string, any>();
  private policy: any;

  init(client: ForgeClient): void {
    this.instance = client;
    
    // Initialize rate limiting stores
    if (!(client as any).rateLimitBuckets) (client as any).rateLimitBuckets = new Map();
    if (!(client as any).rateLimitQueues) (client as any).rateLimitQueues = new Map();
    if (!(client as any).rateLimitRuns) (client as any).rateLimitRuns = new Map();
    if (!(client as any).rateLimitStats) (client as any).rateLimitStats = new Map();
    
    // Set default balanced policy
    if (!(client as any).rateLimitPolicy) {
      (client as any).rateLimitPolicy = this.createBalancedPolicy();
    }
    
    this.buckets = (client as any).rateLimitBuckets;
    this.policy = (client as any).rateLimitPolicy;
    
    // Initialize global buckets
    this.initializeBuckets();
    
    // Start background refill process
    this.startRefillProcess();
    
    // Load functions using ForgeExtension's built-in loader
    this.load(__dirname + "/functions");
  }

  private createBalancedPolicy() {
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

  private initializeBuckets() {
    this.buckets.set('global', { ...this.policy.global });
  }

  private startRefillProcess() {
    setInterval(() => {
      this.refillAllBuckets();
    }, 1000);
  }

  private refillAllBuckets() {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      const timeSinceLastRefill = (now - (bucket as any).lastRefill) / 1000;
      const tokensToAdd = Math.floor(timeSinceLastRefill * (bucket as any).refillRate);
      if (tokensToAdd > 0) {
        (bucket as any).tokens = Math.min((bucket as any).capacity, (bucket as any).tokens + tokensToAdd);
        (bucket as any).lastRefill = now;
      }
    }
  }
}

// Also export as default and module.exports for compatibility
export default ForgeRateLimit;
module.exports = ForgeRateLimit;
module.exports.default = ForgeRateLimit; 