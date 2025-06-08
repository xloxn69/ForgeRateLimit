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
    async execute(ctx) {
        const id = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](id))
            return id;
        const start = await this["resolveUnhandledArg"](ctx, 1);
        if (!this["isValidReturnType"](start))
            return start;
        const count = await this["resolveUnhandledArg"](ctx, 2);
        if (!this["isValidReturnType"](count))
            return count;
        const store = ctx.client.pageStores?.get(id.value.trim());
        if (!store)
            return this.customError(`Store "${id.value}" does not exist`);
        const slice = store.data.slice(start.value - 1, start.value - 1 + count.value);
        return this.success(slice.join(store.sep));
    }
});
//# sourceMappingURL=pagesSlice.js.map