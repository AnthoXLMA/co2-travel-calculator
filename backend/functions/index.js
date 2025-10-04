import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

// Route distance (la même que ton server.js)
app.get("/distance", async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: "Les paramètres 'from' et 'to' sont requis" });
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
      from
    )}&destinations=${encodeURIComponent(to)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// ❌ Plus de app.listen()
// ✅ On exporte pour Firebase Functions
import * as functions from "firebase-functions";
export const api = functions.https.onRequest(app);
