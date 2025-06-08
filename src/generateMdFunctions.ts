import functions from "./functions/index.js";
import { writeFileSync } from "fs";
import path from "path";

const lines: string[] = [
  "| Function | Description |",
  "|----------|-------------|"
];

for (const fn of functions) lines.push(`| \`${fn.data.name}\` | ${fn.data.description} |`);

writeFileSync(path.resolve("FUNCTIONS.md"), lines.join("\n"));
console.log("FUNCTIONS.md updated"); 