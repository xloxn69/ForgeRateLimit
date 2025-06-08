"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = __importDefault(require("./functions/index.js"));
require("./types.js"); // patches ForgeClient typing (no runtime code)
class ForgePages {
    name = "ForgePages";
    description = "Light-weight paging helpers for ForgeScript";
    version = "1.0.0";
    validateAndInit(client) {
        if (!client.pageStores)
            client.pageStores = new Map();
        // Register native functions directly on the client
        for (const fn of index_js_1.default) {
            client.nativeHandler?.add?.(fn) || client.functions?.add?.(fn);
        }
    }
}
exports.default = ForgePages;
//# sourceMappingURL=index.js.map