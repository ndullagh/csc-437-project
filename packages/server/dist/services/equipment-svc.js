// src/services/destination-svc.ts
import { Schema, model } from "mongoose";
const itemSchema = new Schema({
    ItemName: String,
    Element: String,
    Statsheet: String,
}, { _id: false });
const itemTypeSchema = new Schema({
    TypeName: String,
    Icon: String,
    ItemList: [itemSchema],
}, { _id: false });
const equipmentSchema = new Schema({
    Weapons: [itemTypeSchema],
    Armor: [itemTypeSchema],
}, { collection: "Equipment" });
const EquipmentModel = model("Equipment", equipmentSchema);
function index() {
    return EquipmentModel.find();
}
//TODO make all restful like this
function get(id) {
    return EquipmentModel.findById(id)
        .then((equip) => equip?.toObject())
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
function create(id, cat, type, item) {
    return EquipmentModel.findOneAndUpdate({
        _id: id,
        [`${cat}.TypeName`]: type,
    }, {
        $push: {
            [`${cat}.$.ItemList`]: item,
        },
    }, { new: true }).then((equip) => {
        if (!equip)
            throw `${id} Not Found`;
        return equip.toObject();
    });
}
function update(id, cat, type, itemName, update) {
    return EquipmentModel.findOneAndUpdate(//had to ask chatgpt how to do this :/ not sure if there's a better way
    {
        _id: id,
        [`${cat}.TypeName`]: type,
        [`${cat}.ItemList.ItemName`]: itemName,
    }, {
        $set: {
            [`${cat}.$[typeElem].ItemList.$[itemElem]`]: update
        },
    }, {
        new: true,
        arrayFilters: [
            { "typeElem.TypeName": type },
            { "itemElem.ItemName": itemName },
        ],
    }).then((equip) => {
        if (!equip)
            throw `${id} Not Found`;
        return equip.toObject();
    });
}
function deleteItem(id, cat, type, itemName) {
    return EquipmentModel.findOneAndUpdate({
        _id: id,
        [`${cat}.TypeName`]: type
    }, {
        $pull: {
            [`${cat}.$.ItemList`]: { ItemName: itemName }
        }
    }, { new: true }).then((equip) => {
        if (!equip)
            throw `${id} Not Found`;
        return equip.toObject();
    });
}
export default { index, get, create, update, deleteItem };
