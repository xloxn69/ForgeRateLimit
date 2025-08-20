import { BaseCommandManager, ForgeClient } from "@tryforge/forgescript";
import { IRateLimitEvents } from "./eventManager";

export class RateLimitCommandManager extends BaseCommandManager<IRateLimitEvents> {
    public readonly handlerName = "ForgeRateLimitEvents";
    
    constructor(client: ForgeClient) {
        super(client);
    }
}