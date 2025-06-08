import { ArgType, NativeFunction, Return } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$searchPages",
  version: "1.0.0",
  description: "Finds the page on which a query first appears.",
  brackets: true,
  unwrap: true,
  output: ArgType.Number,
  args: [
    { name: "id", description: "Store identifier", type: ArgType.String, required: true, rest: false },
    { name: "query", description: "Search query", type: ArgType.String, required: true, rest: false },
    { name: "per", description: "Items per page", type: ArgType.Number, required: false, rest: false }
  ],
  async execute(ctx) {
    const id: Return = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](id)) return id;

    const q: Return = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](q)) return q;

    const perArg: Return = await this["resolveUnhandledArg"](ctx, 2);
    if (!this["isValidReturnType"](perArg)) return perArg;

    const per = (perArg.value as number) ?? 10;
    const store = ctx.client.pageStores?.get((id.value as string).trim());
    if (!store) return this.customError(`Store "${id.value}" does not exist`);

    const idx = store.data.findIndex(v => v.toLowerCase().includes((q.value as string).toLowerCase()));
    if (idx === -1) return this.success(0);

    return this.success(Math.floor(idx / per) + 1);
  }
}); 