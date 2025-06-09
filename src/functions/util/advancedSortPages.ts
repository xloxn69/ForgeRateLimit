import { ArgType, IExtendedCompiledFunctionField, NativeFunction, Return } from "@tryforge/forgescript";

async function asyncSort<T>(array: T[], asyncComparator: (a: T, b: T) => Promise<number>): Promise<T[]> {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = i + 1; j < array.length; j++) {
            const result = await asyncComparator(array[i], array[j])
            if (result > 0) {
                [array[i], array[j]] = [array[j], array[i]]
            }
        }
    }
    return array
}

export default new NativeFunction({
    name: "$advancedSortPages",
    version: "1.0.0",
    description: "Advanced sort for page store entries using custom comparison logic",
    unwrap: false,
    brackets: true,
    args: [
        {
            name: "id",
            description: "The store identifier",
            type: ArgType.String,
            rest: false,
            required: true,
        },
        {
            name: "var1",
            description: "The $env variable 1 to hold first comparison value",
            rest: false,
            type: ArgType.String,
            required: true
        },
        {
            name: "var2",
            description: "The $env variable 2 to hold second comparison value",
            rest: false,
            type: ArgType.String,
            required: true
        },
        {
            name: "code",
            description: "Code to execute for comparison (should return number: negative if first < second, 0 if equal, positive if first > second)",
            rest: false,
            type: ArgType.String,
            required: true
        }
    ],
    output: ArgType.Boolean,
    async execute(ctx) {
        // destructure the raw function‐argument fields
        const [idField, var1Field, var2Field, codeField] =
            this.data.fields! as IExtendedCompiledFunctionField[];

        // resolve the store ID
        const idRet: Return = (await this["resolveCode"](ctx, idField)) as Return;
        if (!this["isValidReturnType"](idRet)) return idRet;
        const storeId = (idRet.value as string).trim();

        // resolve the variable names
        const var1Ret: Return = (await this["resolveCode"](ctx, var1Field)) as Return;
        if (!this["isValidReturnType"](var1Ret)) return var1Ret;
        const var1Name = var1Ret.value as string;

        const var2Ret: Return = (await this["resolveCode"](ctx, var2Field)) as Return;
        if (!this["isValidReturnType"](var2Ret)) return var2Ret;
        const var2Name = var2Ret.value as string;

        // fetch your paging store
        const store = ctx.client.pageStores?.get(storeId);
        if (!store) return this.customError(`Store "${storeId}" not found`);

        // perform advanced sort
        const sortedData = await asyncSort(store.data, async (x: string, y: string) => {
            // bind comparison values to variables
            ctx.setEnvironmentKey(var1Name, x);
            ctx.setEnvironmentKey(var2Name, y);
            
            // execute comparison code
            const result: Return = (await this["resolveCode"](ctx, codeField)) as Return;
            if (!this["isValidReturnType"](result)) return 0; // treat invalid as equal
            
            return Number(result.value) || 0; // ensure we return a number
        });

        // update the store with sorted data
        store.data = sortedData;

        return this.success(true);
    },
}); 