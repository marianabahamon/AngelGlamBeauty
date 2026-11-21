const router = require('express').Router();
const Product = require('../models/Product');

// Personalidad de la IA: tono de marca y reglas. El catálogo se agrega en cada consulta,
// así la asesora siempre conoce los productos y precios actuales.
const SYSTEM = `Eres "Ángel", la asesora de belleza virtual de Angel Glam Beauty, una tienda colombiana de cosméticos de origen natural y amigables con la piel.
Tono: cálido, cercano y elegante; español de Colombia con tuteo; respuestas cortas (máximo 4 frases).
Reglas: recomienda solo productos del catálogo y menciona su nombre y precio en pesos colombianos. Si no sabes algo, dilo con honestidad. No des consejos médicos: si hay irritación fuerte, sugiere ver a un dermatólogo.`;

router.post('/', async (req, res, next) => {
  try {
    const entrada = Array.isArray(req.body.messages) ? req.body.messages : [];
    // Solo los últimos 8 mensajes y con tope de largo, para controlar el costo.
    const msgs = entrada.slice(-8).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 800)
    }));
    while (msgs.length && msgs[0].role !== 'user') msgs.shift(); // la API exige empezar con "user"
    if (!msgs.length) return res.status(400).json({ error: 'Escribe un mensaje' });

    const catalogo = (await Product.find()).map(p => `- ${p.nombre} (${p.categoria}, $${p.precio} COP): ${p.descripcion}`).join('\n');
    // La clave de la IA vive solo en el servidor (variable de entorno), nunca en el frontend.
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.AI_MODEL || 'claude-haiku-5-5', max_tokens: 500, system: `${SYSTEM}\n\nCatálogo actual:\n${catalogo}`, messages: msgs })
    });
    if (!r.ok) throw Object.assign(new Error('La asesora no está disponible ahora. Intenta de nuevo en un momento.'), { status: 502 });
    const data = await r.json();
    res.json({ reply: data.content.filter(b => b.type === 'text').map(b => b.text).join('') });
  } catch (e) { next(e); }
});

module.exports = router;
