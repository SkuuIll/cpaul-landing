'use strict';
document.body.classList.add('js');

// Navigation toggle (null-safe for 404.html and other pages)
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
if(toggle && nav){
  toggle.hidden = false;
  function closeMenu(){ nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
  toggle.addEventListener('click',()=>{const open = nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && nav.classList.contains('open')){closeMenu();toggle.focus();}});
  document.addEventListener('click',e=>{if(nav.classList.contains('open') && !e.target.closest('.header'))closeMenu();});
  const media=window.matchMedia('(min-width: 761px)');media.addEventListener('change',closeMenu);
}

// Product category filters (null-safe)
const filterBar = document.querySelector('.filter-bar');
if(filterBar){
  filterBar.hidden=false;
  const cards=[...document.querySelectorAll('.product')];
  document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
   document.querySelectorAll('.filter').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
   cards.forEach(card=>{card.hidden=button.dataset.filter!=='all' && card.dataset.category!==button.dataset.filter;});
   const n=cards.filter(c=>!c.hidden).length;
   const countEl = document.querySelector('#product-count');
   if(countEl) countEl.textContent=`${n} ${n===1?'prenda para descubrir':'prendas para descubrir'}`;
  }));
}

// Inquiry Form to WhatsApp (null-safe)
const submitBtn = document.querySelector('.submit');
const form=document.querySelector('#inquiry-form');
if(submitBtn && form){
  submitBtn.hidden=false;
  const garment=document.querySelector('#garment');const qty=document.querySelector('#quantity');const design=document.querySelector('#design');
  function updateSummary(){
    const n=Number(qty.value);
    const summaryEl = document.querySelector('#form-summary');
    if(summaryEl) summaryEl.textContent=`${garment.value} · ${qty.validity.valid && qty.value ? `${n} ${n===1?'unidad':'unidades'}` : 'Revisá la cantidad'} · ${design.value}`;
  }
  form.addEventListener('input',updateSummary);
  document.querySelectorAll('[data-product]').forEach(link=>link.addEventListener('click',()=>{garment.value=link.dataset.product;updateSummary();}));
  form.addEventListener('submit',e=>{
   e.preventDefault();if(!form.reportValidity())return;
   const name=document.querySelector('#name').value.trim();const notes=document.querySelector('#notes').value.trim();
   const message=[`Hola CPAUL${name ? `, soy ${name}` : ''}. Quisiera consultar por un pedido.`,`Prenda: ${garment.value}`,`Cantidad: ${qty.value}`,`Diseño: ${design.value}`,notes ? `Detalles: ${notes}` : '', '¿Me pueden confirmar disponibilidad, presupuesto y tiempos de entrega?'].filter(Boolean).join('\n');
   // Use location.href instead of window.open to avoid popup blockers on mobile
   window.location.href = `https://wa.me/5493731432024?text=${encodeURIComponent(message)}`;
  });
}

// Dynamic year in footer (null-safe)
const yearEl = document.querySelector('#year');
if(yearEl) yearEl.textContent=new Date().getFullYear();

// Social Sharing & Toast Notification
const toast=document.querySelector('#toast');
let toastTimer;
function showToast(msg){
 if(!toast)return;
 toast.textContent=msg;
 toast.classList.add('active');
 toast.setAttribute('aria-hidden','false');
 clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>{
   toast.classList.remove('active');
   toast.setAttribute('aria-hidden','true');
 },2600);
}

function copyUrl(){
 const url=window.location.href.split('#')[0];
 if(navigator.clipboard && navigator.clipboard.writeText){
  navigator.clipboard.writeText(url).then(()=>{showToast('✓ Enlace copiado al portapapeles');}).catch(()=>{fallbackCopy(url);});
 } else {
  fallbackCopy(url);
 }
}

function fallbackCopy(url){
 const input=document.createElement('input');
 input.value=url;
 input.style.cssText='position:fixed;left:-9999px;top:-9999px;opacity:0';
 document.body.appendChild(input);
 input.focus();
 input.setSelectionRange(0, 99999);
 try{
  document.execCommand('copy');
  showToast('✓ Enlace copiado al portapapeles');
 }catch(err){
  showToast('Enlace: '+url);
 }
 document.body.removeChild(input);
}

