const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const firmar = u => jwt.sign({ id: u._id, role: u.role, nombre: u.nombre }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publico = u => ({ nombre: u.nombre, email: u.email, tel: u.tel, role: u.role });

router.post('/register', async (req, res, next) => {
  try {
    // String(...) evita que lleguen objetos raros (inyección NoSQL).
    const nombre = String(req.body.nombre || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const tel = String(req.body.tel || '').trim();
    const password = String(req.body.password || '');
    if (!nombre || !email || !tel || password.length < 6)
      return res.status(400).json({ error: 'Completa todos los campos (contraseña de mínimo 6 caracteres)' });
    if (await User.findOne({ email })) return res.status(409).json({ error: 'Ese correo ya tiene una cuenta' });
    const role = email === (process.env.ADMIN_EMAIL || '').trim().toLowerCase() ? 'admin' : 'user';
    const u = await User.create({ nombre, email, tel, role, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: firmar(u), user: publico(u) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const u = await User.findOne({ email: String(req.body.email || '').trim().toLowerCase() });
    // Mismo mensaje si falla el correo o la clave: no revela qué correos existen.
    if (!u || !(await bcrypt.compare(String(req.body.password || ''), u.password)))
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    res.json({ token: firmar(u), user: publico(u) });
  } catch (e) { next(e); }
});

module.exports = router;
