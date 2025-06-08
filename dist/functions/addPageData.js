"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$addPageData",
    version: "1.0.0",
    description: "Appends entries to an existing store.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Boolean,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "values", description: "Values to append", type: forgescript_1.ArgType.String, required: true, rest: false }
    ],
    async execute(ctx) {
        const id = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](id))
            return id;
        const values = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](values))
            return values;
        const store = ctx.client.pageStores?.get(id.value.trim());
        if (!store)
            return this.customError(`Store "${id.value}" does not exist`);
        store.data.push(...values.value.split(store.sep));
        return this.success(true);
    }
});
//# sourceMappingURL=addPageData.js.map