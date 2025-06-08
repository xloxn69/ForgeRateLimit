import { ArgType, NativeFunction, Return } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$sortPages",
  version: "1.0.0",
  description: "Alphabetically sorts a store asc/desc.",
  brackets: true,
  unwrap: true,
  output: ArgType.Boolean,
  args: [
    { name: "id", description: "Store identifier", type: ArgType.String, required: true, rest: false },
    { name: "direction", description: "Sort direction (asc/desc)", type: ArgType.String, required: false, rest: false }
  ],
  async execute(ctx) {
    const id: Return = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](id)) return id;

    const dir: Return = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](dir)) return dir;

    const store = ctx.client.pageStores?.get((id.value as string).trim());
    if (!store) return this.customError(`Store "${id.value}" does not exist`);

    store.data.sort((a, b) =>
      (dir.value as string)?.toLowerCase() === "desc"
        ? b.localeCompare(a)
        : a.localeCompare(b)
    );
    return this.success(true);
  }
}); 