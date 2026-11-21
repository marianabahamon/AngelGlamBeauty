const jwt = require('jsonwebtoken');
// Verifica el token JWT que el frontend manda en el encabezado Authorization.
exports.requireAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Inicia sesión para continuar' }); }
};
// El rol viaja dentro del token firmado, así que no se puede falsificar desde el navegador.
exports.requireAdmin = (req, res, next) =>
  req.user && req.user.role === 'admin' ? next()
    : res.status(403).json({ error: 'Solo la administradora puede hacer esto' });
