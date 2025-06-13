import { ForgeExtension, ForgeClient } from "@tryforge/forgescript";
import "./types.js";
export declare class ForgePages extends ForgeExtension {
    name: string;
    description: string;
    version: string;
    private instance;
    init(client: ForgeClient): void;
}
export default ForgePages;