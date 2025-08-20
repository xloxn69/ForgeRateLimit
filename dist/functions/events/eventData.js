"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$eventData",
    version: "1.0.0",
    description: "Returns the event data for rate limiting events",
    brackets: false,
    unwrap: false,
    output: forgescript_1.ArgType.Json,
    args: [
        {
            name: "property",
            description: "Property to retrieve from event data",
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false
        }
    ],
    async execute(ctx) {
        const property = await this["resolveUnhandledArg"](ctx, 0);
        const eventData = ctx.extras?.[0];
        if (!eventData) {
            return this.success();
        }
        if (property && this["isValidReturnType"](property)) {
            const value = eventData[property.value];
            return this.success(value);
        }
        return this.success(JSON.stringify(eventData));
    }
});
//# sourceMappingURL=eventData.js.map