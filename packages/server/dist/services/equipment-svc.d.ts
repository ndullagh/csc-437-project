import { Equipment, Item } from "../models";
declare function index(): Promise<Equipment[]>;
declare function get(id: string): Promise<Equipment | undefined>;
declare function create(id: string, cat: "Weapons" | "Armor", type: string, item: Item): Promise<Equipment | null>;
declare function update(id: string, cat: "Weapons" | "Armor", type: string, itemName: string, update: Item): Promise<Equipment | null>;
declare function deleteItem(id: string, cat: "Weapons" | "Armor", type: string, itemName: string): Promise<Equipment>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    create: typeof create;
    update: typeof update;
    deleteItem: typeof deleteItem;
};
export default _default;
