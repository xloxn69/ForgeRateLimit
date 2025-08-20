import { BaseCommandManager, ForgeClient } from "@tryforge/forgescript";
import { IRateLimitEvents } from "./eventManager";
export declare class RateLimitCommandManager extends BaseCommandManager<IRateLimitEvents> {
    readonly handlerName = "ForgeRateLimitEvents";
    constructor(client: ForgeClient);
}
//# sourceMappingURL=commandManager.d.ts.map