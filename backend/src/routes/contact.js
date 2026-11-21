const router = require('express').Router();
const Message = require('../models/Message');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Público: guarda el mensaje del formulario de contacto.
router.post('/', async (req, res, next) => {
  try {
    const nombre = String(req.body.nombre || '').trim();
    const email = String(req.body.email || '').trim();
    const mensaje = String(req.body.mensaje || '').trim();
    if (!nombre || !/^\S+@\S+\.\S+$/.test(email) || mensaje.length < 5)
      return res.status(400).json({ error: 'Revisa tu nombre, correo y mensaje' });
    await Message.create({ nombre, email, mensaje });
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

// Solo admin: leer y borrar mensajes recibidos.
router.get('/', requireAuth, requireAdmin, async (_req, res, next) => {
  try { res.json(await Message.find().sort('-createdAt')); } catch (e) { next(e); }
});
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try { await Message.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

module.exports = router;
