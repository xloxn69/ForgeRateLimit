"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./functions/index.js"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const lines = [
    "| Function | Description |",
    "|----------|-------------|"
];
for (const fn of index_js_1.default)
    lines.push(`| \`${fn.data.name}\` | ${fn.data.description} |`);
(0, fs_1.writeFileSync)(path_1.default.resolve("FUNCTIONS.md"), lines.join("\n"));
console.log("FUNCTIONS.md updated");
//# sourceMappingURL=generateMdFunctions.js.map