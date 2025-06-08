"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgePages = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = __importDefault(require("./functions/index.js"));
require("./types.js"); // patches ForgeClient typing (no runtime code)
class ForgePages extends forgescript_1.ForgeExtension {
    name = "ForgePages";
    description = "Light-weight paging helpers for ForgeScript";
    version = "1.0.0";
    init(client) {
        if (!client.pageStores)
            client.pageStores = new Map();
        // Try the original working approach but with ForgeExtension
        for (const fn of index_js_1.default) {
            try {
                // Try multiple possible registration methods
                if (client.nativeHandler?.register) {
                    client.nativeHandler.register(fn);
                }
                else if (client.functions?.add) {
                    client.functions.add(fn);
                }
                else {
                    console.warn('Could not find function registration method');
                }
            }
            catch (error) {
                console.error('Error registering function:', fn.data?.name, error);
            }
        }
    }
}
exports.ForgePages = ForgePages;
// Also export as default and module.exports for compatibility
exports.default = ForgePages;
module.exports = ForgePages;
module.exports.default = ForgePages;
//# sourceMappingURL=index.js.map