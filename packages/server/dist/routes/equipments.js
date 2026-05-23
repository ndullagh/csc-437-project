// src/routes/equipment.ts
import express from "express";
import Equipments from "../services/equipment-svc.js";
//import equipment from "../services/equipment-svc.js";
const router = express.Router();
/*router.get("/", (_, res: Response) => {
  Equipments.get("usr") //check this
    .then((dest: Equipment | undefined) => {
      if (!dest) res.status(404).send();
      else res.send(dest)
    })
    .catch((err) => res.status(404).send(err));
});*/
router.get("/:id", (req, res) => {
    const { id } = req.params;
    Equipments.get(id) //check this
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
    const itemtype = req.params.ItemType;
    const id = req.params.id;
    //const numAdded = 
    Equipments.create(id, cat, itemtype, req.body).then((equipment) => {
        if (!equipment) {
            res.status(404).send("Item type not found");
            return;
        }
        res.status(201).json(equipment);
    })
        .catch((err) => res.status(500).send(err));
    /*if(numAdded === 0) {
      res.status(400).send();
      return;
    }
  
    res.status(201).json({added: numAdded});*/
});
router.put("/:id/:Category/:ItemType/:ItemName", (req, res) => {
    if (req.params.Category !== "Weapons" && req.params.Category !== "Armor") {
        res.status(400).send();
        return;
    }
    const cat = req.params.Category;
    const itemtype = req.params.ItemType;
    const itemname = req.params.ItemName;
    const id = req.params.id;
    //const numAdded = 
    Equipments.update(id, cat, itemtype, itemname, req.body).then((equipment) => {
        if (!equipment) {
            res.status(404).send("Item type not found");
            return;
        }
        res.status(200).json(equipment);
    })
        .catch((err) => res.status(500).send(err));
});
router.delete("/:id/:Category/:ItemType/:ItemName", (req, res) => {
    if (req.params.Category !== "Weapons" && req.params.Category !== "Armor") {
        res.status(400).send();
        return;
    }
    const cat = req.params.Category;
    const itemtype = req.params.ItemType;
    const itemname = req.params.ItemName;
    const id = req.params.id;
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
