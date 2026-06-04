// src/routes/profile.ts
import express, { Request, Response } from "express";
import { Profile } from "../models";
import Profiles from "../services/profile-svc.js";

const router = express.Router();

router.get("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  Profiles.get(userid as string)
    .then((prof: Profile | undefined) => {
      if (!prof) res.status(404).send();
      else res.send(prof)
    })
    .catch((err) => res.status(404).send(err));
});


router.put("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;
  const newProfile = req.body as Profile;

  Profiles.update(userid as string, newProfile)
    .then((prof: Profile | undefined) => {
      if (!prof) res.status(409).send();
      else res.send(prof)
    })
    .catch((err) => res.status(500).send(err));
});

export default router;