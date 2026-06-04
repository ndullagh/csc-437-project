// app/src/messages.ts
//import { Equipment, ItemType, Item } from "server/models";

import { Profile } from "server/models";

export type Msg =
  | ["equipment/get", { userid: string; }]
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
  //| ["equipment/newItem", { cat: string; itemtype: ItemType; item: Item}]