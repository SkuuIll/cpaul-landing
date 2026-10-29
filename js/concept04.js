
/* CPAUL Concepto 04 — progressive, performance-aware cinematic experience. No storefront logic. */
(() => {
'use strict';
const $ = (s,scope=document) => scope.querySelector(s);
const $$ = (s,scope=document) => [...scope.querySelectorAll(s)];
const root=document.documentElement;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const mobile=matchMedia('(max-width: 760px)');
const lowPower=matchMedia('(max-width: 560px)');
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const story=$('#story'),lab=$('#materials'),model=$('#model-float'),chapters=$$('.story-text');
const layerButtons=$$('.material-legend button');
let storyProgress=0,materialProgress=0,stage=0,lastScroll=-1,raf=0;
let pointer={x:0,y:0},filteredPointer={x:0,y:0};
const navButton=$('#menu-toggle'),nav=$('#mobile-menu');
const year=$('#year');if(year)year.textContent=new Date().getFullYear();
function setMenu(open){
 if(!navButton||!nav)return;
 nav.hidden=!open;navButton.setAttribute('aria-expanded',String(open));
 navButton.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
 document.body.classList.toggle('nav-open',open);
}
navButton?.addEventListener('click',()=>setMenu(nav.hidden));
$$('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
function progressIn(node){
 if(!node)return 0;
 const r=node.getBoundingClientRect();
 return clamp(-r.top/Math.max(1,r.height-innerHeight));
}
function setChapter(i){
 if(stage===i)return;
 stage=i;
 chapters.forEach((el,index)=>{const active=index===i;el.classList.toggle('is-active',active);el.setAttribute('aria-hidden',String(!active))});
 $$('.chapter-marker').forEach((el,index)=>el.classList.toggle('active',index===i));
 const counter=$('#chapter-count');if(counter)counter.textContent='0'+(i+1);
}
function setMaterialLabel(i){
 layerButtons.forEach((el,index)=>{el.classList.toggle('active',index===i);el.setAttribute('aria-pressed',String(index===i))});
 const n=$('#material-index');if(n)n.textContent=('0'+(i+1)).slice(-2)+' / 05';
}
function tick(){
 raf=0;
 const y=scrollY||0;
 storyProgress=progressIn(story);
 materialProgress=progressIn(lab);
 const max=document.documentElement.scrollHeight-innerHeight;
 root.style.setProperty('--scroll-progress',(max>0?clamp(y/max):0).toFixed(4));
 root.style.setProperty('--scene-progress',storyProgress.toFixed(4));
 root.style.setProperty('--material-progress',materialProgress.toFixed(4));
 const chapter=storyProgress<.31?0:storyProgress<.67?1:2;
 setChapter(chapter);
 const n=clamp((storyProgress-.08)/.8),mobileScale=mobile.matches?1.0:.86;
 filteredPointer.x=lerp(filteredPointer.x,pointer.x,.10);
 filteredPointer.y=lerp(filteredPointer.y,pointer.y,.10);
 if(model){
   const tx=lerp(0,lowPower.matches?6:26,n)+filteredPointer.x*9;
   const ty=Math.sin(performance.now()*.0006)*(!reduced.matches?5:0)+lerp(10,-28,n)+filteredPointer.y*8;
   const rz=lerp(-6,5,n);
   model.style.transform='translate3d('+tx+'px,'+ty+'px,0) rotateY('+(lerp(-12,19,n)+filteredPointer.x*6)+'deg) rotateZ('+rz+'deg) scale('+(lerp(1,.85,n)*mobileScale)+')';
 }
 let selected=clamp(Math.floor(materialProgress*5),0,4);
 setMaterialLabel(selected);
 lastScroll=y;
 if(active3D)update3D(materialProgress);
 if(model&&story.getBoundingClientRect().bottom>0&&!reduced.matches)requestAnimationFrame(()=>schedule());
}
function schedule(){if(!raf)raf=requestAnimationFrame(tick)}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{resize3D();schedule()},{passive:true});
addEventListener('pointermove',e=>{
 if(reduced.matches||e.pointerType==='touch')return;
 pointer.x=(e.clientX/innerWidth-.5)*2;
 pointer.y=(e.clientY/innerHeight-.5)*2;
 schedule();
},{passive:true});
reduced.addEventListener?.('change',()=>{if(reduced.matches){pointer.x=0;pointer.y=0;}schedule()});
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(entries=>{
   for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}}
 },{rootMargin:'0px 0px 80px 0px',threshold:.07});
 $$('.reveal').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight+60)el.classList.add('visible');else io.observe(el)});
}else $$('.reveal').forEach(el=>el.classList.add('visible'));
let selectedLayer=-1;
layerButtons.forEach((btn,i)=>btn.addEventListener('click',()=>{
 selectedLayer=i;
 setMaterialLabel(i);
 const top=lab.offsetTop+(i+.5)/5*Math.max(0,lab.offsetHeight-innerHeight);
 if(reduced.matches)scrollTo(0,top);else scrollTo({top,behavior:'smooth'});
}));
const video=$('#process-video');
if(video&&'IntersectionObserver' in window){
 const obs=new IntersectionObserver(entries=>{
  for(const e of entries){
   if(e.isIntersecting && !reduced.matches && !lowPower.matches){
      if(video.dataset.src && !video.src){video.src=video.dataset.src;video.load();}
      if(video.src)video.play().catch(()=>{});
   }else video.pause();
  }
 },{threshold:.12});
 obs.observe(video);
 video.addEventListener('error',()=>{video.pause();video.style.opacity='0'});
}
const videoToggle=$('#video-toggle');
videoToggle?.addEventListener('click',()=>{if(!video)return;if(video.paused){if(video.dataset.src&&!video.src){video.src=video.dataset.src;video.load()}video.play().catch(()=>{});videoToggle.textContent='PAUSAR VIDEO'}else{video.pause();videoToggle.textContent='REPRODUCIR VIDEO'}});
/* THREE.JS — five genuinely spatial mesh surfaces with independent textile patterns.
   Optional enhancement: if CDN/WebGL is unavailable, CSS layered study remains visible. */
