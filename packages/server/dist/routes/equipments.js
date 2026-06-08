// src/routes/equipment.ts
import express from "express";
import Equipments from "../services/equipment-svc.js";
//import equipment from "../services/equipment-svc.js";
const router = express.Router();
router.get("/:id/:Category/:ItemType/:ItemName", (req, res) => {
    if (req.params.Category !== "Weapons" && req.params.Category !== "Armor") {
        res.status(400).send();
        return;
    }
    const cat = req.params.Category;
    const itemtype = decodeURIComponent(req.params.ItemType);
    const itemname = decodeURIComponent(req.params.ItemName);
    const id = decodeURIComponent(req.params.id);
    //const numAdded = 
    Equipments.getItem(id, cat, itemtype, itemname).then((item) => {
        if (!item) {
            res.status(404).send("Item type not found");
            return;
        }
        res.status(200).json(item);
    })
        .catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
    const { id } = req.params;
    Equipments.get(decodeURIComponent(id)) //check this
        .then((dest) => {
        if (!dest)
            res.status(404).send();
        else
            res.send(dest);
    })
        .catch((err) => res.status(404).send(err));
});
// in src/routes/destinations.ts
/*router.post("/", (req: Request, res: Response) => {

  const newEquipment = req.body;

  Equipments.create(newEquipment)
    .then((equipment: Equipment) =>
      res.status(201).json(equipment)
    )
    .catch((err) => res.status(500).send(err));
});*/
router.post("/:id/:Category/:ItemType", (req, res) => {
    if (req.params.Category !== "Weapons" && req.params.Category !== "Armor") {
        res.status(400).send();
        return;
    }
    const cat = req.params.Category;
    const itemtype = decodeURIComponent(req.params.ItemType);
    const id = decodeURIComponent(req.params.id);
    //const numAdded = 
    Equipments.createItem(id, cat, itemtype, req.body).then((item) => {
        if (!item) {
            res.status(404).send("Equipment/Type not found");
            return;
        }
        res.status(201).json(item);
    })
        .catch((err) => res.status(500).send(err));
});
router.put("/:id/:Category/:ItemType/:ItemName", (req, res) => {
    if (req.params.Category !== "Weapons" && req.params.Category !== "Armor") {
        res.status(400).send();
        return;
    }
    const cat = req.params.Category;
    const itemtype = decodeURIComponent(req.params.ItemType);
    const itemname = decodeURIComponent(req.params.ItemName);
    const id = decodeURIComponent(req.params.id);
    //const numAdded = 
    Equipments.updateItem(id, cat, itemtype, itemname, req.body).then((item) => {
        if (!item) {
            res.status(404).send("Item type not found");
            return;
        }
        res.status(200).json(item);
    })
        .catch((err) => res.status(500).send(err));
});
router.delete("/:id/:Category/:ItemType/:ItemName", (req, res) => {
    if (req.params.Category !== "Weapons" && req.params.Category !== "Armor") {
        res.status(400).send();
        return;
    }
    const cat = req.params.Category;
    const itemtype = decodeURIComponent(req.params.ItemType);
    const itemname = decodeURIComponent(req.params.ItemName);
    const id = decodeURIComponent(req.params.id);
    //const numAdded = 
    Equipments.deleteItem(id, cat, itemtype, itemname).then((equipment) => {
        if (!equipment) {
            res.status(404).send("Item type not found");
            return;
        }
        res.status(204).json(equipment);
    })
        .catch((err) => res.status(500).send(err));
});
export default router;
