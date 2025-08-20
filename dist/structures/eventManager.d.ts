import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
export interface IRateLimitEvents {
    tokenReserved: [
        {
            guildId: string;
            userId: string;
            flowId: string;
            cost: number;
            actionTypes?: string;
            timestamp: number;
        }
    ];
    tokenRefunded: [
        {
            guildId: string;
            userId: string;
            flowId: string;
            amount: number;
            timestamp: number;
        }
    ];
    bucketRefilled: [
        {
            bucketKey: string;
            tokensAdded: number;
            currentTokens: number;
            capacity: number;
            timestamp: number;
        }
    ];
    throttled: [
        {
            guildId: string;
            userId: string;
            flowId: string;
            reason: string;
            cost: number;
            eta: number;
            scope: string;
            timestamp: number;
        }
    ];
    queued: [
        {
            guildId: string;
            userId: string;
            flowId: string;
            jobId: string;
            cost: number;
            queuePosition: number;
            timestamp: number;
        }
    ];
    queueExecuted: [
        {
            guildId: string;
            userId: string;
            flowId: string;
            jobId: string;
            waitTime: number;
            timestamp: number;
        }
    ];
    circuitBreaker: [
        {
            flowId: string;
            guildId: string;
            errorRate: number;
            threshold: number;
            action: "opened" | "closed" | "halfOpen";
            timestamp: number;
        }
    ];
    surgeGuard: [
        {
            guildId?: string;
            queueWaitP95: number;
            threshold: number;
            action: "activated" | "deactivated";
            previousPolicy: string;
            newPolicy: string;
            timestamp: number;
        }
    ];
    policyChanged: [
        {
            guildId?: string;
            previousPolicy: string;
            newPolicy: string;
            changedBy: string;
            timestamp: number;
        }
    ];
}
export declare class RateLimitEventHandler<T extends keyof IRateLimitEvents> extends BaseEventHandler<IRateLimitEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=eventManager.d.ts.map