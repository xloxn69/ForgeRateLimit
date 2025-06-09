import { ArgType, NativeFunction, Return } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$advancedSearchPages",
  version: "1.1.0",
  description: "Filters entries via a snippet that must return true.",
  brackets: true,
  unwrap: true,
  output: ArgType.String,
  args: [
    { name: "id", description: "Store identifier", type: ArgType.String, required: true, rest: false },
    { name: "code", description: "ForgeScript code to execute against each entry", type: ArgType.String, required: true, rest: false },
    { name: "per", description: "Items per page (unused, for compatibility)", type: ArgType.Number, required: false, rest: false }
  ],
  async execute(ctx) {
    const id: Return = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](id)) return id;

    const codeArg: Return = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](codeArg)) return codeArg;

    const perArg: Return = await this["resolveUnhandledArg"](ctx, 2);
    if (!this["isValidReturnType"](perArg)) return perArg;

    const store = ctx.client.pageStores?.get((id.value as string).trim());
    if (!store) return this.customError(`Store "${id.value}" does not exist`);

    // Compile the user's ForgeScript code snippet once using ctx.processor
    const compiledCode = await (ctx as any).processor.compile(codeArg.value as string);
    if (!compiledCode) return this.customError("Failed to compile code snippet");

    const hits: string[] = [];
    
    // Loop through each entry in the store
    for (const entry of store.data) {
      // Inject the current entry into the ForgeScript environment as 'd'
      (ctx as any).processor.vars.set("d", entry);

      // Execute the user's code snippet using this.resolveCode
      const result = await this["resolveCode"](ctx, compiledCode);
      
      // If the snippet returns true, add this entry to hits
      if (result?.value === true || result?.value === "true") {
        hits.push(entry);
      }
    }

    // Clean up the environment variable
    (ctx as any).processor.vars.delete("d");

    // Return all matching entries joined by the store separator
    return this.success(hits.join(store.sep));
  }
}); 