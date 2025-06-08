import { ArgType, NativeFunction } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$pagesList",
  version: "1.0.0",
  description: "Returns a fixed-width page of data.",
  brackets: true,
  unwrap: true,
  output: ArgType.String,
  args: [
    { name: "id", description: "Store identifier", type: ArgType.String, required: true, rest: false },
    { name: "page", description: "Page number to get", type: ArgType.Number, required: true, rest: false },
    { name: "per", description: "Items per page", type: ArgType.Number, required: true, rest: false }
  ],
  execute(ctx, [id, page, per]) {
    const store = ctx.client.pageStores?.get(id);
    if (!store) return this.customError(`Store "${id}" does not exist`);

    const start = (page - 1) * per;
    const slice = store.data.slice(start, start + per);
    return this.success(slice.join(store.sep));
  }
}); 