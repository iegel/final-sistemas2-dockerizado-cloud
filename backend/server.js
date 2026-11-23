const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const personRoutes = require('./routes/personRoutes');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error(err));

app.use('/api/persons', personRoutes);

app.get('/', (req, res) => {
  res.send("Servidor backend está en funcionamiento.");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));