import { ArgType, NativeFunction } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$pageCount",
  version: "1.0.0",
  description: "How many pages the store has at N per-page.",
  brackets: true,
  unwrap: true,
  output: ArgType.Number,
  args: [
    { name: "id", description: "Store identifier", type: ArgType.String, required: true, rest: false },
    { name: "per", description: "Items per page", type: ArgType.Number, required: false, rest: false }
  ],
  execute(ctx, [id, perArg]) {
    const per = perArg ?? 10;

    const store = ctx.client.pageStores?.get(id);
    if (!store) return this.customError(`Store "${id}" does not exist`);

    const pages = Math.ceil(store.data.length / per);
    return this.success(pages);
  }
}); 