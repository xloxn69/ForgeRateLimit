"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$advancedSearchPages",
    version: "1.1.0",
    description: "Runs your snippet against each page-store entry (bound to your variable) and returns those entries where it returns true.",
    brackets: true,
    unwrap: false,
    output: forgescript_1.ArgType.String,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "variable", description: "The variable to load the entry value to", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "code", description: "The code to execute for every entry", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "per", description: "Items per page (unused, for compatibility)", type: forgescript_1.ArgType.Number, required: false, rest: false }
    ],
    async execute(ctx) {
        const [idField, varField, codeField, perField] = this.data.fields;
        // 1) Resolve args
        const id = await this["resolveCode"](ctx, idField);
        if (!this["isValidReturnType"](id))
            return id;
        const variable = await this["resolveCode"](ctx, varField);
        if (!this["isValidReturnType"](variable))
            return variable;
        const varName = variable.value;
        const storeId = id.value.trim();
        // 2) Lookup your store
        const store = ctx.client.pageStores?.get(storeId);
        if (!store)
            return this.customError(`Store "${storeId}" not found`);
        // 3) Compile the user's code just once
        const compiled = await ctx.processor.compile(codeField);
        if (!compiled)
            return this.customError("Failed to compile code snippet");
        const hits = [];
        // 4) For each entry in store.data...
        for (const entry of store.data) {
            // Bind it into $env[varName]
            ctx.setEnvironmentKey(varName, entry);
            // Execute your snippet
            const result = await this["resolveCode"](ctx, compiled);
            if (!this["isValidReturnType"](result))
                return result;
            // If it returned truthy, collect that entry
            if (result.value === true || result.value === "true") {
                hits.push(entry);
            }
        }
        // 5) Return all hits joined by the store's separator
        return this.success(hits.join(store.sep));
    }
});
//# sourceMappingURL=searchPages.js.map