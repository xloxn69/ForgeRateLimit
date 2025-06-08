import { ArgType, NativeFunction } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$addPageData",
  version: "1.0.0",
  description: "Appends entries to an existing store.",
  brackets: true,
  unwrap: true,
  output: ArgType.Boolean,
  args: [
    { name: "id", description: "Store identifier", type: ArgType.String, required: true, rest: false },
    { name: "values", description: "Values to append", type: ArgType.String, required: true, rest: false }
  ],
  execute(ctx, [id, values]) {
    const store = ctx.client.pageStores?.get(id);
    if (!store) return this.customError(`Store "${id}" does not exist`);

    store.data.push(...values.split(store.sep));
    return this.success(true);
  }
}); 