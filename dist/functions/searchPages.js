"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$searchPages",
    version: "1.0.0",
    description: "Finds the page on which a query first appears.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "query", description: "Search query", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "per", description: "Items per page", type: forgescript_1.ArgType.Number, required: false, rest: false }
    ],
    execute(ctx, [id, q, perArg]) {
        const per = perArg ?? 10;
        const store = ctx.client.pageStores?.get(id);
        if (!store)
            return this.customError(`Store "${id}" does not exist`);
        const idx = store.data.findIndex(v => v.toLowerCase().includes(q.toLowerCase()));
        if (idx === -1)
            return this.success(0);
        return this.success(Math.floor(idx / per) + 1);
    }
});
//# sourceMappingURL=searchPages.js.map