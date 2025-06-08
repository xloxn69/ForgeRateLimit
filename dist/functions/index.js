"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// export an array ForgeScript's extension loader can consume
const pagesInit_js_1 = __importDefault(require("./core/pagesInit.js"));
const addPageData_js_1 = __importDefault(require("./core/addPageData.js"));
const removePageEntry_js_1 = __importDefault(require("./core/removePageEntry.js"));
const pagesList_js_1 = __importDefault(require("./query/pagesList.js"));
const pagesSlice_js_1 = __importDefault(require("./query/pagesSlice.js"));
const pageCount_js_1 = __importDefault(require("./query/pageCount.js"));
const searchPages_js_1 = __importDefault(require("./query/searchPages.js"));
const sortPages_js_1 = __importDefault(require("./util/sortPages.js"));
exports.default = [
    pagesInit_js_1.default,
    addPageData_js_1.default,
    removePageEntry_js_1.default,
    pagesList_js_1.default,
    pagesSlice_js_1.default,
    pageCount_js_1.default,
    searchPages_js_1.default,
    sortPages_js_1.default
];
//# sourceMappingURL=index.js.map