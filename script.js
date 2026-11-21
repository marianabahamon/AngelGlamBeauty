const BASE=[
{id:1,n:"Labial Mora Silvestre",c:"Labios",p:38000,d:"Cremoso, con manteca de karité y cera de abejas.",k:"#7A2742",img:"img/mora-silvestre.jpg"},
{id:2,n:"Labial Rosa de Cacao",c:"Labios",p:38000,d:"Tono rosado cálido, acabado satinado.",k:"#C4606B",img:"img/rosa-de-cacao.jpg"},
{id:3,n:"Bálsamo de Caléndula",c:"Labios",p:22000,d:"Hidrata y repara labios resecos.",k:"#E0A96D",img:"img/balsamo-calendula.jpg"},
{id:4,n:"Base Mineral Arena",c:"Rostro",p:65000,d:"Cobertura media con pigmentos minerales.",k:"#D2A486",img:"img/base-mineral-arena.jpg"},
{id:5,n:"Rubor de Pétalos",c:"Rostro",p:42000,d:"Polvo suave que se funde con la piel.",k:"#E58D8D",img:"img/rubor-de-petalos.jpg"},
{id:6,n:"Iluminador Perla",c:"Rostro",p:46000,d:"Brillo sutil con mica natural.",k:"#EBCFB0",img:"img/iluminador-perla.jpg"},
{id:7,n:"Máscara de Pestañas Ricino",c:"Ojos",p:39000,d:"Define y nutre con aceite de ricino.",k:"#2B1D22",img:"img/mascara-ricino.jpg"},
{id:8,n:"Sombras Tierra y Rosa",c:"Ojos",p:58000,d:"Paleta de 6 tonos de larga duración.",k:"#A66A5B",img:"img/sombras-tierra-rosa.jpg"},
{id:9,n:"Sérum de Aloe y Rosa Mosqueta",c:"Cuidado",p:72000,d:"Luminosidad y suavidad para todo tipo de piel.",k:"#5E7B5A",img:"img/serum-aloe-rosa-mosqueta.jpg"},
{id:10,n:"Agua Floral de Manzanilla",c:"Cuidado",p:29000,d:"Calma y refresca; ideal para pieles sensibles.",k:"#B7C59A",img:"img/agua-floral-manzanilla.jpg"}
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

/* Pago */
const NOTAS={tarjeta:"",pse:"Al confirmar te redirigiremos a tu banco para completar el pago.",nequi:"Te enviaremos una solicitud de pago a tu celular registrado en Nequi.",contra:"Pagas en efectivo al recibir. Se suma un recargo de $5.000."};
function recargo(){return $("#metodo").value==="contra"?5000:0}
function totalPago(){return subtotal()+ENVIO+recargo()}
function actualizarMetodo(){
  const m=$("#metodo").value;
  $("#camposTarjeta").hidden=m!=="tarjeta";
  $("#notaMetodo").textContent=NOTAS[m];
  $("#totalPago").textContent=cop(totalPago());
}
$("#metodo").onchange=actualizarMetodo;
$("#btnPagar").onclick=()=>{
  if(!carrito.length){aviso("Agrega productos antes de pagar");return}
  abrirCajon(false);
  if(!sesion){abrirAuth("login");aviso("Inicia sesión o crea tu cuenta para pagar");return}
  const f=$("#formPago");f.nombre.value=f.nombre.value||sesion.nombre;f.email.value=f.email.value||sesion.email;f.tel.value=f.tel.value||sesion.tel;
  actualizarMetodo();$("#modalPago").showModal();
};
$("#formPago").onsubmit=e=>{
  e.preventDefault();const f=e.target,err=$("#errPago");err.textContent="";
  if(f.metodo.value==="tarjeta"){
    const num=f.num.value.replace(/\s/g,"");
    if(!/^\d{13,19}$/.test(num)){err.textContent="Revisa el número de tarjeta.";return}
    if(!f.titular.value.trim()){err.textContent="Escribe el nombre que aparece en la tarjeta.";return}
    const m=f.vence.value.match(/^(\d{2})\/(\d{2})$/);
    if(!m||+m[1]<1||+m[1]>12){err.textContent="La fecha debe tener el formato MM/AA.";return}
    if(!/^\d{3,4}$/.test(f.cvv.value)){err.textContent="El CVV debe tener 3 o 4 números.";return}
  }
  const pedido="AGB-"+Date.now().toString().slice(-6);
  const pedidos=leer("agb_pedidos",[]);
  pedidos.push({pedido,email:f.email.value,total:totalPago(),metodo:f.metodo.value,items:carrito,fecha:new Date().toISOString()});
  localStorage.setItem("agb_pedidos",JSON.stringify(pedidos));
  $("#textoOk").textContent=`Tu pedido ${pedido} por ${cop(totalPago())} quedó registrado. Enviaremos la confirmación a ${f.email.value} y lo despacharemos a ${f.dir.value}, ${f.ciudad.value}.`;
  carrito=[];guardarCarrito();f.reset();
  $("#modalPago").close();$("#modalOk").showModal();
};

/* Administrar productos */
function refrescar(){
  PRODUCTOS=[...BASE,...extra];
  carrito=carrito.filter(i=>PRODUCTOS.some(p=>p.id===i.id));
  pintarFiltros();pintarProductos();guardarCarrito();
  $("#listaAdmin").innerHTML=extra.length?extra.map(p=>`<div class="item"><div><b>${esc(p.n)}</b><br>${esc(p.c)}, ${cop(p.p)}</div><button class="quitar" data-del="${p.id}">Eliminar</button></div>`).join(""):'<p class="vacio">Aún no has agregado productos propios.</p>';
}
function reducir(file){return new Promise(ok=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,600/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);ok(c.toDataURL("image/jpeg",.8))};im.src=r.result};r.readAsDataURL(file)})}
$("#btnAdmin").onclick=()=>$("#modalAdmin").showModal();
$("#formAdmin").onsubmit=async e=>{
  e.preventDefault();const f=e.target;
  const p={id:Date.now(),n:f.nombre.value.trim(),c:f.cat.value.trim(),p:+f.precio.value,d:f.desc.value.trim(),k:f.color.value};
  if(f.foto.files[0])p.img=await reducir(f.foto.files[0]);
  extra.push(p);
  try{localStorage.setItem("agb_extra",JSON.stringify(extra))}catch{extra.pop();$("#errAdmin").textContent="No hay espacio para guardar esa foto. Usa una más pequeña.";return}
  f.reset();$("#errAdmin").textContent="";refrescar();aviso("Producto agregado al catálogo");
};
$("#listaAdmin").addEventListener("click",e=>{
  const id=+e.target.dataset.del;if(!id)return;
  extra=extra.filter(p=>p.id!==id);localStorage.setItem("agb_extra",JSON.stringify(extra));refrescar();aviso("Producto eliminado");
});

refrescar();pintarCarrito();pintarCuenta();
