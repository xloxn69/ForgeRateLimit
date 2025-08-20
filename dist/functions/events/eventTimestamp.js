"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$eventTimestamp",
    version: "1.0.0",
    description: "Returns the timestamp of the rate limiting event",
    brackets: false,
    unwrap: false,
    output: forgescript_1.ArgType.Number,
    args: [],
    async execute(ctx) {
        const eventData = ctx.extras?.[0];
        if (!eventData || !eventData.timestamp) {
            return this.success();
        }
        return this.success(eventData.timestamp);
    }
});
//# sourceMappingURL=eventTimestamp.js.map