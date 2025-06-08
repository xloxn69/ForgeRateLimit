import { ArgType, NativeFunction, Return } from "@tryforge/forgescript";
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
  async execute(ctx) {
    if (!ctx.client.pageStores) ctx.client.pageStores = new Map();

    const id: Return = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](id)) return id;

    const sep: Return = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](sep)) return sep;

    const raw: Return = await this["resolveUnhandledArg"](ctx, 2);
    if (!this["isValidReturnType"](raw)) return raw;

    const store: PageStore = {
      sep: sep.value as string,
      data: (raw.value as string).split(sep.value as string)
    };

    ctx.client.pageStores.set((id.value as string).trim(), store);
    return this.success(true);
  }
}); 