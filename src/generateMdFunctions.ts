// Import functions directly
import estimateCost from "./functions/core/estimateCost.js";
import reserveTokens from "./functions/core/reserveTokens.js";
import refundTokens from "./functions/core/refundTokens.js";
import getBucketInfo from "./functions/buckets/getBucketInfo.js";
import addToQueue from "./functions/queue/addToQueue.js";
import getRateLimitStats from "./functions/monitoring/getRateLimitStats.js";
import { writeFileSync } from "fs";
import path from "path";

const functions = [
  estimateCost,
  reserveTokens,
  refundTokens,
  getBucketInfo,
  addToQueue,
  getRateLimitStats
];

const lines: string[] = [
  "| Function | Description |",
  "|----------|-------------|"
];

for (const fn of functions) lines.push(`| \`${fn.data.name}\` | ${fn.data.description} |`);

writeFileSync(path.resolve("FUNCTIONS.md"), lines.join("\n"));
console.log("FUNCTIONS.md updated"); 