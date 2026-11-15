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
function subtotal(){return carrito.reduce((s,i)=>s+PRODUCTOS.find(p=>p.id===i.id).p*i.q,0)}
function guardarCarrito(){localStorage.setItem("agb_carrito",JSON.stringify(carrito));pintarCarrito()}
function agregar(id){
  const it=carrito.find(i=>i.id===id);
  it?it.q++:carrito.push({id,q:1});
  guardarCarrito();aviso("Producto agregado al carrito");
}
function pintarCarrito(){
  $("#cuenta").textContent=carrito.reduce((s,i)=>s+i.q,0);
  $("#total").textContent=cop(subtotal());
  $("#items").innerHTML=carrito.length?carrito.map(i=>{
    const p=PRODUCTOS.find(x=>x.id===i.id);
    return `<div class="item"><div><b>${esc(p.n)}</b><br>${cop(p.p)}</div><b>${cop(p.p*i.q)}</b>
    <div class="cant"><button data-m="${i.id}">−</button>${i.q}<button data-s="${i.id}">+</button></div>
    <button class="quitar" data-q="${i.id}">Quitar</button></div>`}).join(""):'<p class="vacio">Tu carrito está vacío. Agrega algo del catálogo.</p>';
}
$("#items").addEventListener("click",e=>{
  const d=e.target.dataset;const id=+(d.m||d.s||d.q);if(!id)return;
  const it=carrito.find(i=>i.id===id);
  if(d.s)it.q++;
  if(d.m)it.q--;
  if(d.q||it.q<1)carrito=carrito.filter(i=>i.id!==id);
  guardarCarrito();
});

function abrirCajon(on){$("#cajon").classList.toggle("on",on);$("#velo").classList.toggle("on",on)}
$("#btnCarrito").onclick=()=>abrirCajon(true);
$("#velo").onclick=()=>abrirCajon(false);
$$("[data-cerrar]").forEach(b=>b.onclick=()=>{abrirCajon(false);b.closest("dialog")?.close()});
/* Cuenta */
function pintarCuenta(){
  const dentro=!!sesion;
  $("#btnLogin").hidden=dentro;$("#btnRegistro").hidden=dentro;$("#btnSalir").hidden=!dentro;
  $("#saludo").textContent=dentro?"Hola, "+sesion.nombre.split(" ")[0]:"";
  $("#btnAdmin").hidden=!(dentro&&sesion.admin);
}
function abrirAuth(tab){$(`.tabs [data-tab="${tab}"]`).click();$("#modalAuth").showModal()}
$("#btnLogin").onclick=()=>abrirAuth("login");
$("#btnRegistro").onclick=()=>abrirAuth("registro");
$("#btnSalir").onclick=()=>{sesion=null;localStorage.removeItem("agb_sesion");pintarCuenta();aviso("Cerraste sesión")};
$$(".tabs button").forEach(b=>b.onclick=()=>{
  $$(".tabs button").forEach(x=>x.classList.toggle("on",x===b));
  $("#formLogin").hidden=b.dataset.tab!=="login";
  $("#formRegistro").hidden=b.dataset.tab!=="registro";
});
async function hash(t){
  const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));
  return [...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
function iniciar(u){sesion={nombre:u.nombre,email:u.email,tel:u.tel,admin:u.email===ADMIN_EMAIL};localStorage.setItem("agb_sesion",JSON.stringify(sesion));pintarCuenta()}
$("#formRegistro").onsubmit=async e=>{
  e.preventDefault();const f=Object.fromEntries(new FormData(e.target));
  f.email=f.email.toLowerCase();
  if(usuarios.some(u=>u.email===f.email)){$("#errRegistro").textContent="Ese correo ya tiene una cuenta. Inicia sesión.";return}
  const u={nombre:f.nombre,email:f.email,tel:f.tel,pass:await hash(f.pass)};
  usuarios.push(u);localStorage.setItem("agb_usuarios",JSON.stringify(usuarios));
  iniciar(u);e.target.reset();$("#errRegistro").textContent="";$("#modalAuth").close();aviso("Cuenta creada. ¡Bienvenida!");
};
$("#formLogin").onsubmit=async e=>{
  e.preventDefault();const f=Object.fromEntries(new FormData(e.target));
  const ph=await hash(f.pass);
  const u=usuarios.find(x=>x.email===f.email.toLowerCase()&&x.pass===ph);
  if(!u){$("#errLogin").textContent="Correo o contraseña incorrectos.";return}
  iniciar(u);e.target.reset();$("#errLogin").textContent="";$("#modalAuth").close();aviso("Sesión iniciada");
};