// Export all functions for manual registration
import pagesInit from "./core/pagesInit.js";
import addPageData from "./core/addPageData.js";
import removePageEntry from "./core/removePageEntry.js";
import pagesList from "./query/pagesList.js";
import pagesSlice from "./query/pagesSlice.js";
import pageCount from "./query/pageCount.js";
import searchPages from "./query/searchPages.js";
import sortPages from "./util/sortPages.js";

export default [
  pagesInit,
  addPageData,
  removePageEntry,
  pagesList,
  pagesSlice,
  pageCount,
  searchPages,
  sortPages
]; 