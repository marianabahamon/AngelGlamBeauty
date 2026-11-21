const router = require('express').Router();
const Product = require('../models/Product');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Público: cualquiera puede ver el catálogo.
router.get('/', async (_req, res, next) => {
  try { res.json(await Product.find().sort('createdAt')); } catch (e) { next(e); }
});

// Solo admin: crear y eliminar productos.
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { nombre, categoria, precio, descripcion, color, img } = req.body;
    if (!nombre || !categoria || !(Number(precio) > 0) || !descripcion)
      return res.status(400).json({ error: 'Faltan datos del producto' });
    res.status(201).json(await Product.create({
      nombre: String(nombre), categoria: String(categoria), precio: Number(precio),
      descripcion: String(descripcion), color: String(color || ''), img: String(img || '')
    }));
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); }
});

module.exports = router;
