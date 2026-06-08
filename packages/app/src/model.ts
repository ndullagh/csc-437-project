import { Equipment, ItemType, Item } from "server/models";
import {Profile} from "server/models";

export interface Model { //TODO not sure if this should have anything else...?
  equipment?: Equipment;
  profile?: Profile;
  stats?: Record<string, string>;
}

export const init: Model = {};