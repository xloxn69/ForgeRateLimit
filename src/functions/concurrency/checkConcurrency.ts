import { NativeFunction, ArgType } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$checkConcurrency",
  version: "1.0.0",
  description: "Checks if concurrency limits allow execution",
  brackets: true,
  unwrap: true,
  output: ArgType.Boolean,
  args: [
    {
      name: "guildId",
      description: "Guild ID",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "flowId",
      description: "Flow ID",
      type: ArgType.String,
      required: false,
      rest: false
    }
  ],
  async execute(ctx) {
    const guildId = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](guildId)) return guildId;

    const flowId = await this["resolveUnhandledArg"](ctx, 1);

    // Get rate limiting stores from client
    const runs = (ctx.client as any).rateLimitRuns || new Map();
    const policy = (ctx.client as any).rateLimitPolicy;

    if (!policy) {
      return this.success(true);
    }

    const runsKey = `runs_${guildId.value}`;
    const currentRuns = runs.get(runsKey) || [];

    // Check guild-wide concurrency limit
    const guildRunCount = currentRuns.length;
    const maxGuildRuns = policy.concurrency.maxRunsPerGuild;

    if (guildRunCount >= maxGuildRuns) {
      ctx.setEnvironmentKey("concurrencyBlocked", "true");
      ctx.setEnvironmentKey("blockReason", "guild_concurrency");
      ctx.setEnvironmentKey("currentRuns", guildRunCount.toString());
      ctx.setEnvironmentKey("maxRuns", maxGuildRuns.toString());
      return this.success(false);
    }

    // Check per-flow concurrency if flowId provided
    if (flowId && this["isValidReturnType"](flowId)) {
      const flowRunCount = currentRuns.filter((run: any) => run.flowId === flowId.value).length;
      const maxFlowRuns = policy.concurrency.maxRunsPerFlow || 4; // Default from PRD

      if (flowRunCount >= maxFlowRuns) {
        ctx.setEnvironmentKey("concurrencyBlocked", "true");
        ctx.setEnvironmentKey("blockReason", "flow_concurrency");
        ctx.setEnvironmentKey("currentFlowRuns", flowRunCount.toString());
        ctx.setEnvironmentKey("maxFlowRuns", maxFlowRuns.toString());
        return this.success(false);
      }

      ctx.setEnvironmentKey("currentFlowRuns", flowRunCount.toString());
      ctx.setEnvironmentKey("maxFlowRuns", maxFlowRuns.toString());
    }

    // Calculate available slots
    const availableSlots = maxGuildRuns - guildRunCount;

    ctx.setEnvironmentKey("concurrencyBlocked", "false");
    ctx.setEnvironmentKey("currentRuns", guildRunCount.toString());
    ctx.setEnvironmentKey("maxRuns", maxGuildRuns.toString());
    ctx.setEnvironmentKey("availableSlots", availableSlots.toString());

    return this.success(true);
  }
});