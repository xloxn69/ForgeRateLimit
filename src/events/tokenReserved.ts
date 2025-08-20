import { Interpreter } from "@tryforge/forgescript";
import { ForgeRateLimit } from "..";
import { RateLimitEventHandler } from "../structures/eventManager";

export default new RateLimitEventHandler({
    name: "tokenReserved",
    version: "1.0.0",
    description: "This event is triggered when tokens are successfully reserved for a rate limiting operation.",
    listener(extras) {
        const commands = this.getExtension(ForgeRateLimit, true).commands.get("tokenReserved" as any);

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