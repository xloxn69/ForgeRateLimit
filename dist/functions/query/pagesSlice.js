"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$pagesSlice",
    version: "1.0.0",
    description: "Returns an arbitrary slice from start, count.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.String,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "startIndex", description: "1-based start index", type: forgescript_1.ArgType.Number, required: true, rest: false },
        { name: "count", description: "Number of items to get", type: forgescript_1.ArgType.Number, required: true, rest: false }
    ],
    execute(ctx, [id, start, count]) {
        const store = ctx.client.pageStores?.get(id);
        if (!store)
            return this.customError(`Store "${id}" does not exist`);
        const slice = store.data.slice(start - 1, start - 1 + count);
        return this.success(slice.join(store.sep));
    }
});
//# sourceMappingURL=pagesSlice.js.map