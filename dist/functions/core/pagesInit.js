"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$pagesInit",
    version: "1.0.0",
    description: "Creates / overwrites a paging store.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Boolean,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "sep", description: "Separator to split data", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "rawData", description: "Raw data string to split", type: forgescript_1.ArgType.String, required: true, rest: false }
    ],
    async execute(ctx, [id, sep, raw]) {
        if (!ctx.client.pageStores)
            ctx.client.pageStores = new Map();
        const store = {
            sep,
            data: raw.split(sep)
        };
        ctx.client.pageStores.set(id, store);
        return this.success(true);
    }
});
//# sourceMappingURL=pagesInit.js.map