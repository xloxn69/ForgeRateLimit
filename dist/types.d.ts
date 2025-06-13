export interface PageStore {
    sep: string;
    data: string[];
}
declare module "@tryforge/forgescript" {
    interface ForgeClient {
        pageStores?: Map<string, PageStore>;
    }
}
