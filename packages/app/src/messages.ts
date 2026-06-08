// app/src/messages.ts
//import { Equipment, ItemType, Item } from "server/models";

import { Profile, Item } from "server/models";

export type Msg =
  | ["equipment/get", { userid: string; }]
  | [
      "equipment/item/get",
      {
        userid: string;
        cat: "Weapons" | "Armor";
        type: string;
        itemname: string;
      }
    ]
  | [
      "equipment/item/save",
      {
        userid: string;
        cat: "Weapons" | "Armor";
        type: string;
        itemname: string;
        stats: Record<string, string>;
      }
    ]
  | [
      "equipment/item/create",
      {
        userid: string;
        cat: "Weapons" | "Armor";
        type: string;
        item: Item;
      }
    ]
  | ["profile/get", { userid: string; }]
  | [
      "profile/save",
      {
        userid: string,
        profile: Profile
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ];