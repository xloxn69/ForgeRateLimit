import { ArgType, NativeFunction } from "@tryforge/forgescript";
import type { PageStore } from "../types.js";

export default new NativeFunction({
  name: "$pagesInit",
  version: "1.0.0",
  description: "Creates / overwrites a paging store.",
  brackets: true,
  unwrap: true,
  output: ArgType.Boolean,
  args: [
    { name: "id", description: "Store identifier", type: ArgType.String, required: true, rest: false },
    { name: "sep", description: "Separator to split data", type: ArgType.String, required: true, rest: false },
    { name: "rawData", description: "Raw data string to split", type: ArgType.String, required: true, rest: false }
  ],
  async execute(ctx, [id, sep, raw]) {
    if (!ctx.client.pageStores) ctx.client.pageStores = new Map();

    const store: PageStore = {
      sep,
      data: raw.split(sep)
    };

    ctx.client.pageStores.set(id, store);
    return this.success(true);
  }
}); 