"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
const eventManager_1 = require("../structures/eventManager");
exports.default = new eventManager_1.RateLimitEventHandler({
    name: "tokenReserved",
    version: "1.0.0",
    description: "This event is triggered when tokens are successfully reserved for a rate limiting operation.",
    listener(extras) {
        const commands = this.getExtension(__1.ForgeRateLimit, true).commands.get("tokenReserved");
        for (const command of commands) {
            forgescript_1.Interpreter.run({
                obj: { guild: null, user: null, member: null, channel: null, message: null },
                client: this,
                command,
                data: command.compiled.code,
                extras,
            });
        }
    },
});
//# sourceMappingURL=tokenReserved.js.map