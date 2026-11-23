const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, minlength: 1 },
  apellido: { type: String, required: true, trim: true, minlength: 1 },
  dni: { type: String, required: true, trim: true, minlength: 1 },
});

module.exports = mongoose.model('Person', personSchema);