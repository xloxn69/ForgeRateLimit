"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import functions directly
const estimateCost_js_1 = __importDefault(require("./functions/core/estimateCost.js"));
const reserveTokens_js_1 = __importDefault(require("./functions/core/reserveTokens.js"));
const refundTokens_js_1 = __importDefault(require("./functions/core/refundTokens.js"));
const getBucketInfo_js_1 = __importDefault(require("./functions/buckets/getBucketInfo.js"));
const addToQueue_js_1 = __importDefault(require("./functions/queue/addToQueue.js"));
const getRateLimitStats_js_1 = __importDefault(require("./functions/monitoring/getRateLimitStats.js"));
const eventData_js_1 = __importDefault(require("./functions/events/eventData.js"));
const throttleReason_js_1 = __importDefault(require("./functions/events/throttleReason.js"));
const eventTimestamp_js_1 = __importDefault(require("./functions/events/eventTimestamp.js"));
const openCircuitBreaker_js_1 = __importDefault(require("./functions/circuitBreaker/openCircuitBreaker.js"));
const checkCircuitBreaker_js_1 = __importDefault(require("./functions/circuitBreaker/checkCircuitBreaker.js"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const functions = [
    estimateCost_js_1.default,
    reserveTokens_js_1.default,
    refundTokens_js_1.default,
    getBucketInfo_js_1.default,
    addToQueue_js_1.default,
    getRateLimitStats_js_1.default,
    eventData_js_1.default,
    throttleReason_js_1.default,
    eventTimestamp_js_1.default,
    openCircuitBreaker_js_1.default,
    checkCircuitBreaker_js_1.default
];
const lines = [
    "| Function | Description |",
    "|----------|-------------|"
];
for (const fn of functions)
    lines.push(`| \`${fn.data.name}\` | ${fn.data.description} |`);
(0, fs_1.writeFileSync)(path_1.default.resolve("FUNCTIONS.md"), lines.join("\n"));
console.log("FUNCTIONS.md updated");
//# sourceMappingURL=generateMdFunctions.js.map