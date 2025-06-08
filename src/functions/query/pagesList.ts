import { ArgType, NativeFunction, Return } from "@tryforge/forgescript";

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
  async execute(ctx) {
    const id: Return = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](id)) return id;

    const page: Return = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](page)) return page;

    const per: Return = await this["resolveUnhandledArg"](ctx, 2);
    if (!this["isValidReturnType"](per)) return per;

    const store = ctx.client.pageStores?.get((id.value as string).trim());
    if (!store) return this.customError(`Store "${id.value}" does not exist`);

    const start = ((page.value as number) - 1) * (per.value as number);
    const slice = store.data.slice(start, start + (per.value as number));
    return this.success(slice.join(store.sep));
  }
}); 