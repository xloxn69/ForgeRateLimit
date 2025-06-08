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
    execute(ctx, [id, values]) {
        const store = ctx.client.pageStores?.get(id);
        if (!store)
            return this.customError(`Store "${id}" does not exist`);
        store.data.push(...values.split(store.sep));
        return this.success(true);
    }
});
//# sourceMappingURL=addPageData.js.map