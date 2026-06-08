export interface Equipment {
    userid: string;
    Weapons: Array<Weapon>;
    Armor: Array<Armor>;
}

export interface ItemType {
    TypeName: string;
    Icon: string;
    ItemList: Array<Item>;
}

export interface Weapon extends ItemType {

}

export interface Armor extends ItemType {
    
}

export interface Item {
    ItemName: string;
    Element: string;
    Stats: Record<string, string>;
}