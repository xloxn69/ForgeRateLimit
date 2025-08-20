import { Interpreter } from "@tryforge/forgescript";
import { ForgeRateLimit } from "..";
import { RateLimitEventHandler } from "../structures/eventManager";

export default new RateLimitEventHandler({
    name: "surgeGuard",
    version: "1.0.0",
    description: "This event is triggered when surge guard system activates or deactivates.",
    listener(extras) {
        const commands = this.getExtension(ForgeRateLimit, true).commands.get("surgeGuard" as any);

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