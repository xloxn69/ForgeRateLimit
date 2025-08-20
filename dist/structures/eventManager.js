"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitEventHandler = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
class RateLimitEventHandler extends forgescript_1.BaseEventHandler {
    register(client) {
        //@ts-ignore
        client.getExtension(__1.ForgeRateLimit, true)["emitter"].on(this.name, this.listener.bind(client));
    }
}
exports.RateLimitEventHandler = RateLimitEventHandler;
//# sourceMappingURL=eventManager.js.map