let active3D=false,renderer=null,scene=null,camera=null,layerGroup=null,meshes=[],lights=[];
const canvas=$('#material-canvas');
const visual=$('.material-visual');
function makeWeaveTexture(THREE,idx){
 const c=document.createElement('canvas');c.width=256;c.height=256;
 const g=c.getContext('2d');
 const base=['#20232d','#222c43','#7b7094','#343449','#8c8293'][idx];
 g.fillStyle=base;g.fillRect(0,0,256,256);
 const cols=['#c9d0df','#6e8ce0','#d8c5f2','#bc9d68','#e2e8ff'];
 const grain=['#545e72','#4261a8','#b19acb','#bd9e63','#bfc3d3'];
 const width=[5,7,4,6,8][idx];
 for(let y=0;y<256;y+=width){
   g.fillStyle=grain[idx];g.globalAlpha=.20;g.fillRect(0,y,256,1.5);
   for(let x=0;x<256;x+=width){
     if((x+y/width)% (idx===2?3:2)===0){g.fillStyle=cols[idx];g.globalAlpha=idx===3?.65:.21;g.fillRect(x,y,width*.66,1.3)}
   }
 }
 g.globalAlpha=.42;
 for(let x=0;x<256;x+=width){g.fillStyle=cols[idx];g.fillRect(x,0,1,256)}
 if(idx===3){
  g.strokeStyle='#e0b867';g.globalAlpha=.85;g.lineWidth=2;
  for(let y=14;y<256;y+=22){g.beginPath();g.moveTo(0,y);for(let x=0;x<256;x+=6){g.lineTo(x,y+Math.sin(x*.16+y*.05)*4)}g.stroke()}
 }
 g.globalAlpha=1;
 const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
 tex.repeat.set(2.5,1.7);tex.colorSpace=THREE.SRGBColorSpace;
 tex.anisotropy=2;return tex;
}
async function boot3D(){
 if(!canvas||reduced.matches)return;
 let THREE;
 try{THREE=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js')}
 catch(e){console.info('CPAUL: WebGL library unavailable; CSS fallback retained');return}
 try{
  const gl=canvas.getContext('webgl2',{antialias:!mobile.matches,alpha:true,powerPreference:'low-power'})||
           canvas.getContext('webgl',{antialias:false,alpha:true,powerPreference:'low-power'});
  if(!gl)return;
  renderer=new THREE.WebGLRenderer({canvas,context:gl,alpha:true,antialias:!mobile.matches,powerPreference:'low-power'});
  renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(33,1,.1,100);camera.position.set(0,1.3,9.6);camera.lookAt(0,0,0);
  layerGroup=new THREE.Group();scene.add(layerGroup);
  scene.add(new THREE.AmbientLight(0xadb8dc,1.35));
  const area=new THREE.DirectionalLight(0xf7d6a0,3.0);area.position.set(-2,6,6);scene.add(area);
  const rim=new THREE.PointLight(0x6977ff,20,15);rim.position.set(4,0,4);scene.add(rim);lights.push(rim);
  const names=['Superficie','Trama','Estructura','Hilo','Acabado'];
  for(let i=0;i<5;i++){
    const geometry=new THREE.PlaneGeometry(4.0,2.85,34,22);
    const pos=geometry.attributes.position;
    for(let k=0;k<pos.count;k++){
      let x=pos.getX(k),y=pos.getY(k);
      pos.setZ(k,.035*Math.sin(x*5+i)+.035*Math.sin(y*7+i*.6)+.026*Math.sin(x*11+y*4));
    }
    geometry.computeVertexNormals();
    const material=new THREE.MeshPhysicalMaterial({map:makeWeaveTexture(THREE,i),side:THREE.DoubleSide,roughness:i===4?.34:.79,metalness:i===4?.42:.10,clearcoat:i===4?.50:.11,clearcoatRoughness:.36,transparent:true,opacity:.98});
    const mesh=new THREE.Mesh(geometry,material);
    mesh.rotation.x=-.48;mesh.rotation.z=-.16;
    layerGroup.add(mesh);meshes.push(mesh);
    const edges=new THREE.EdgesGeometry(new THREE.BoxGeometry(4.02,2.87,.015));
    const outline=new THREE.LineSegments(edges,new THREE.LineBasicMaterial({color:i===3?0xd6b270:0x99aade,transparent:true,opacity:.26}));
    mesh.add(outline);
  }
  active3D=true;lab.classList.add('webgl-ready');
  resize3D();update3D(materialProgress);
  if('IntersectionObserver' in window){
    const renderObs=new IntersectionObserver(entries=>{
      if(entries[0]?.isIntersecting && !document.hidden){active3D=true;update3D(materialProgress)}
      else active3D=false;
    },{threshold:0.01});renderObs.observe(lab);
  }
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)update3D(materialProgress)});
 }catch(err){active3D=false;lab.classList.remove('webgl-ready');console.info('CPAUL: switching to CSS 3D fallback',err)}
}
function resize3D(){
 if(!renderer||!visual)return;
 const rect=visual.getBoundingClientRect();
 const w=Math.max(1,rect.width),h=Math.max(1,rect.height);
 const ratio=Math.min(devicePixelRatio||1,lowPower.matches?1:1.5);
 renderer.setPixelRatio(ratio);renderer.setSize(w,h,false);
 camera.aspect=w/h;camera.fov=mobile.matches?41:33;camera.updateProjectionMatrix();
 if(active3D)update3D(materialProgress);
}
function update3D(p){
 if(!renderer||!scene||!layerGroup||document.hidden)return;
 const t=clamp((p-.09)/.76),explode=t*t*(3-2*t);
 const mobileMode=mobile.matches;
 for(let i=0;i<meshes.length;i++){
   const mesh=meshes[i];const index=i-2;
   mesh.position.set(index*explode*(mobileMode?.065:.13),index*explode*(mobileMode?.31:.36),index*explode*.52+i*.011);
   mesh.rotation.x=lerp(-.65,-.55,explode)+index*.03;
   mesh.rotation.y=lerp(-.06,.17,explode)+index*.04;
   mesh.rotation.z=lerp(-.23,-.15,explode);
   mesh.material.opacity=1;
 }
 layerGroup.rotation.y=(pointer.x*.035)+(p-.5)*.18;
 layerGroup.rotation.z=(pointer.y*.02);
 layerGroup.position.y=mobileMode?-.65:-.12;
 layerGroup.scale.setScalar(mobileMode?.77:1.06);
 camera.position.z=lerp(9.6,8.9,explode);
 renderer.render(scene,camera);
}
schedule();
boot3D();
})();