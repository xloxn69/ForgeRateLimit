"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
const eventManager_1 = require("../structures/eventManager");
exports.default = new eventManager_1.RateLimitEventHandler({
    name: "tokenRefunded",
    version: "1.0.0",
    description: "This event is triggered when tokens are refunded after an operation completion.",
    listener(extras) {
        const commands = this.getExtension(__1.ForgeRateLimit, true).commands.get("tokenRefunded");
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
//# sourceMappingURL=tokenRefunded.js.map