// backend/server.js
const express = require('express');
const cors = require('cors');
const stationsRouter = require('./routes/stations');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Permettre les requêtes depuis le frontend
app.use(express.json());

// Routes
app.use('/api', stationsRouter);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});