import { ForgeExtension, ForgeClient } from "@tryforge/forgescript";
import { TypedEmitter } from "tiny-typed-emitter";
import { IRateLimitEvents, RateLimitCommandManager } from "./structures";
import "./types.js";
export type TransformEvents<T> = {
    [P in keyof T]: T[P] extends any[] ? (...args: T[P]) => any : never;
};
export declare class ForgeRateLimit extends ForgeExtension {
    readonly options?: {
        events?: (keyof IRateLimitEvents)[];
    } | undefined;
    name: string;
    description: string;
    version: string;
    private instance;
    private buckets;
    private policy;
    commands: RateLimitCommandManager;
    emitter: TypedEmitter<TransformEvents<IRateLimitEvents>>;
    constructor(options?: {
        events?: (keyof IRateLimitEvents)[];
    } | undefined);
    init(client: ForgeClient): void;
    private eventCommands;
    private loadEventCommands;
    private setupEventListeners;
    private createBalancedPolicy;
    private initializeBuckets;
    private startRefillProcess;
    private refillAllBuckets;
}
export default ForgeRateLimit;
//# sourceMappingURL=index.d.ts.map