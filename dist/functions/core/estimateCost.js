"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const ACTION_COSTS = {
    send_message: 1,
    send_embed: 2,
    role_edit: 2,
    timeout: 3,
    kick_ban: 4,
    create_delete: 5,
    http_request: 3,
    db_read: 0.5,
    db_write: 1
};
exports.default = new forgescript_1.NativeFunction({
    name: "$estimateCost",
    version: "1.0.0",
    description: "Estimates the token cost for a list of actions",
    brackets: true,
    unwrap: true,
    output: forgescript_1.ArgType.Number,
    args: [
        {
            name: "actions",
            description: "Comma-separated list of action types",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx) {
        const actions = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](actions))
            return actions;
        const actionList = actions.value.split(',').map(a => a.trim());
        let totalCost = 0;
        for (const action of actionList) {
            const cost = ACTION_COSTS[action];
            if (cost !== undefined) {
                totalCost += cost;
            }
            else {
                // Unknown action defaults to 1 token
                totalCost += 1;
            }
        }
        return this.success(totalCost);
    }
});
//# sourceMappingURL=estimateCost.js.map