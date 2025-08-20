"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitCommandManager = void 0;
const forgescript_1 = require("@tryforge/forgescript");
class RateLimitCommandManager extends forgescript_1.BaseCommandManager {
    handlerName = "ForgeRateLimitEvents";
    constructor(client) {
        super(client);
    }
}
exports.RateLimitCommandManager = RateLimitCommandManager;
//# sourceMappingURL=commandManager.js.map