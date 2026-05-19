export interface Equipment {
    Weapons: Array<Weapon>;
    Armor: Array<Armor>;
}
export interface ItemType {
    TypeName: String;
    Icon: String;
    ItemList: Array<Item>;
}
export interface Weapon extends ItemType {
}
export interface Armor extends ItemType {
}
export interface Item {
    ItemName: String;
    Element: String;
    Statsheet: String;
}
