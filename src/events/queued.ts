import { Interpreter } from "@tryforge/forgescript";
import { ForgeRateLimit } from "..";
import { RateLimitEventHandler } from "../structures/eventManager";

export default new RateLimitEventHandler({
    name: "queued",
    version: "1.0.0", 
    description: "This event is triggered when a request is added to the rate limiting queue.",
    listener(extras) {
        const commands = this.getExtension(ForgeRateLimit, true).commands.get("queued" as any);

        for (const command of commands) {
            Interpreter.run({
                obj: {},
                client: this,
                command,
                data: command.compiled.code,
                extras,
            });
        }
    },
});