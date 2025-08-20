import { ForgeExtension, ForgeClient } from "@tryforge/forgescript";
import "./types.js";
export declare class ForgeRateLimit extends ForgeExtension {
    name: string;
    description: string;
    version: string;
    private instance;
    private buckets;
    private policy;
    init(client: ForgeClient): void;
    private createBalancedPolicy;
    private initializeBuckets;
    private startRefillProcess;
    private refillAllBuckets;
}
export default ForgeRateLimit;
//# sourceMappingURL=index.d.ts.map