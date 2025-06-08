// Import functions directly
import pagesInit from "./functions/pagesInit.js";
import addPageData from "./functions/core/addPageData.js";
import removePageEntry from "./functions/core/removePageEntry.js";
import pagesList from "./functions/query/pagesList.js";
import pagesSlice from "./functions/query/pagesSlice.js";
import pageCount from "./functions/query/pageCount.js";
import searchPages from "./functions/query/searchPages.js";
import sortPages from "./functions/util/sortPages.js";
import { writeFileSync } from "fs";
import path from "path";

const functions = [
  pagesInit,
  addPageData,
  removePageEntry,
  pagesList,
  pagesSlice,
  pageCount,
  searchPages,
  sortPages
];

const lines: string[] = [
  "| Function | Description |",
  "|----------|-------------|"
];

for (const fn of functions) lines.push(`| \`${fn.data.name}\` | ${fn.data.description} |`);

writeFileSync(path.resolve("FUNCTIONS.md"), lines.join("\n"));
console.log("FUNCTIONS.md updated"); 