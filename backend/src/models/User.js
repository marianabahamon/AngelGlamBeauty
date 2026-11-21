const { Schema, model } = require('mongoose');
// role: "admin" lo recibe solo el correo definido en ADMIN_EMAIL (ver routes/auth.js).
module.exports = model('User', new Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  tel: { type: String, required: true },
  password: { type: String, required: true }, // siempre guardada con hash (bcrypt)
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true }));
