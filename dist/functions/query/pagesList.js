"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$pagesList",
    version: "1.0.0",
    description: "Returns a fixed-width page of data.",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.String,
    args: [
        { name: "id", description: "Store identifier", type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: "page", description: "Page number to get", type: forgescript_1.ArgType.Number, required: true, rest: false },
        { name: "per", description: "Items per page", type: forgescript_1.ArgType.Number, required: true, rest: false }
    ],
    execute(ctx, [id, page, per]) {
        const store = ctx.client.pageStores?.get(id);
        if (!store)
            return this.customError(`Store "${id}" does not exist`);
        const start = (page - 1) * per;
        const slice = store.data.slice(start, start + per);
        return this.success(slice.join(store.sep));
    }
});
//# sourceMappingURL=pagesList.js.map