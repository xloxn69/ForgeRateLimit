"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgePages = void 0;
const forgescript_1 = require("@tryforge/forgescript");
require("./types.js"); // patches ForgeClient typing (no runtime code)
class ForgePages extends forgescript_1.ForgeExtension {
    name = "ForgePages";
    description = "Light-weight paging helpers for ForgeScript";
    version = "1.0.0";
    instance;
    init(client) {
        this.instance = client;
        if (!client.pageStores)
            client.pageStores = new Map();
        this.load(__dirname + "/functions");
    }
}
exports.ForgePages = ForgePages;
exports.default = ForgePages;
module.exports = ForgePages;
module.exports.default = ForgePages;