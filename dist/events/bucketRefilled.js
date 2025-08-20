"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
const eventManager_1 = require("../structures/eventManager");
exports.default = new eventManager_1.RateLimitEventHandler({
    name: "bucketRefilled",
    version: "1.0.0",
    description: "This event is triggered when a rate limiting bucket gets refilled with tokens.",
    listener(extras) {
        const commands = this.getExtension(__1.ForgeRateLimit, true).commands.get("bucketRefilled");
        for (const command of commands) {
            forgescript_1.Interpreter.run({
                obj: {},
                client: this,
                command,
                data: command.compiled.code,
                extras,
            });
        }
    },
});
//# sourceMappingURL=bucketRefilled.js.map