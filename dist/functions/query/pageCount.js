"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$pageCount",
    version: "1.0.0",
    description: "How many pages the store has at N per-page.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "per", description: "Items per page", type: forgescript_1.ArgType.Number, required: false, rest: false }
    ],
    async execute(ctx) {
        const id = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](id))
            return id;
        const perArg = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](perArg))
            return perArg;
        const per = perArg.value ?? 10;
        const store = ctx.client.pageStores?.get(id.value.trim());
        if (!store)
            return this.customError(`Store "${id.value}" does not exist`);
        const pages = Math.ceil(store.data.length / per);
        return this.success(pages);
    }
});
//# sourceMappingURL=pageCount.js.map