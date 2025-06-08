import { ArgType } from "@tryforge/forgescript";
declare const _default: {
    name: string;
    version: string;
    description: string;
    brackets: boolean;
    unwrap: boolean;
    output: ArgType;
    args: {
        name: string;
        description: string;
        type: ArgType;
        required: boolean;
        rest: boolean;
    }[];
    execute(ctx: any, [id, sep, raw]: [string, string, string]): Promise<{
        success: boolean;
        result: boolean;
    }>;
};
export default _default;
//# sourceMappingURL=pagesInit.d.ts.map