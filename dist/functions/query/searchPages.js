"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$advancedSearchPages",
    version: "1.0.0",
    description: "Loops through each entry in a paging store (bound to your variable), runs your code snippet, and returns all entries where it returned true.",
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
            description: "ForgeScript code to execute for each entry (must return true/false)",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "per",
            description: "Optional items‐per‐page (currently unused—just for API consistency)",
            type: forgescript_1.ArgType.Number,
            required: false,
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
        const hits = [];
        // iterate every entry
        for (const entry of store.data) {
            // bind this entry to $env[varName]
            ctx.setEnvironmentKey(varName, entry);
            // run the user's snippet
            const rt = (await this["resolveCode"](ctx, codeField));
            if (!this["isValidReturnType"](rt))
                return rt;
            // collect only those where snippet returned true
            if (rt.value === true)
                hits.push(entry);
        }
        // return the filtered entries joined by the store's separator
        return this.success(hits.join(store.sep));
    }
});
//# sourceMappingURL=searchPages.js.map