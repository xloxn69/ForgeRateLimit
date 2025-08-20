"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeRateLimit = void 0;
const forgescript_1 = require("@tryforge/forgescript");
require("./types.js"); // patches ForgeClient typing (no runtime code)
class ForgeRateLimit extends forgescript_1.ForgeExtension {
    name = "ForgeRateLimit";
    description = "Comprehensive rate limiting and queueing system for ForgeScript";
    version = "1.0.0";
    instance;
    buckets = new Map();
    policy;
    init(client) {
        this.instance = client;
        // Initialize rate limiting stores
        if (!client.rateLimitBuckets)
            client.rateLimitBuckets = new Map();
        if (!client.rateLimitQueues)
            client.rateLimitQueues = new Map();
        if (!client.rateLimitRuns)
            client.rateLimitRuns = new Map();
        if (!client.rateLimitStats)
            client.rateLimitStats = new Map();
        // Set default balanced policy
        if (!client.rateLimitPolicy) {
            client.rateLimitPolicy = this.createBalancedPolicy();
        }
        this.buckets = client.rateLimitBuckets;
        this.policy = client.rateLimitPolicy;
        // Initialize global buckets
        this.initializeBuckets();
        // Start background refill process
        this.startRefillProcess();
        // Load functions using ForgeExtension's built-in loader
        this.load(__dirname + "/functions");
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
exports.ForgeRateLimit = ForgeRateLimit;
// Also export as default and module.exports for compatibility
exports.default = ForgeRateLimit;
module.exports = ForgeRateLimit;
module.exports.default = ForgeRateLimit;
//# sourceMappingURL=index.js.map