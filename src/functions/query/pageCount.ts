import { ArgType, NativeFunction, Return } from "@tryforge/forgescript";

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
  async execute(ctx) {
    const id: Return = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](id)) return id;

    const perArg: Return = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](perArg)) return perArg;

    const per = (perArg.value as number) ?? 10;

    const store = ctx.client.pageStores?.get((id.value as string).trim());
    if (!store) return this.customError(`Store "${id.value}" does not exist`);

    const pages = Math.ceil(store.data.length / per);
    return this.success(pages);
  }
}); 