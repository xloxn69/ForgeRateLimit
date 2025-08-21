import { Interpreter } from "@tryforge/forgescript";
import { ForgeRateLimit } from "..";
import { RateLimitEventHandler } from "../structures/eventManager";

export default new RateLimitEventHandler({
    name: "throttled",
    version: "1.0.0",
    description: "This event is triggered when a request is throttled due to rate limiting.",
    listener(extras) {
        const commands = this.getExtension(ForgeRateLimit, true).commands.get("throttled" as any);

        for (const command of commands) {
            Interpreter.run({
                obj: { guild: null, user: null, member: null, channel: null, message: null },
                client: this,
                command,
                data: command.compiled.code,
                extras,
            });
        }
    },
});