import { ForgeExtension } from "@tryforge/forgescript";
import * as fn from "./functions.js";

/** ForgePages – infinite pagination utilities for ForgeScript */
export class ForgePages extends ForgeExtension {
  constructor() {
    super({
      name: "ForgePages",
      version: "1.0.0",
      author: "xloxn69"
    });

    // Use Map for now; swap to ForgeDB vars if you need persistence
    this.stores = new Map();

    /* helper to avoid repetition */
    const reg = (name, exec, returns = "String") =>
      this.addNativeFunction({
        name,
        brackets: true,
        unwrap: true,
        returns,
        version: "1.0.0",
        execute: exec
      });

    /** ───── core functions ───── */
    reg("$pagesInit",   (_c, a) => fn.init(this.stores, ...a),        "Boolean");
    reg("$pagesList",   (_c, a) => fn.list(this.stores, ...a));
    reg("$pagesSlice",  (_c, a) => fn.slice(this.stores, ...a));
    reg("$pageCount",   (_c, a) => fn.count(this.stores, ...a),       "Number");
    reg("$addPageData", (_c, a) => fn.add(this.stores, ...a),         "Boolean");
    reg("$removePageEntry", (_c,a)=> fn.remove(this.stores, ...a),    "Boolean");
    reg("$sortPages",   (_c, a) => fn.sort(this.stores, ...a),        "Boolean");
    reg("$searchPages", (_c, a) => fn.search(this.stores, ...a),      "Number");
  }
}