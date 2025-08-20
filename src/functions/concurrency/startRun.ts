import { NativeFunction, ArgType } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$startRun",
  version: "1.0.0",
  description: "Starts a new run and tracks it in concurrency system",
  brackets: true,
  unwrap: true,
  output: ArgType.String,
  args: [
    {
      name: "guildId",
      description: "Guild ID",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "userId",
      description: "User ID",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "flowId",
      description: "Flow ID",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "cost",
      description: "Estimated token cost",
      type: ArgType.Number,
      required: true,
      rest: false
    }
  ],
  async execute(ctx) {
    const guildId = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](guildId)) return guildId;

    const userId = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](userId)) return userId;

    const flowId = await this["resolveUnhandledArg"](ctx, 2);
    if (!this["isValidReturnType"](flowId)) return flowId;

    const cost = await this["resolveUnhandledArg"](ctx, 3);
    if (!this["isValidReturnType"](cost)) return cost;

    // Get rate limiting stores from client
    const runs = (ctx.client as any).rateLimitRuns || new Map();
    const policy = (ctx.client as any).rateLimitPolicy;

    if (!policy) {
      return this.success("");
    }

    const runsKey = `runs_${guildId.value}`;
    let currentRuns = runs.get(runsKey) || [];

    // Check concurrency first
    if (currentRuns.length >= policy.concurrency.maxRunsPerGuild) {
      return this.success(""); // Cannot start, concurrency full
    }

    // Generate unique run ID
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create run object
    const run = {
      id: runId,
      guildId: guildId.value,
      userId: userId.value,
      flowId: flowId.value,
      cost: cost.value,
      startedAt: Date.now(),
      status: "running"
    };

    currentRuns.push(run);
    runs.set(runsKey, currentRuns);

    ctx.setEnvironmentKey("runId", runId);
    ctx.setEnvironmentKey("runStarted", Date.now().toString());
    ctx.setEnvironmentKey("activeConcurrency", currentRuns.length.toString());

    return this.success(runId);
  }
});