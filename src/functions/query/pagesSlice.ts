import { ArgType, NativeFunction } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$pagesSlice",
  version: "1.0.0",
  description: "Returns an arbitrary slice from start, count.",
  brackets: true,
  unwrap: true,
  output: ArgType.String,
  args: [
    { name: "id", description: "Store identifier", type: ArgType.String, required: true, rest: false },
    { name: "startIndex", description: "1-based start index", type: ArgType.Number, required: true, rest: false },
    { name: "count", description: "Number of items to get", type: ArgType.Number, required: true, rest: false }
  ],
  execute(ctx, [id, start, count]) {
    const store = ctx.client.pageStores?.get(id);
    if (!store) return this.customError(`Store "${id}" does not exist`);

    const slice = store.data.slice(start - 1, start - 1 + count);
    return this.success(slice.join(store.sep));
  }
}); 