export interface PageStore {
  sep: string;
  data: string[];
}

declare module "@tryforge/forgescript" {
  interface ForgeClient {
    /** Map<storeID, PageStore> */
    pageStores?: Map<string, PageStore>;
  }
} 