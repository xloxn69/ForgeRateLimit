"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$advancedSearchPages",
    version: "1.0.0",
    description: "Maps through each entry in a paging store, runs code for each entry, and returns all results joined by separator.",
    brackets: true,
    unwrap: false,
    output: forgescript_1.ArgType.String,
    args: [
        {
            name: "id",
            description: "The store identifier",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "variable",
            description: "The name of the variable to assign each entry to",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "code",
            description: "ForgeScript code to execute for each entry (use $return to output values)",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx) {
        // destructure the raw function‐argument fields
        const [idField, varField, codeField] = this.data.fields;
        // resolve the store ID
        const idRet = (await this["resolveCode"](ctx, idField));
        if (!this["isValidReturnType"](idRet))
            return idRet;
        const storeId = idRet.value.trim();
        // resolve the loop variable name
        const varRet = (await this["resolveCode"](ctx, varField));
        if (!this["isValidReturnType"](varRet))
            return varRet;
        const varName = varRet.value;
        // fetch your paging store
        const store = ctx.client.pageStores?.get(storeId);
        if (!store)
            return this.customError(`Store "${storeId}" not found`);
        const results = [];
        // iterate every entry
        for (const entry of store.data) {
            // bind this entry to $env[varName]
            ctx.setEnvironmentKey(varName, entry);
            // run the user's snippet - use the raw code field like $arrayMap does
            const rt = (await this["resolveCode"](ctx, codeField));
            // if code used $return, collect the returned value
            if (rt.return) {
                results.push(String(rt.value));
            }
            else if (!this["isValidReturnType"](rt)) {
                return rt;
            }
        }
        // return the results joined by the store's separator
        return this.success(results.join(store.sep));
    }
});
//# sourceMappingURL=searchPages.js.map