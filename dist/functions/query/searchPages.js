"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$advancedSearchPages",
    version: "1.0.0",
    description: "Runs your snippet against each page-store entry (bound to your variable) and returns those entries where it returns true.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.String,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "variable", description: "Variable name to bind each entry to", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "code", description: "ForgeScript code to execute against each entry", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "per", description: "Items per page (unused, for compatibility)", type: forgescript_1.ArgType.Number, required: false, rest: false }
    ],
    async execute(ctx) {
        // 1) Resolve args using the proper ForgeScript pattern
        const id = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](id))
            return id;
        const varName = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](varName))
            return varName;
        const codeArg = await this["resolveUnhandledArg"](ctx, 2);
        if (!this["isValidReturnType"](codeArg))
            return codeArg;
        const perArg = await this["resolveUnhandledArg"](ctx, 3);
        if (!this["isValidReturnType"](perArg))
            return perArg;
        // 2) Lookup your store
        const store = ctx.client.pageStores?.get(id.value.trim());
        if (!store)
            return this.customError(`Store "${id.value}" not found`);
        // 3) Compile the user's code just once
        const compiled = await ctx.processor.compile(codeArg.value);
        if (!compiled)
            return this.customError("Failed to compile code snippet");
        const hits = [];
        const variableName = varName.value.trim();
        // 4) For each entry in store.data...
        for (const entry of store.data) {
            // Bind it into $env[varName]
            ctx.setEnvironmentKey(variableName, entry);
            // Execute your snippet
            const result = await this["resolveCode"](ctx, compiled);
            if (!this["isValidReturnType"](result))
                return result;
            // If it returned truthy, collect that entry
            if (result.value === true)
                hits.push(entry);
        }
        // 5) Return all hits joined by the store's separator
        return this.success(hits.join(store.sep));
    }
});
//# sourceMappingURL=searchPages.js.map