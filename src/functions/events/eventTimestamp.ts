import { NativeFunction, ArgType } from "@tryforge/forgescript";

export default new NativeFunction({
  name: "$eventTimestamp",
  version: "1.0.0",
  description: "Returns the timestamp of the rate limiting event",
  brackets: false,
  unwrap: false,
  output: ArgType.Number,
  args: [],
  async execute(ctx) {
    const eventData = (ctx.extras as any)?.[0];
    if (!eventData || !eventData.timestamp) {
      return this.success();
    }

    return this.success(eventData.timestamp);
  }
});