// backend/routes/stations.js
const express = require('express');
const router = express.Router();
const db = require('../db/connect');
const fetch = require('node-fetch'); // Pour appeler l'API Google Maps

// Route pour récupérer les stations-service dans une zone tampon
router.get('/stations', async (req, res) => {
  try {
    const { buffer = 1000 } = req.query; // Buffer en mètres, par défaut 1km
    const query = `
      SELECT id, name, ST_AsGeoJSON(geom) as geom, fuel_types, services, hours, address
      FROM stations
      WHERE ST_DWithin(
        geom,
        ST_Transform(
          ST_GeomFromText(
            'LINESTRING(47.5132 -18.9251, 47.5256 -18.9054)', 4326
          ), 3857
        ),
        $1
      );
    `;
    const stations = await db.any(query, [buffer]);
    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer l'itinéraire Andoharanofotsy → Analakely
router.get('/route', async (req, res) => {
  try {
    const origin = 'Andoharanofotsy, Antananarivo, Madagascar';
    const destination = 'Analakely, Antananarivo, Madagascar';
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === 'OK') {
      const route = data.routes[0].overview_polyline.points; // Polyline encodée
      res.json({ polyline: route });
    } else {
      res.status(400).json({ error: 'Impossible de calculer l’itinéraire' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;