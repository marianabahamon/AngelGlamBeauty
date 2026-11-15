const BASE=[
{id:1,n:"Labial Mora Silvestre",c:"Labios",p:38000,d:"Cremoso, con manteca de karité y cera de abejas.",k:"#7A2742"},
{id:2,n:"Labial Rosa de Cacao",c:"Labios",p:38000,d:"Tono rosado cálido, acabado satinado.",k:"#C4606B"},
{id:3,n:"Bálsamo de Caléndula",c:"Labios",p:22000,d:"Hidrata y repara labios resecos.",k:"#E0A96D"},
{id:4,n:"Base Mineral Arena",c:"Rostro",p:65000,d:"Cobertura media con pigmentos minerales.",k:"#D2A486"},
{id:5,n:"Rubor de Pétalos",c:"Rostro",p:42000,d:"Polvo suave que se funde con la piel.",k:"#E58D8D"},
{id:6,n:"Iluminador Perla",c:"Rostro",p:46000,d:"Brillo sutil con mica natural.",k:"#EBCFB0"},
{id:7,n:"Máscara de Pestañas Ricino",c:"Ojos",p:39000,d:"Define y nutre con aceite de ricino.",k:"#2B1D22"},
{id:8,n:"Sombras Tierra y Rosa",c:"Ojos",p:58000,d:"Paleta de 6 tonos de larga duración.",k:"#A66A5B"},
{id:9,n:"Sérum de Aloe y Rosa Mosqueta",c:"Cuidado",p:72000,d:"Luminosidad y suavidad para todo tipo de piel.",k:"#5E7B5A"},
{id:10,n:"Agua Floral de Manzanilla",c:"Cuidado",p:29000,d:"Calma y refresca; ideal para pieles sensibles.",k:"#B7C59A"}
];
const ENVIO=9000;
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const cop=n=>"$"+n.toLocaleString("es-CO");
const leer=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const ADMIN_EMAIL="admin@angelglambeauty.co";
const esc=t=>String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let extra=leer("agb_extra",[]);
let PRODUCTOS=[...BASE,...extra];
let carrito=leer("agb_carrito",[]);
let usuarios=leer("agb_usuarios",[]);
let sesion=leer("agb_sesion",null);
let filtro="Todos";

function aviso(t){const a=$("#aviso");a.textContent=t;a.classList.add("on");setTimeout(()=>a.classList.remove("on"),2200)}

function pintarFiltros(){
  const cats=["Todos",...new Set(PRODUCTOS.map(p=>p.c))];
  if(!cats.includes(filtro))filtro="Todos";
  $("#filtros").innerHTML=cats.map(c=>`<button class="${c===filtro?"on":""}" data-f="${esc(c)}">${esc(c)}</button>`).join("");
  $("#cats").innerHTML=cats.slice(1).map(c=>`<option value="${esc(c)}">`).join("");
}
function pintarProductos(){
  const q=$("#buscar").value.trim().toLowerCase();
  const lista=PRODUCTOS.filter(p=>(filtro==="Todos"||p.c===filtro)&&(p.n+" "+p.d).toLowerCase().includes(q));
  $("#grilla").innerHTML=lista.length?lista.map(p=>`<article class="prod">
    <div class="foto">${p.img?`<img src="${p.img}" alt="${esc(p.n)}">`:`<i style="--c:${esc(p.k)}"></i>`}</div>
    <h3>${esc(p.n)}</h3><p>${esc(p.d)}</p>
    <div class="fila"><b>${cop(p.p)}</b><button data-add="${p.id}">Agregar al carrito</button></div></article>`).join(""):'<p class="vacio">No encontramos productos con ese filtro. Prueba otra categoría o búsqueda.</p>';
}
$("#buscar").addEventListener("input",pintarProductos);
$("#filtros").addEventListener("click",e=>{if(e.target.dataset.f){filtro=e.target.dataset.f;pintarFiltros();pintarProductos()}});
$("#grilla").addEventListener("click",e=>{if(e.target.dataset.add){agregar(+e.target.dataset.add)}});