import {
  ArgType,
  IExtendedCompiledFunctionField,
  NativeFunction,
  Return
} from "@tryforge/forgescript";
import type { PageStore } from "../../types.js";

export default new NativeFunction({
  name: "$advancedSearchPages",
  version: "1.0.0",
  description:
    "Loops through each entry in a paging store (bound to your variable), runs your code snippet, and returns all entries where it returned true.",
  brackets: true,
  unwrap: false,
  output: ArgType.String,
  args: [
    {
      name: "id",
      description: "The store identifier",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "variable",
      description: "The name of the variable to assign each entry to",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "code",
      description: "ForgeScript code to execute for each entry (must return true/false)",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "per",
      description: "Optional items‐per‐page (currently unused—just for API consistency)",
      type: ArgType.Number,
      required: false,
      rest: false
    }
  ],

  async execute(ctx) {
    // destructure the raw function‐argument fields
    const [idField, varField, codeField] =
      this.data.fields! as IExtendedCompiledFunctionField[];

    // resolve the store ID
    const idRet: Return = (await this["resolveCode"](ctx, idField)) as Return;
    if (!this["isValidReturnType"](idRet)) return idRet;
    const storeId = (idRet.value as string).trim();

    // resolve the loop variable name
    const varRet: Return = (await this["resolveCode"](ctx, varField)) as Return;
    if (!this["isValidReturnType"](varRet)) return varRet;
    const varName = varRet.value as string;

    // fetch your paging store
    const store = ctx.client.pageStores?.get(storeId);
    if (!store) return this.customError(`Store "${storeId}" not found`);

    const hits: string[] = [];

    // iterate every entry
    for (const entry of store.data) {
      // bind this entry to $env[varName]
      ctx.setEnvironmentKey(varName, entry);

      // run the user's snippet
      const rt: Return = (await this["resolveCode"](ctx, codeField)) as Return;
      if (!this["isValidReturnType"](rt)) return rt;

      // collect only those where snippet returned true
      if (rt.value === true) hits.push(entry);
    }

    // return the filtered entries joined by the store's separator
    return this.success(hits.join(store.sep));
  }
}); 