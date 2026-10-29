
'use strict';
(function(){
const root=document.documentElement,body=document.body;
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let paused=reduce,raf=0,activeChapter=-1,materialIndex=0,pointerX=0,pointerY=0;
const nav=$('#mobile-nav'),navToggle=$('#menu-toggle'),motionBtn=$('#motion-btn'),film=$('#process-film'),filmBtn=$('#film-btn'),hero=$('#hero'),materials=$('#material'),clips=$$('video');
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function closeNav(){nav.hidden=true;body.classList.remove('is-menu-open');navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Abrir menú')}
navToggle.addEventListener('click',function(){if(nav.hidden){nav.hidden=false;body.classList.add('is-menu-open');navToggle.setAttribute('aria-expanded','true');navToggle.setAttribute('aria-label','Cerrar menú')}else closeNav()});
$$('#mobile-nav a').forEach(a=>a.addEventListener('click',closeNav));
addEventListener('keydown',e=>{if(e.key==='Escape'&&!nav.hidden){closeNav();navToggle.focus()}});
matchMedia('(min-width:1101px)').addEventListener('change',closeNav);
$('#year').textContent=new Date().getFullYear();
const layerButtons=$$('.material-meter button'),planes=$$('.material-plane');
function focusLayer(index){materialIndex=index;layerButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));planes.forEach((p,i)=>p.classList.toggle('active',i===index));$('#material-type').textContent=['01 / TEJIDO','02 / ESTRUCTURA','03 / HILO','04 / TERMINACIÓN'][index]}
layerButtons.forEach((b,i)=>b.addEventListener('click',()=>focusLayer(i)));focusLayer(0);
function update(){
raf=0;const doc=Math.max(1,document.documentElement.scrollHeight-innerHeight);
root.style.setProperty('--progress',(scrollY/doc).toFixed(4));root.style.setProperty('--page-percent',(100*scrollY/doc).toFixed(2)+'%');
const heroSection=hero.closest('.hero-scroll'),b=heroSection.getBoundingClientRect(),d=Math.max(1,heroSection.offsetHeight-innerHeight),p=clamp(-b.top/d,0,1);
const mb=materials.getBoundingClientRect(),md=Math.max(1,materials.offsetHeight-innerHeight),mp=clamp(-mb.top/md,0,1);
const hp=paused?0:p;root.style.setProperty('--hero-p',hp.toFixed(4));root.style.setProperty('--hero-percent',(hp*100).toFixed(2)+'%');root.style.setProperty('--video-scale',(1.02+hp*.18).toFixed(3));root.style.setProperty('--word-shift-x',(-pointerX*15).toFixed(1)+'px');root.style.setProperty('--word-shift-y',(-hp*40).toFixed(1)+'px');root.style.setProperty('--object-x',(pointerX*19).toFixed(1)+'px');root.style.setProperty('--object-y',(pointerY*13-hp*20).toFixed(1)+'px');root.style.setProperty('--object-roty',(-pointerX*9-hp*12).toFixed(1)+'deg');root.style.setProperty('--object-rotx',(pointerY*7).toFixed(1)+'deg');root.style.setProperty('--object-scale',(1.01+hp*.16).toFixed(3));
root.style.setProperty('--mx',paused?'0':pointerX.toFixed(3));root.style.setProperty('--my',paused?'0':pointerY.toFixed(3));
const chapter=p<.31?0:p<.65?1:2;
if(chapter!==activeChapter){activeChapter=chapter;$$('.cinema-copy').forEach((node,i)=>node.classList.toggle('active',i===chapter));$('#chapter-counter').textContent='0'+(chapter+1)+' / 03';$('#chapter-word').textContent=['ORIGEN','MATERIA','IDENTIDAD'][chapter]}
planes.forEach((plane,i)=>{
 const base=[-130,-42,40,119][i],extra=[-140,-45,52,150][i];
 const y=base+(paused?.5:mp)*extra,angle=-14+mp*10;
 plane.style.transform='translate3d(0,'+y.toFixed(1)+'px, '+(4-i)*15+'px) rotateX(59deg) rotateZ('+angle.toFixed(1)+'deg) scale(.90)';
});
if(mp>.15&&mp<.95&&!paused){const ix=clamp(Math.floor(mp*4),0,3);if(ix!==materialIndex)focusLayer(ix)}
}
function schedule(){if(!raf)raf=requestAnimationFrame(update)}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
hero.addEventListener('pointermove',e=>{if(paused||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();pointerX=clamp((e.clientX-r.left)/r.width*2-1,-1,1);pointerY=clamp((e.clientY-r.top)/r.height*2-1,-1,1);schedule()});
hero.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;schedule()});
function setMotion(flag){paused=flag;body.classList.toggle('no-motion',flag);motionBtn.setAttribute('aria-pressed',String(flag));motionBtn.textContent=flag?'ACTIVAR MOVIMIENTO ↗':'PAUSAR MOVIMIENTO Ⅱ';if(flag){clips.forEach(v=>v.pause());if(filmBtn)filmBtn.textContent='REPRODUCIR ▷'}else{const r=film.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)film.play().catch(()=>{});schedule()}}
motionBtn.addEventListener('click',()=>setMotion(!paused));
filmBtn.addEventListener('click',()=>{if(film.paused){film.play().then(()=>filmBtn.textContent='PAUSAR Ⅱ').catch(()=>filmBtn.textContent='VIDEO NO DISPONIBLE')}else{film.pause();filmBtn.textContent='REPRODUCIR ▷'}});
if('IntersectionObserver' in window){
 const revealOb=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealOb.unobserve(e.target)}}),{rootMargin:'0px 0px 80px 0px',threshold:.02});
 $$('.reveal').forEach(el=>revealOb.observe(el));
 const filmOb=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&!paused){film.play().then(()=>filmBtn.textContent='PAUSAR Ⅱ').catch(()=>{})}else film.pause()}),{threshold:.1});
 filmOb.observe(film);
}else $$('.reveal').forEach(el=>el.classList.add('is-visible'));
film.addEventListener('error',()=>{filmBtn.textContent='VIDEO NO DISPONIBLE';filmBtn.disabled=true});
function updateTicker(){const track=$('.marquee-track');if(track&&reduce)track.style.animation='none'}updateTicker();
setMotion(paused);update();
})();
