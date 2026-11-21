const { Schema, model } = require('mongoose');
module.exports = model('Product', new Schema({
  nombre: { type: String, required: true, trim: true },
  categoria: { type: String, required: true, trim: true },
  precio: { type: Number, required: true, min: 0 },
  descripcion: { type: String, required: true, trim: true },
  color: { type: String, default: '#7A2742' }, // se usa si el producto no tiene foto
  img: { type: String, default: '' }            // ruta ("img/x.jpg") o imagen en base64
}, { timestamps: true }));
