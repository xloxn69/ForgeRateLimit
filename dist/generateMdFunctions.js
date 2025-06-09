"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import functions directly
const pagesInit_js_1 = __importDefault(require("./functions/pagesInit.js"));
const addPageData_js_1 = __importDefault(require("./functions/core/addPageData.js"));
const removePageEntry_js_1 = __importDefault(require("./functions/core/removePageEntry.js"));
const pagesList_js_1 = __importDefault(require("./functions/query/pagesList.js"));
const pagesSlice_js_1 = __importDefault(require("./functions/query/pagesSlice.js"));
const pageCount_js_1 = __importDefault(require("./functions/query/pageCount.js"));
const basicSearchPages_js_1 = __importDefault(require("./functions/query/basicSearchPages.js"));
const searchPages_js_1 = __importDefault(require("./functions/query/searchPages.js"));
const sortPages_js_1 = __importDefault(require("./functions/util/sortPages.js"));
const advancedSortPages_js_1 = __importDefault(require("./functions/util/advancedSortPages.js"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const functions = [
    pagesInit_js_1.default,
    addPageData_js_1.default,
    removePageEntry_js_1.default,
    pagesList_js_1.default,
    pagesSlice_js_1.default,
    pageCount_js_1.default,
    basicSearchPages_js_1.default,
    searchPages_js_1.default,
    sortPages_js_1.default,
    advancedSortPages_js_1.default
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