import {
  ForgeExtension,
  ForgeClient
} from "@tryforge/forgescript";
import "./types.js";                // patches ForgeClient typing (no runtime code)

export class ForgePages extends ForgeExtension {
  name = "ForgePages";
  description = "Light-weight paging helpers for ForgeScript";
  version = "1.0.0";

  private instance!: ForgeClient;

  init(client: ForgeClient): void {
    this.instance = client;
    
    if (!client.pageStores) client.pageStores = new Map();
    
    // Load functions using ForgeExtension's built-in loader like ForgeScheduler
    this.load(__dirname + "/functions");
  }
}

// Also export as default and module.exports for compatibility
export default ForgePages;
module.exports = ForgePages;
module.exports.default = ForgePages; 