"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$setPriority",
    version: "1.0.0",
    description: "Sets priority for an action (moderation > system > messaging > heavy)",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [
        {
            name: "actionType",
            description: "Type of action to prioritize",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx) {
        const actionType = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](actionType))
            return actionType;
        // Define priority classes based on PRD
        const priorityMap = {
            // Moderation (highest priority)
            "timeout": 1,
            "kick_ban": 1,
            "role_edit": 1,
            // System (high priority)
            "create_delete": 2,
            "db_write": 2,
            "db_read": 2,
            // Messaging (medium priority)
            "send_message": 3,
            "send_embed": 3,
            // Heavy/External (low priority)
            "http_request": 4
        };
        const priority = priorityMap[actionType.value] || 3; // Default to messaging priority
        const getPriorityClassName = (priority) => {
            switch (priority) {
                case 1: return "moderation";
                case 2: return "system";
                case 3: return "messaging";
                case 4: return "heavy";
                default: return "messaging";
            }
        };
        ctx.setEnvironmentKey("actionPriority", priority.toString());
        ctx.setEnvironmentKey("priorityClass", getPriorityClassName(priority));
        return this.success(priority);
    }
});
//# sourceMappingURL=setPriority.js.map