const { Schema, model } = require('mongoose');
// Mensajes del formulario de contacto; la admin los lee desde su panel.
module.exports = model('Message', new Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, maxlength: 120 },
  mensaje: { type: String, required: true, trim: true, maxlength: 1000 }
}, { timestamps: true }));
