"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$advancedSearchPages",
    version: "1.1.0",
    description: "Filters entries via a snippet that must return true.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.String,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "code", description: "ForgeScript code to execute against each entry", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "per", description: "Items per page (unused, for compatibility)", type: forgescript_1.ArgType.Number, required: false, rest: false }
    ],
    async execute(ctx) {
        const id = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](id))
            return id;
        const codeArg = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](codeArg))
            return codeArg;
        const perArg = await this["resolveUnhandledArg"](ctx, 2);
        if (!this["isValidReturnType"](perArg))
            return perArg;
        const store = ctx.client.pageStores?.get(id.value.trim());
        if (!store)
            return this.customError(`Store "${id.value}" does not exist`);
        // Compile the user's ForgeScript code snippet once using ctx.processor
        const compiledCode = await ctx.processor.compile(codeArg.value);
        if (!compiledCode)
            return this.customError("Failed to compile code snippet");
        const hits = [];
        // Loop through each entry in the store
        for (const entry of store.data) {
            // Inject the current entry into the ForgeScript environment as 'd'
            ctx.processor.vars.set("d", entry);
            // Execute the user's code snippet using this.resolveCode
            const result = await this["resolveCode"](ctx, compiledCode);
            // If the snippet returns true, add this entry to hits
            if (result?.value === true || result?.value === "true") {
                hits.push(entry);
            }
        }
        // Clean up the environment variable
        ctx.processor.vars.delete("d");
        // Return all matching entries joined by the store separator
        return this.success(hits.join(store.sep));
    }
});
//# sourceMappingURL=searchPages.js.map