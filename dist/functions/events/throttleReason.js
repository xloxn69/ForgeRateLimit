"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$throttleReason",
    version: "1.0.0",
    description: "Returns the reason for throttling in throttled events",
    brackets: false,
    unwrap: false,
    output: forgescript_1.ArgType.String,
    args: [],
    async execute(ctx) {
        const eventData = ctx.extras?.[0];
        if (!eventData || !eventData.reason) {
            return this.success();
        }
        return this.success(eventData.reason);
    }
});
//# sourceMappingURL=throttleReason.js.map