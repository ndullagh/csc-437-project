// src/index.ts
// packages/server/src/index.ts
import fs from "node:fs/promises";
import path from "path";
import express from "express";
import { connect } from "./services/mongo.js";
import Equipments from "./routes/equipments.js";
import auth from "./routes/auth.js";
import { authenticateUser } from "./routes/auth.js";
//const {EquipmentModel, index, get} = Equipment
connect("MHSetBuilderDB"); // use your own db name here
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));
// Middleware:
app.use(express.json());
app.use("/api/Equipment", authenticateUser, Equipments);
app.use("/auth", auth);
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
/*app.get("/api/Equipment", (req: Request, res: Response) => {
  Equipment.index()
    .then((list: equip[]) => {
      res.send({ count: list.length, data: list });
    })
    .catch((err) => res.status(500).send(err));
});*/
app.use("/app", (req, res) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
