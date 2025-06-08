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
    async execute(ctx) {
        if (!ctx.client.pageStores)
            ctx.client.pageStores = new Map();
        const id = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](id))
            return id;
        const sep = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](sep))
            return sep;
        const raw = await this["resolveUnhandledArg"](ctx, 2);
        if (!this["isValidReturnType"](raw))
            return raw;
        const store = {
            sep: sep.value,
            data: raw.value.split(sep.value)
        };
        ctx.client.pageStores.set(id.value.trim(), store);
        return this.success(true);
    }
});
//# sourceMappingURL=pagesInit.js.map