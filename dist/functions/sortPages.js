"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$sortPages",
    version: "1.0.0",
    description: "Alphabetically sorts a store asc/desc.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Boolean,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "direction", description: "Sort direction (asc/desc)", type: forgescript_1.ArgType.String, required: false, rest: false }
    ],
    execute(ctx, [id, dir]) {
        const store = ctx.client.pageStores?.get(id);
        if (!store)
            return this.customError(`Store "${id}" does not exist`);
        store.data.sort((a, b) => dir?.toLowerCase() === "desc"
            ? b.localeCompare(a)
            : a.localeCompare(b));
        return this.success(true);
    }
});
//# sourceMappingURL=sortPages.js.map