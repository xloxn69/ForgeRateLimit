import { NativeFunction, ArgType } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$finishJob",
  version: "1.0.0",
  description: "Marks a job as finished and removes it from running jobs",
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
      name: "jobId",
      description: "Job ID to finish",
      type: ArgType.String,
      required: true,
      rest: false
    },
    {
      name: "success",
      description: "Whether job completed successfully",
      type: ArgType.Boolean,
      required: false,
      rest: false
    }
  ],
  async execute(ctx) {
    const guildId = await this["resolveUnhandledArg"](ctx, 0);
    if (!this["isValidReturnType"](guildId)) return guildId;

    const jobId = await this["resolveUnhandledArg"](ctx, 1);
    if (!this["isValidReturnType"](jobId)) return jobId;

    const success = await this["resolveUnhandledArg"](ctx, 2);
    const wasSuccessful = success && this["isValidReturnType"](success) ? success.value : true;

    // Get rate limiting stores from client
    const runs = (ctx.client as any).rateLimitRuns || new Map();
    const circuitBreakers = (ctx.client as any).rateLimitCircuitBreakers || new Map();

    const runsKey = `runs_${guildId.value}`;
    let currentRuns = runs.get(runsKey) || [];

    // Find and remove the job
    const jobIndex = currentRuns.findIndex((job: any) => job.id === jobId.value);
    if (jobIndex === -1) {
      return this.success(false);
    }

    const finishedJob = currentRuns[jobIndex];
    currentRuns.splice(jobIndex, 1);
    runs.set(runsKey, currentRuns);

    // Update circuit breaker stats
    if (finishedJob.flowId) {
      const breakerKey = `${guildId.value}_${finishedJob.flowId}`;
      let breaker = circuitBreakers.get(breakerKey);
      
      if (!breaker) {
        breaker = {
          guildId: guildId.value,
          flowId: finishedJob.flowId,
          state: "closed",
          errorCount: 0,
          totalRequests: 0,
          openedAt: null,
          reason: ""
        };
      }

      breaker.totalRequests++;
      if (!wasSuccessful) {
        breaker.errorCount++;
      }

      // Check if error rate exceeds threshold (15% for 5 minutes)
      const errorRate = breaker.errorCount / breaker.totalRequests;
      const now = Date.now();
      
      if (errorRate > 0.15 && breaker.totalRequests >= 5 && breaker.state === "closed") {
        breaker.state = "open";
        breaker.openedAt = now;
        breaker.reason = `High error rate: ${Math.round(errorRate * 100)}%`;

        // Emit circuit breaker event
        const rateLimitExtension = (ctx.client as any).getExtension?.("ForgeRateLimit");
        if (rateLimitExtension?.emitter) {
          rateLimitExtension.emitter.emit("circuitBreaker", {
            flowId: finishedJob.flowId,
            guildId: guildId.value,
            errorRate: errorRate * 100,
            threshold: 15,
            action: "opened",
            timestamp: now
          });
        }
      }

      circuitBreakers.set(breakerKey, breaker);
    }

    const executionTime = Date.now() - finishedJob.startedAt;
    ctx.setEnvironmentKey("executionTime", executionTime.toString());
    ctx.setEnvironmentKey("jobSuccess", wasSuccessful.toString());

    return this.success(true);
  }
});