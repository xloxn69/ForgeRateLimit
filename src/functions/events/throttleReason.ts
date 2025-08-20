import { NativeFunction, ArgType } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$throttleReason",
  version: "1.0.0",
  description: "Returns the reason for throttling in throttled events",
  brackets: false,
  unwrap: false,
  output: ArgType.String,
  args: [],
  async execute(ctx) {
    const eventData = (ctx.extras as any)?.[0];
    if (!eventData || !eventData.reason) {
      return this.success();
    }

    return this.success(eventData.reason);
  }
});