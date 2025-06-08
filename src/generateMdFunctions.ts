// Import functions directly
import pagesInit from "./functions/pagesInit.js";
import addPageData from "./functions/addPageData.js";
import removePageEntry from "./functions/removePageEntry.js";
import pagesList from "./functions/pagesList.js";
import pagesSlice from "./functions/pagesSlice.js";
import pageCount from "./functions/pageCount.js";
import searchPages from "./functions/searchPages.js";
import sortPages from "./functions/sortPages.js";
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