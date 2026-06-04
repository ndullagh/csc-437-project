// src/routes/profile.ts
import express from "express";
import Profiles from "../services/profile-svc.js";
const router = express.Router();
router.get("/:userid", (req, res) => {
    const { userid } = req.params;
    Profiles.get(userid)
        .then((prof) => {
        if (!prof)
            res.status(404).send();
        else
            res.send(prof);
    })
        .catch((err) => res.status(404).send(err));
});
router.put("/:userid", (req, res) => {
    const { userid } = req.params;
    const newProfile = req.body;
    Profiles.update(userid, newProfile)
        .then((prof) => {
        if (!prof)
            res.status(409).send();
        else
            res.send(prof);
    })
        .catch((err) => res.status(500).send(err));
});
export default router;
