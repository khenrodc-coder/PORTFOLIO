import{THREE,stage,hud}from '../../assets/js/core.js';
const S=stage({fov:50,pos:[0,0,13],min:6,max:26});
const v=hud({title:'Kinetic Typography',accent:'#2fe07a',hint:'Push through the letters · drag to orbit · type your own word',controls:[{type:'text',label:'Your word',value:'DREAM BIG',on:w=>build(w)},{id:'s',label:'Force',min:.3,max:3,value:1.3}]});
const root=new THREE.Group();S.scene.add(root);let L=[];const LAY=12,nz=new THREE.Vector3(0,0,1);
function tex(ch){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.font='700 210px "Space Grotesk",Inter,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';g.fillText(ch,128,138);return new THREE.CanvasTexture(c)}
function build(word){
 L.forEach(l=>root.remove(l.g));L=[];word=(word||' ').toUpperCase();
 const adv=.64,n=[...word].length,sz=Math.min(2.6,15/(n*adv)),tot=n*adv*sz;
 [...word].forEach((ch,i)=>{if(ch===' ')return;const g=new THREE.Group(),tx=tex(ch),geo=new THREE.PlaneGeometry(sz,sz);
  for(let k=0;k<LAY;k++){const f=k/(LAY-1),m=new THREE.MeshBasicMaterial({map:tx,transparent:true,alphaTest:.35,color:new THREE.Color().setHSL(.4,.75,.88-f*.7)}),p=new THREE.Mesh(geo,m);p.position.z=-k*sz*.028;g.add(p)}
  const hx=-tot/2+(i+.5)*adv*sz;g.position.set(hx,0,0);root.add(g);L.push({g,hx,vel:new THREE.Vector3(),rv:new THREE.Vector3(),ph:i*.6})})}
build('DREAM BIG');
document.fonts.load('700 100px "Space Grotesk"').then(()=>build(document.querySelector('.panel input[type=text]').value));
S.run((dt,t)=>{const m=S.hit(nz,0),F=v.s;
 for(const l of L){const g=l.g,p=g.position,hy=Math.sin(t*1.4+l.ph)*.14;
  if(m){const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy)+.001;if(d<3){const f=(1-d/3)*F*60;l.vel.x+=dx/d*f*dt*.5;l.vel.y+=dy/d*f*dt*.5;l.vel.z+=f*dt*.9;l.rv.y+=(dx>0?1:-1)*f*dt*.25;l.rv.x+=(dy>0?-1:1)*f*dt*.18}}
  l.vel.x+=(l.hx-p.x)*30*dt;l.vel.y+=(hy-p.y)*30*dt;l.vel.z+=(0-p.z)*30*dt;l.vel.multiplyScalar(1-5*dt);
  p.addScaledVector(l.vel,dt);
  l.rv.x+=(-g.rotation.x*35-l.rv.x*5)*dt;l.rv.y+=(-g.rotation.y*35-l.rv.y*5)*dt;g.rotation.x+=l.rv.x*dt;g.rotation.y+=l.rv.y*dt}});