async function shareSite(){
 const shareData={
  title:'CPAUL | Indumentaria y bordados con identidad',
  text:'Conocé CPAUL: indumentaria y bordados personalizados desde Charata, Chaco.',
  url:window.location.href.split('#')[0]
 };
 if(navigator.share){
  try{
   await navigator.share(shareData);
  }catch(err){
   if(err.name!=='AbortError')copyUrl();
  }
 } else {
  copyUrl();
 }
}

document.querySelectorAll('.share-trigger').forEach(btn=>btn.addEventListener('click',shareSite));
document.querySelectorAll('.copy-link-trigger').forEach(btn=>btn.addEventListener('click',copyUrl));

// Update WhatsApp share link with dynamic URL
const waShareLink=document.querySelector('.whatsapp-share-link');
if(waShareLink){
 const currentUrl=window.location.href.split('#')[0];
 const waText=encodeURIComponent('Te comparto el sitio de CPAUL, indumentaria y bordados con identidad propia: '+currentUrl);
 waShareLink.href=`https://wa.me/?text=${waText}`;
}

// Keep movement active by default, respect prefers-reduced-motion
const motionButton=document.querySelector('.motion-toggle');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=reducedMotion.matches;
let motionFrame=0;
const depthLayers=[...document.querySelectorAll('[data-depth]')];

function renderDepth(){
 motionFrame=0;
 if(motionPaused)return;
 depthLayers.forEach(el=>{
  const section=el.closest('section');
  if(!section)return;
  const bounds=section.getBoundingClientRect();
  if(bounds.bottom>0 && bounds.top<innerHeight){
   const offset=Math.max(-55,Math.min(55,-bounds.top*Number(el.dataset.depth)));
   el.style.setProperty('--parallax',`${offset.toFixed(1)}px`);
  }
 });
}

function requestDepth(){if(!motionFrame && !motionPaused)motionFrame=requestAnimationFrame(renderDepth);}

function applyMotion(){
 document.body.classList.toggle('motion-paused',motionPaused);
 if(motionButton){
  motionButton.setAttribute('aria-pressed',String(motionPaused));
  motionButton.setAttribute('aria-label',motionPaused?'Activar animaciones':'Pausar animaciones');
  const label=motionButton.querySelector('.motion-label');
  if(label)label.textContent=motionPaused?'Activar movimiento':'Pausar movimiento';
  const icon=motionButton.querySelector('.motion-icon');
  if(icon)icon.textContent=motionPaused?'▷':'Ⅱ';
 }
 if(motionPaused){
  depthLayers.forEach(el=>el.style.setProperty('--parallax','0px'));
  document.querySelectorAll('.reveal').forEach(el=>el.classList.remove('pending'));
 } else {
  requestDepth();
 }
}

// Sync with OS-level reduced motion preference
reducedMotion.addEventListener('change',()=>{
 motionPaused=reducedMotion.matches;
 applyMotion();
});

if(motionButton){
 motionButton.hidden=false;
 motionButton.addEventListener('click',()=>{
  motionPaused=!motionPaused;
  applyMotion();
 });
}

// Apply initial motion state
applyMotion();

window.addEventListener('scroll',requestDepth,{passive:true});
window.addEventListener('resize',requestDepth,{passive:true});

if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){
    entry.target.classList.remove('pending');
    entry.target.classList.add('in-view');
    observer.unobserve(entry.target);
   }
  });
 },{threshold:0.07,rootMargin:'0px 0px 25px 0px'});
 document.querySelectorAll('.section-heading,.product,.identity-copy,.steps article,.quote-intro,.faq-list,.contact-title,.share-section').forEach(el=>{
  el.classList.add('reveal');
  if(el.getBoundingClientRect().top>innerHeight && !motionPaused)el.classList.add('pending');
  observer.observe(el);
 });
}
