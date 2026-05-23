// src/services/destination-svc.ts
import { Schema, model } from "mongoose";
import { Equipment, ItemType, Item } from "../models"; // models/index.ts exports



const itemSchema = new Schema<Item>(
    {
        ItemName: String,
        Element: String,
        Statsheet: String,
    },
    { _id: false }

    
);

const itemTypeSchema = new Schema<ItemType>(
    {
        TypeName: String,
        Icon: String,
        ItemList: [itemSchema],
    },
    { _id: false }
);

const equipmentSchema = new Schema<Equipment>(
  {
    userid: String,
    Weapons: [itemTypeSchema],
    Armor: [itemTypeSchema],
  },
  { collection: "Equipment" }
);

const EquipmentModel = model<Equipment>(
  "Equipment",
  equipmentSchema
);


function index(): Promise<Equipment[]> {
  return EquipmentModel.find();
}

//TODO make all restful like this
function get(id: string): Promise<Equipment | undefined> {
  return EquipmentModel.find( {userid: id} )
    .then((list) => {
        if(!list || list.length === 0) throw `List Not Found`;
        return list[0].toObject() as Equipment 
      })  
    .catch((err) => {
      throw `${id} Not Found`;
    });
}

// in src/services/equipment-svc.ts:
//create a new weapon or armor item
/*function create(
  id: String,
  cat: "Weapons" | "Armor",
  type: string,
  item: Item
): Promise<Equipment | null> {
  return EquipmentModel.findOneAndUpdate( 
    { [`${cat}.TypeName`]: type },
    {
      $push: { //not sure if this is what i should be doing for this, had to resort to chatgpt
        [`${cat}.$.ItemList`]: item,
      },
    },
    { new: true }
  );
}*/

function create(
  id: string,
  cat: "Weapons" | "Armor",
  type: string,
  item: Item
): Promise<Equipment | null> {
  return EquipmentModel.findOneAndUpdate(
    {
      _id: id,
      [`${cat}.TypeName`]: type,
    },
    {
      $push: {
        [`${cat}.$.ItemList`]: item,
      },
    },
    { new: true }
  ).then((equip) => {
    if (!equip) throw `${id} Not Found`;
    return equip.toObject() as Equipment;
  });
}

function update(
  id: string,
  cat: "Weapons" | "Armor",
  type: string,
  itemName: string,
  update: Item
): Promise<Equipment | null> {
  return EquipmentModel.findOneAndUpdate( //had to ask chatgpt how to do this :/ not sure if there's a better way
    {
      _id: id,
      [`${cat}.TypeName`]: type,
      [`${cat}.ItemList.ItemName`]: itemName,
    },
    {
      $set: {
        [`${cat}.$[typeElem].ItemList.$[itemElem]`]: update
      },
    },
    {
      new: true,
      arrayFilters: [
        { "typeElem.TypeName": type },
        { "itemElem.ItemName": itemName },
      ],
    }
  ).then((equip) => {
    if (!equip) throw `${id} Not Found`;
    return equip.toObject() as Equipment;
  });
}

function deleteItem(
  id: string,
  cat: "Weapons" | "Armor",
  type: string,
  itemName: string
) {
  return EquipmentModel.findOneAndUpdate(
    { 
      _id: id,
      [`${cat}.TypeName`]: type },
    {
      $pull: {
        [`${cat}.$.ItemList`]: { ItemName: itemName }
      }
    },
    { new: true }
  ).then((equip) => {
    if (!equip) throw `${id} Not Found`;
    return equip.toObject() as Equipment;
  });
}

export default { index, get, create, update, deleteItem};