"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$removePageEntry",
    version: "1.0.0",
    description: "Deletes one entry by 1-based index.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Boolean,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "index", description: "1-based index to remove", type: forgescript_1.ArgType.Number, required: true, rest: false }
    ],
    execute(ctx, [id, num]) {
        const store = ctx.client.pageStores?.get(id);
        if (!store)
            return this.customError(`Store "${id}" does not exist`);
        const i = num - 1;
        if (i < 0 || i >= store.data.length)
            return this.success(false);
        store.data.splice(i, 1);
        return this.success(true);
    }
});
//# sourceMappingURL=removePageEntry.js.map