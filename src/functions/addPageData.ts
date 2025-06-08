import { ArgType, NativeFunction, Return } from "@tryforge/forgescript";

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
  async execute(ctx) {
    const id: Return = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](id)) return id;

    const values: Return = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](values)) return values;

    const store = ctx.client.pageStores?.get((id.value as string).trim());
    if (!store) return this.customError(`Store "${id.value}" does not exist`);

    store.data.push(...(values.value as string).split(store.sep));
    return this.success(true);
  }
}); 