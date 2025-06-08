import {
  ForgeExtension,
  ForgeClient
} from "@tryforge/forgescript";
import functions from "./functions/index.js";
import "./types.js";                // patches ForgeClient typing (no runtime code)

export class ForgePages extends ForgeExtension {
  name = "ForgePages";
  description = "Light-weight paging helpers for ForgeScript";
  version = "1.0.0";

  init(client: ForgeClient): void {
    if (!client.pageStores) client.pageStores = new Map();
    
    // Try the original working approach but with ForgeExtension
    for (const fn of functions) {
      try {
        // Try multiple possible registration methods
        if ((client as any).nativeHandler?.register) {
          (client as any).nativeHandler.register(fn);
        } else if ((client as any).functions?.add) {
          (client as any).functions.add(fn);
        } else {
          console.warn('Could not find function registration method');
        }
      } catch (error) {
        console.error('Error registering function:', fn.data?.name, error);
      }
    }
  }
}

// Also export as default and module.exports for compatibility
export default ForgePages;
module.exports = ForgePages;
module.exports.default = ForgePages; 