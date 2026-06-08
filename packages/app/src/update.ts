// app/src/update.ts

import { Auth } from "@unbndl/auth";
import { Message } from "@unbndl/service";
import { Model } from "./model.ts"; //TODO there was also something called TourIndex. not sure what that does.
import { Msg } from "./messages.ts";
import { Equipment, Item, Profile } from "server/models";
import { ThenUpdate } from "@unbndl/store";

export type Cmd = // TODO /server/models wasn't imported. should it be?
  | ["equipment/load", { equipment: Equipment }]
  | ["profile/load", { profile: Profile}]
  | ["equipment/item/load", {item: Item}]
  
export function update(model: Readonly<Model>, message: Msg | Cmd, auth: Auth.Model): Model | ThenUpdate<Model, Cmd> { 
    //user originally said Auth.Model, but i figured it should be .User since that's what this func gets sent
    //model is current entire store state when update is called
  console.log("UPDATE GOT MESSAGE", message);
  const [type, payload] = message;
  switch (type) {
    case "equipment/get": {
      if (model.equipment?.userid === payload.userid) break;
      return [
        { ...model,
          equipment: {
            userid: payload.userid,
            Weapons: [],
            Armor: [],
          }
        },
        getEquipment(payload, auth)
      ];
    }
    case "equipment/load": {
      const { equipment } = payload;
      return { ...model, equipment };
    }
    case "equipment/item/get": {
      return [model, getItem(payload, auth)];
    }

    case "equipment/item/load": {
      return { ...model, stats: payload.item.Stats };
    }

    case "equipment/item/save": {
      return [model, saveItem(payload, auth)];
    }
    case "equipment/item/create": {
      return [model, createItem(payload, auth)];
    }
    case "profile/get": {
      if (model.profile?.userid === payload.userid) break;
        return [
            { ...model,
                profile: {
                    userid: payload.userid,
                    teststring: ""
                }
            },
            getProfile(payload, auth)
        ];
    }
    case "profile/load": {
      const { profile } = payload;
      return { ...model, profile };
    }
    case "profile/save": {
      return [ model, saveProfile(payload, auth)]
    }
    // put the rest of your cases here
    default:
      throw new Error(`Unhandled message "${message}"`);
  }

  return model;
}

function getEquipment(
  payload: { userid: string },
  user: Auth.Model 
): Promise<Cmd> {
  return fetch(`/api/Equipment/${payload.userid}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw "No Response from server";
    })
    .then((json: unknown): Cmd => {
      if (json) return [
        "equipment/load",
        { equipment: json as Equipment }
      ];
      throw "No JSON in response from server";
    });
}

function getProfile(
  payload: { userid: string },
  user: Auth.Model 
): Promise<Cmd> {
  return fetch(`/api/Profile/${payload.userid}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw "No Response from server";
    })
    .then((json: unknown): Cmd => {
      if (json) return [
        "profile/load",
        { profile: json as Profile }
      ];
      throw "No JSON in response from server";
    });
}

function saveProfile(
  payload: { userid: string; profile: Profile; },
  auth: Auth.Model
) {
  return fetch(`/api/Profile/${payload.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(auth)
    },
    body: JSON.stringify(payload.profile)
  })
    .then((res: Response) => {
      if (res.status === 200) return res.json();
      throw new Error(`
        ${res.status} status; saving profile for ${payload.userid}`
      );
    })
    .then((json: unknown) => {
      if (!json) {
        throw new Error(`No JSON in API response`)
        
      }
      return ["profile/load", { profile: json as Profile}] as Cmd;
     
    })
    .catch((err) => {
      console.log("Error saving profile:", err);
      throw err;
    });
}

function getItem(
  payload: {
    userid: string;
    cat: "Weapons" | "Armor";
    type: string;
    itemname: string;
  },
  auth: Auth.Model
): Promise<Cmd> {
  const userid = encodeURIComponent(payload.userid);
  const cat = encodeURIComponent(payload.cat);
  const type = encodeURIComponent(payload.type);
  const itemname = encodeURIComponent(payload.itemname);

  return fetch(`/api/Equipment/${userid}/${cat}/${type}/${itemname}`, {
    headers: Auth.headers(auth)
  })
    .then((res: Response) => {
      if (res.status === 200) return res.json();

      throw new Error(
        `${res.status} status; loading item ${payload.itemname}`
      );
    })
    .then((json: unknown): Cmd => {
      if (!json) throw new Error("No JSON in API response");

      return ["equipment/item/load", { item: json as Item }];
    });
}

function saveItem(
  payload: {
    userid: string;
    cat: "Weapons" | "Armor";
    type: string;
    itemname: string;
    stats: Record<string, string>;
  },
  auth: Auth.Model
): Promise<Cmd> {
  const userid = encodeURIComponent(payload.userid);
  const cat = encodeURIComponent(payload.cat);
  const type = encodeURIComponent(payload.type);
  const itemname = encodeURIComponent(payload.itemname);

  return fetch(`/api/Equipment/${userid}/${cat}/${type}/${itemname}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(auth)
    },
    body: JSON.stringify(payload.stats)
  })
    .then((res: Response) => {
      if (res.status === 200) return res.json();

      throw new Error(
        `${res.status} status; saving item ${payload.itemname}`
      );
    })
    .then((json: unknown): Cmd => {
      if (!json) throw new Error("No JSON in API response");

      return ["equipment/item/load", { item: json as Item }];
    });
}


function createItem(
  payload: {
    userid: string;
    cat: "Weapons" | "Armor";
    type: string;
    item: Item;
  },
  auth: Auth.Model
): Promise<Cmd> {
  const userid = encodeURIComponent(payload.userid);
  const cat = encodeURIComponent(payload.cat);
  const type = encodeURIComponent(payload.type);

  return fetch(`/api/Equipment/${userid}/${cat}/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(auth)
    },
    body: JSON.stringify(payload.item)
  })
    .then((res: Response) => {
      if (res.status === 200) return res.json();

      throw new Error(
        `${res.status} status; creating item ${payload.item.ItemName}`
      );
    })
    .then((json: unknown): Cmd => {
      if (!json) throw new Error("No JSON in API response");

      return ["equipment/item/load", { item: json as Item }];
    });
}
