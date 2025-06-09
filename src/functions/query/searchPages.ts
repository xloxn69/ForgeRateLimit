import {
  ArgType,
  NativeFunction,
  Return
} from "@tryforge/forgescript";
import type { PageStore } from "../../types.js";

export default new NativeFunction({
  name: "$advancedSearchPages",
  version: "1.0.0",
  description:
    "Runs your snippet against each page-store entry (bound to your variable) and returns those entries where it returns true.",
  brackets: true,
  unwrap: true,
  output: ArgType.String,
  args: [
    { name: "id", description: "Store identifier", type: ArgType.String, required: true, rest: false },
    { name: "variable", description: "Variable name to bind each entry to", type: ArgType.String, required: true, rest: false },
    { name: "code", description: "ForgeScript code to execute against each entry", type: ArgType.String, required: true, rest: false },
    { name: "per", description: "Items per page (unused, for compatibility)", type: ArgType.Number, required: false, rest: false }
  ],

  async execute(ctx) {
    // 1) Resolve args using the proper ForgeScript pattern
    const id: Return = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](id)) return id;

    const varName: Return = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](varName)) return varName;

    const codeArg: Return = await this["resolveUnhandledArg"](ctx, 2);
    if (!this["isValidReturnType"](codeArg)) return codeArg;

    const perArg: Return = await this["resolveUnhandledArg"](ctx, 3);
    if (!this["isValidReturnType"](perArg)) return perArg;

    // 2) Lookup your store
    const store: PageStore | undefined = ctx.client.pageStores?.get((id.value as string).trim());
    if (!store) return this.customError(`Store "${id.value}" not found`);

    const hits: string[] = [];
    const variableName = (varName.value as string).trim();
    const codeSnippet = codeArg.value as string;
    
    // 3) For each entry in store.data...
    for (const entry of store.data) {
      // Try to execute the code snippet with the entry bound to the variable
      try {
        // Set the variable in the context environment
        ctx.setEnvironmentKey(variableName, entry);

        // Create a temporary snippet that evaluates the user's code and returns the result
        const tempCode = `$return[${codeSnippet}]`;
        
        // Try to resolve the code directly
        const result = await this["resolveCode"](ctx, tempCode);
        if (!this["isValidReturnType"](result)) continue;

        // If it returned truthy, collect that entry
        if (result.value === true) hits.push(entry);
      } catch (error) {
        // Skip entries that cause errors in evaluation
        continue;
      }
    }

    // 4) Return all hits joined by the store's separator
    return this.success(hits.join(store.sep));
  }
}); 