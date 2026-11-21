// Carga los 10 productos iniciales si la colección está vacía. Uso: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const P = (nombre, categoria, precio, descripcion, color, img) => ({ nombre, categoria, precio, descripcion, color, img: 'img/' + img });
const datos = [
  P('Labial Mora Silvestre','Labios',38000,'Cremoso, con manteca de karité y cera de abejas.','#7A2742','mora-silvestre.jpg'),
  P('Labial Rosa de Cacao','Labios',38000,'Tono rosado cálido, acabado satinado.','#C4606B','rosa-de-cacao.jpg'),
  P('Bálsamo de Caléndula','Labios',22000,'Hidrata y repara labios resecos.','#E0A96D','balsamo-calendula.jpg'),
  P('Base Mineral Arena','Rostro',65000,'Cobertura media con pigmentos minerales.','#D2A486','base-mineral-arena.jpg'),
  P('Rubor de Pétalos','Rostro',42000,'Polvo suave que se funde con la piel.','#E58D8D','rubor-de-petalos.jpg'),
  P('Iluminador Perla','Rostro',46000,'Brillo sutil con mica natural.','#EBCFB0','iluminador-perla.jpg'),
  P('Máscara de Pestañas Ricino','Ojos',39000,'Define y nutre con aceite de ricino.','#2B1D22','mascara-ricino.jpg'),
  P('Sombras Tierra y Rosa','Ojos',58000,'Paleta de 6 tonos de larga duración.','#A66A5B','sombras-tierra-rosa.jpg'),
  P('Sérum de Aloe y Rosa Mosqueta','Cuidado',72000,'Luminosidad y suavidad para todo tipo de piel.','#5E7B5A','serum-aloe-rosa-mosqueta.jpg'),
  P('Agua Floral de Manzanilla','Cuidado',29000,'Calma y refresca; ideal para pieles sensibles.','#B7C59A','agua-floral-manzanilla.jpg')
];
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  if (await Product.countDocuments()) console.log('Ya hay productos; no se agregó nada.');
  else { await Product.insertMany(datos); console.log('Productos cargados.'); }
  await mongoose.disconnect();
})();
