import*as THREE from 'three';
export{THREE};
export function dot(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'#fff');r.addColorStop(.35,'rgba(255,255,255,.6)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)}
export function stage({fov=60,pos=[0,0,9],min=2,max=60,auto=0,pr=2}={}){
 const canvas=document.getElementById('gl'),renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setClearColor(0x000000,1);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(fov,1,.05,600),mouse=new THREE.Vector2(0,0),v=new THREE.Vector3(...pos),rc=new THREE.Raycaster();
 const o={r:v.length(),th:Math.atan2(v.x,v.z),ph:Math.acos(v.y/v.length())};o.tr=o.r;o.tth=o.th;o.tph=o.ph;
 let drag=false,lx=0,ly=0,moved=0;
 const S={scene,camera,renderer,mouse,onclick:null};
 function size(){renderer.setPixelRatio(Math.min(devicePixelRatio,pr));renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
 addEventListener('resize',size);size();
 canvas.addEventListener('pointerdown',e=>{drag=true;moved=0;lx=e.clientX;ly=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing'});
 canvas.addEventListener('pointerup',e=>{drag=false;canvas.style.cursor='grab';if(moved<5&&S.onclick)S.onclick(e)});
 canvas.addEventListener('pointermove',e=>{mouse.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);if(drag){const dx=e.clientX-lx,dy=e.clientY-ly;moved+=Math.abs(dx)+Math.abs(dy);o.tth-=dx*.006;o.tph=Math.min(3,Math.max(.12,o.tph-dy*.006));lx=e.clientX;ly=e.clientY}});
 canvas.addEventListener('wheel',e=>{e.preventDefault();o.tr=Math.min(max,Math.max(min,o.tr*(1+e.deltaY*.0012)))},{passive:false});
 S.hit=(n,c=0)=>{rc.setFromCamera(mouse,camera);return rc.ray.intersectPlane(new THREE.Plane(n,c),new THREE.Vector3())};
 S.run=fn=>{let last=performance.now(),t=0;(function f(now){const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;if(!drag)o.tth+=auto*dt;
  o.th+=(o.tth-o.th)*.08;o.ph+=(o.tph-o.ph)*.08;o.r+=(o.tr-o.r)*.08;
  camera.position.set(o.r*Math.sin(o.ph)*Math.sin(o.th),o.r*Math.cos(o.ph),o.r*Math.sin(o.ph)*Math.cos(o.th));camera.lookAt(0,0,0);camera.updateMatrixWorld();
  fn(dt,t);renderer.render(scene,camera);requestAnimationFrame(f)})(last)};
 return S}
export function hud({title,accent,hint,controls=[]}){
 document.documentElement.style.setProperty('--ac',accent);document.title=title+' — KHEROTIVE';
 const el=document.createElement('div');el.innerHTML=`<div class="title"><h1>${title}</h1><p>${hint}</p></div><a class="back" href="../../index.html" target="_top">← Dashboard</a><div class="panel"></div>`;
 document.body.append(el);const panel=el.querySelector('.panel'),val={};
 controls.forEach(c=>{const w=document.createElement(c.type==='button'?'button':'label');
  if(c.type==='button'){w.textContent=c.label;w.className='btn';w.onclick=c.on}
  else if(c.type==='text'){w.innerHTML=`<span>${c.label}</span><input type="text" value="${c.value}" maxlength="14">`;w.querySelector('input').oninput=e=>c.on(e.target.value)}
  else{w.innerHTML=`<span>${c.label}</span><input type="range" min="${c.min}" max="${c.max}" step="${c.step||.01}" value="${c.value}">`;val[c.id]=+c.value;w.querySelector('input').oninput=e=>{val[c.id]=+e.target.value;if(c.on)c.on(val[c.id])}}
  panel.append(w)});
 if(!controls.length)panel.remove();return val}
