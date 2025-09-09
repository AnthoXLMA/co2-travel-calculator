// server.js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
console.log("Google API key loaded:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);


const app = express();

// ✅ Activer CORS (ici toutes les origines, pratique en dev)
app.use(cors());

// Route distance
app.get('/distance', async (req, res) => {
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

// Lancer le serveur
app.listen(5001, () => console.log('🚀 Server running on http://localhost:5001'));
