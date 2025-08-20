"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeRateLimit = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const structures_1 = require("./structures");
require("./types.js"); // patches ForgeClient typing (no runtime code)
class ForgeRateLimit extends forgescript_1.ForgeExtension {
    options;
    name = "ForgeRateLimit";
    description = "Comprehensive rate limiting and queueing system for ForgeScript";
    version = "1.0.0";
    instance;
    buckets = new Map();
    policy;
    commands;
    emitter = new tiny_typed_emitter_1.TypedEmitter();
    constructor(options) {
        super();
        this.options = options;
    }
    init(client) {
        this.instance = client;
        // Initialize command manager for events
        this.commands = new structures_1.RateLimitCommandManager(client);
        // Load events (disabled - events loaded via options instead)
        // EventManager.load('ForgeRateLimitEvents', __dirname + '/events');
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
        // Load events if specified
        if (this.options?.events?.length) {
            client.events.load("ForgeRateLimitEvents", this.options.events);
        }
        // Load event commands from bot's events directory
        this.loadEventCommands();
        // Set up event listeners to connect emitter to ForgeScript commands
        this.setupEventListeners(client);
    }
    eventCommands = new Map();
    loadEventCommands() {
        const events = ['tokenReserved', 'throttled', 'queued', 'circuitBreaker', 'surgeGuard', 'bucketRefilled', 'tokenRefunded', 'queueExecuted', 'policyChanged'];
        const fs = require('fs');
        const path = require('path');
        // Try to find the bot's events directory
        const possiblePaths = [
            path.join(process.cwd(), 'events'),
            path.join(__dirname, '../../../events'),
            path.join(__dirname, '../../../../events')
        ];
        let eventsDir = null;
        for (const dirPath of possiblePaths) {
            if (fs.existsSync(dirPath)) {
                eventsDir = dirPath;
                break;
            }
        }
        if (!eventsDir) {
            console.log('[ForgeRateLimit] No events directory found, skipping event command loading');
            return;
        }
        console.log(`[ForgeRateLimit] Loading event commands from: ${eventsDir}`);
        events.forEach(eventName => {
            const eventFile = path.join(eventsDir, `${eventName}.js`);
            if (fs.existsSync(eventFile)) {
                try {
                    // Clear require cache to get fresh file
                    delete require.cache[require.resolve(eventFile)];
                    const eventCommand = require(eventFile);
                    if (eventCommand && eventCommand.code) {
                        console.log(`[ForgeRateLimit] Loading event command: ${eventName}`);
                        // Compile the ForgeScript code
                        const { Compiler } = require('@tryforge/forgescript');
                        const compiled = Compiler.compile(eventCommand.code, eventName);
                        // Store the compiled command
                        this.eventCommands.set(eventName, {
                            name: eventName,
                            code: eventCommand.code,
                            compiled: compiled
                        });
                        console.log(`[ForgeRateLimit] Successfully loaded event command: ${eventName}`);
                    }
                }
                catch (error) {
                    console.error(`[ForgeRateLimit] Error loading event command ${eventName}:`, error);
                }
            }
        });
    }
    setupEventListeners(client) {
        const events = ['tokenReserved', 'throttled', 'queued', 'circuitBreaker', 'surgeGuard', 'bucketRefilled', 'tokenRefunded', 'queueExecuted', 'policyChanged'];
        events.forEach(eventName => {
            this.emitter.on(eventName, (data) => {
                console.log(`[ForgeRateLimit] Event ${eventName} triggered:`, data);
                // Get the event command
                const command = this.eventCommands.get(eventName);
                console.log(`[ForgeRateLimit] Found command for ${eventName}:`, !!command);
                if (command) {
                    console.log(`[ForgeRateLimit] Executing command for ${eventName}`);
                    // Create context with event data
                    const mockContext = {
                        obj: {},
                        client,
                        command,
                        data: command.compiled.code,
                        extras: data
                    };
                    // Execute the ForgeScript command
                    const { Interpreter } = require('@tryforge/forgescript');
                    Interpreter.run(mockContext).catch((err) => {
                        console.error(`[ForgeRateLimit] Error executing ${eventName} command:`, err);
                    });
                }
            });
        });
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
                maxRunsPerFlow: 4,
                queueThreshold: 15,
                maxQueueSize: 200
            },
            priorityClasses: {
                moderation: 1,
                system: 2,
                messaging: 3,
                heavy: 4
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
module.exports = { ForgeRateLimit };
module.exports.ForgeRateLimit = ForgeRateLimit;
module.exports.default = ForgeRateLimit;
//# sourceMappingURL=index.js.map