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
    "Maps through each entry in a paging store, runs code for each entry, and returns all results joined by separator.",
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
      description: "ForgeScript code to execute for each entry (use $return to output values)",
      type: ArgType.String,
      required: true,
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

    const results: string[] = [];

    // iterate every entry
    for (const entry of store.data) {
      // bind this entry to $env[varName]
      ctx.setEnvironmentKey(varName, entry);

      // run the user's snippet
      const rt: Return = (await this["resolveCode"](ctx, codeField)) as Return;
      
      // if code used $return, collect the returned value
      if (rt.return) {
        results.push(String(rt.value));
      } else if (!this["isValidReturnType"](rt)) {
        return rt;
      }
    }

    // return the results joined by the store's separator
    return this.success(results.join(store.sep));
  }
}); 