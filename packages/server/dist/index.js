// src/index.ts
// packages/server/src/index.ts
import fs from "node:fs/promises";
import path from "path";
import express from "express";
import { connect } from "./services/mongo.js";
import Equipments from "./routes/equipments.js";
import Profiles from "./routes/profiles.js";
import auth from "./routes/auth.js";
import { authenticateUser } from "./routes/auth.js";
connect("MHSetBuilderDB"); // use your own db name here
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));
// Middleware:
app.use(express.json());
app.use("/api/Equipment", authenticateUser, Equipments);
app.use("/api/Profile", authenticateUser, Profiles);
app.use("/auth", auth);
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.use("/app", (req, res) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
