import { ArgType, NativeFunction, Return } from "@tryforge/forgescript";

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
  async execute(ctx) {
    const id: Return = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](id)) return id;

    const start: Return = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](start)) return start;

    const count: Return = await this["resolveUnhandledArg"](ctx, 2);
    if (!this["isValidReturnType"](count)) return count;

    const store = ctx.client.pageStores?.get((id.value as string).trim());
    if (!store) return this.customError(`Store "${id.value}" does not exist`);

    const slice = store.data.slice((start.value as number) - 1, (start.value as number) - 1 + (count.value as number));
    return this.success(slice.join(store.sep));
  }
}); 