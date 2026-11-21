// API de Angel Glam Beauty: Express + Mongoose (MongoDB Atlas).
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
// CORS: solo el sitio publicado en GitHub Pages puede llamar a la API desde el navegador.
app.use(cors({ origin: (process.env.FRONTEND_URL || '*').split(',') }));
// Límite de 2 MB: las fotos de productos nuevos llegan reducidas desde el frontend.
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/chat', require('./src/routes/chat'));

// Manejo central de errores: el frontend siempre recibe { error: "mensaje claro" }.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(process.env.PORT || 3000, () => console.log('API lista')))
  .catch(e => { console.error('No se pudo conectar a MongoDB:', e.message); process.exit(1); });
