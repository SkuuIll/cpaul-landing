(() => {
'use strict';
const $ = (q,scope=document) => scope.querySelector(q);
const $$ = (q,scope=document) => [...scope.querySelectorAll(q)];
const clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n));
const mix=(a,b,p)=>a+(b-a)*p;
const root=document.documentElement;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionPaused=false,scheduled=false,activeChapter=-1,selectedLayer=0;
const saga=$('.intro-saga'),hero=$('.hero-object'),macro=$('.macro-scene'),
macroPhoto=$('.macro-image-wrap'),fabric=$('.fabric-story'),stack=$('.stack-stage');
const chapters=$$('.scene-words'),steps=$$('.fabric-step'),layers=$$('.fabric-layer');
const video=$('#process-video'),videoButton=$('.video-control');
const menu=$('#mobile-menu'),menuButton=$('.mobile-toggle');
const isSmall=()=>window.innerWidth<=850;
root.classList.toggle('js-motion',!reduced);
const year=$('#year');if(year)year.textContent=new Date().getFullYear();
function sectionProgress(el){
 if(!el)return 0;
 const r=el.getBoundingClientRect(),available=Math.max(1,r.height-window.innerHeight);
 return clamp(-r.top/available);
}
function sceneChange(i){
 if(activeChapter===i)return;
 activeChapter=i;
 chapters.forEach((el,index)=>el.classList.toggle('is-active',index===i));
 const idx=$('.index-current');if(idx)idx.textContent='0'+(i+1);
 $$('.chapter-lines i').forEach((el,index)=>el.classList.toggle('active',index===i));
}
function render(){
 scheduled=false;
 const total=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
 root.style.setProperty('--progress',clamp(window.scrollY/total).toFixed(4));
 if(motionPaused)return;
 const sp=sectionProgress(saga);
 root.style.setProperty('--hero-progress',sp.toFixed(4));
 sceneChange(sp<.325?0:sp<.67?1:2);
 if(hero){
  const sx=isSmall()?1.0:1.0;
  const rotationY=mix(-14,21,sp);
  const rotationX=mix(-9,9,sp);
  const rotationZ=mix(-3,2,sp);
  const zoom=mix(1,1.42,sp);
  const travelX=isSmall()?mix(0,12,sp):mix(0,5,sp);
  hero.style.transform='translate(calc(-50% + '+travelX+'%),-50%) perspective(1400px) rotateX('+rotationX.toFixed(2)+'deg) rotateY('+rotationY.toFixed(2)+'deg) rotateZ('+rotationZ.toFixed(2)+'deg) scale('+(sx*zoom).toFixed(3)+')';
  hero.style.opacity=String(mix(1,.58,Math.max(0,sp-.55)/.45));
 }
 if(macroPhoto&&macro){
  const mp=sectionProgress(macro);
  macroPhoto.style.transform='scale('+mix(1.07,1.54,mp).toFixed(3)+') translate3d('+mix(0,-4,mp).toFixed(2)+'%,0,0)';
  const z=$('.zoom-value');if(z)z.textContent=mix(1,1.54,mp).toFixed(2)+'×';
 }
 if(fabric&&stack){
  const fp=isSmall()?clamp((window.innerHeight-fabric.getBoundingClientRect().top)/(fabric.offsetHeight+window.innerHeight)*1.8):sectionProgress(fabric);
  const explode=reduced?1:clamp(fp*1.55);
  root.style.setProperty('--explosion',explode.toFixed(3));
  const wave=Math.sin(fp*Math.PI)*3;
  stack.style.transform='rotateX('+(8+wave).toFixed(2)+'deg) rotateY('+mix(-16,10,fp).toFixed(2)+'deg) rotateZ('+mix(-5,1,fp).toFixed(2)+'deg)';
  layers.forEach((el,i)=>{
   const factor=isSmall()?.68:1;
   const base=i*14-20;
   const y=(base+explode*(i-1.5)*115)*factor-(selectedLayer===i?12:0);
   const z=(i-1.5)*23+explode*(i-1.5)*44+(selectedLayer===i?24:0);
   el.style.transform='translate3d(0,'+y.toFixed(2)+'px,'+z.toFixed(2)+'px) rotateX(58deg) rotateZ(-13deg)';
  });
 }
}
function requestPaint(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
window.addEventListener('scroll',requestPaint,{passive:true});
window.addEventListener('resize',requestPaint,{passive:true});
function closeMenu(){
 if(!menu||!menuButton)return;
 menu.hidden=true;document.body.classList.remove('nav-open');
 menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menú');
}
menuButton?.addEventListener('click',()=>{
 const opening=menu.hidden;
 menu.hidden=!opening;document.body.classList.toggle('nav-open',opening);
 menuButton.setAttribute('aria-expanded',String(opening));
 menuButton.setAttribute('aria-label',opening?'Cerrar menú':'Abrir menú');
});
$$('.mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
steps.forEach((button,i)=>button.addEventListener('click',()=>{
 selectedLayer=i;
 steps.forEach((x,j)=>{x.classList.toggle('active',i===j);x.setAttribute('aria-pressed',String(i===j))});
 layers.forEach((x,j)=>x.classList.toggle('selected',i===j));
 requestPaint();
}));
layers[0]?.classList.add('selected');
if(!reduced && 'IntersectionObserver' in window){
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}
 }),{threshold:.1,rootMargin:'0px 0px -25px 0px'});
 $$('.reveal').forEach(el=>revealObserver.observe(el));
}else{$$('.reveal').forEach(el=>el.classList.add('visible'))}
function playVideo(){
 if(!video||reduced||motionPaused||video.dataset.userPaused==='1')return;
 if(!video.dataset.loaded && video.dataset.src){video.src=video.dataset.src;video.dataset.loaded='1'}
 video.play().then(()=>video.classList.add('loaded')).catch(()=>{});
}
function pauseVideo(){video?.pause()}
if(video && 'IntersectionObserver' in window){
 const videoObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting)playVideo();else pauseVideo();
 }),{threshold:.15});videoObserver.observe(video);
}else if(video){video.addEventListener('canplay',()=>video.classList.add('loaded'))}
video?.addEventListener('error',()=>{video.classList.remove('loaded');video.dataset.userPaused='1'});
videoButton?.addEventListener('click',()=>{
 if(!video)return;
 if(video.paused){video.dataset.userPaused='0';playVideo();videoButton.textContent='Ⅱ VIDEO';videoButton.setAttribute('aria-label','Pausar video');videoButton.setAttribute('aria-pressed','false')}
 else{video.dataset.userPaused='1';pauseVideo();videoButton.textContent='▷ VIDEO';videoButton.setAttribute('aria-label','Reproducir video');videoButton.setAttribute('aria-pressed','true')}
});
const motionButton=$('.motion-toggle');
motionButton?.addEventListener('click',()=>{
 motionPaused=!motionPaused;
 document.body.classList.toggle('motion-off',motionPaused);
 motionButton.setAttribute('aria-pressed',String(motionPaused));
 motionButton.textContent=motionPaused?'ACTIVAR MOVIMIENTO ▷':'PAUSAR MOVIMIENTO Ⅱ';
 if(motionPaused){pauseVideo();$$('.reveal').forEach(el=>el.classList.add('visible'))}
 else{if(video?.getBoundingClientRect().top<window.innerHeight)playVideo();requestPaint()}
});
if(!reduced && window.matchMedia('(pointer:fine)').matches){
 window.addEventListener('pointermove',e=>{
  root.style.setProperty('--ptr-x',(e.clientX/window.innerWidth*100).toFixed(1)+'%');
  root.style.setProperty('--ptr-y',(e.clientY/window.innerHeight*100).toFixed(1)+'%');
 },{passive:true});
}
if(reduced){sceneChange(0);root.style.setProperty('--explosion','1')}
render();
})();