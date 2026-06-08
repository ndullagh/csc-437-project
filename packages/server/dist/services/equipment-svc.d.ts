import { Equipment, Item } from "../models";
declare function index(): Promise<Equipment[]>;
declare function get(id: string): Promise<Equipment | undefined>;
declare function createItem(id: string, cat: "Weapons" | "Armor", type: string, item: Item): Promise<Item | null>;
declare function updateItem(id: string, cat: "Weapons" | "Armor", type: string, itemName: string, stats: Record<string, string>): Promise<Record<string, string>>;
declare function getItem(id: string, cat: "Weapons" | "Armor", type: string, itemName: string): Promise<Item>;
declare function deleteItem(id: string, cat: "Weapons" | "Armor", type: string, itemName: string): Promise<Equipment>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    getItem: typeof getItem;
    createItem: typeof createItem;
    updateItem: typeof updateItem;
    deleteItem: typeof deleteItem;
};
export default _default;
