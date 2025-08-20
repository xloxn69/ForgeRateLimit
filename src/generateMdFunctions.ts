// Import functions directly
import estimateCost from "./functions/core/estimateCost.js";
import reserveTokens from "./functions/core/reserveTokens.js";
import refundTokens from "./functions/core/refundTokens.js";
import getBucketInfo from "./functions/buckets/getBucketInfo.js";
import addToQueue from "./functions/queue/addToQueue.js";
import getRateLimitStats from "./functions/monitoring/getRateLimitStats.js";
import eventData from "./functions/events/eventData.js";
import throttleReason from "./functions/events/throttleReason.js";
import eventTimestamp from "./functions/events/eventTimestamp.js";
import openCircuitBreaker from "./functions/circuitBreaker/openCircuitBreaker.js";
import checkCircuitBreaker from "./functions/circuitBreaker/checkCircuitBreaker.js";
import { writeFileSync } from "fs";
import path from "path";

const functions = [
  estimateCost,
  reserveTokens,
  refundTokens,
  getBucketInfo,
  addToQueue,
  getRateLimitStats,
  eventData,
  throttleReason,
  eventTimestamp,
  openCircuitBreaker,
  checkCircuitBreaker
];

const lines: string[] = [
  "| Function | Description |",
  "|----------|-------------|"
];

for (const fn of functions) lines.push(`| \`${fn.data.name}\` | ${fn.data.description} |`);

writeFileSync(path.resolve("FUNCTIONS.md"), lines.join("\n"));
console.log("FUNCTIONS.md updated"); 