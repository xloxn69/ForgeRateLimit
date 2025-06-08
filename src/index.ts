import type { ForgeClient } from "@tryforge/forgescript";
import functions from "./functions/index.js";
import "./types.js";                // patches ForgeClient typing (no runtime code)

class ForgePages {
  public name = "ForgePages";
  public description = "Light-weight paging helpers for ForgeScript";
  public version = "1.0.0";

  public validateAndInit(client: ForgeClient) {
    if (!client.pageStores) client.pageStores = new Map();
    // Register native functions directly on the client
    for (const fn of functions) {
      (client as any).nativeHandler?.add?.(fn) || (client as any).functions?.add?.(fn);
    }
  }
}

// Use only CommonJS export for better compatibility
export = ForgePages; 