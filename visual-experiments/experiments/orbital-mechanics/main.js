import{THREE,stage,hud,dot}from '../../assets/js/core.js';
const S=stage({pos:[0,16,30],min:8,max:90,auto:.03});
const v=hud({title:'Orbital Mechanics',accent:'#22c1ff',hint:'Real 3D gravity · click empty space to launch a planet · drag to orbit',controls:[{id:'s',label:'Time speed',min:.1,max:3,value:1},{type:'button',label:'Launch planet',on:()=>add()},{type:'button',label:'Reset system',on:()=>reset()}]});
const sp=new Float32Array(2400*3);for(let i=0;i<2400;i++){const u=Math.random()*6.283,w=Math.acos(2*Math.random()-1),r=180+Math.random()*120;sp.set([r*Math.sin(w)*Math.cos(u),r*Math.cos(w),r*Math.sin(w)*Math.sin(u)],i*3)}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));S.scene.add(new THREE.Points(sg,new THREE.PointsMaterial({size:1.3,sizeAttenuation:false,color:0x9aa4b8})));
const sun=new THREE.Mesh(new THREE.SphereGeometry(1.7,40,24),new THREE.MeshBasicMaterial({color:0xffe2b0})),glow=new THREE.Sprite(new THREE.SpriteMaterial({map:dot(),color:0xffa640,blending:THREE.AdditiveBlending,depthWrite:false}));glow.scale.set(11,11,1);
S.scene.add(sun,glow,new THREE.PointLight(0xffe2b0,3200,0,2),new THREE.AmbientLight(0xffffff,.08));
const GM=1000,EPS=.4,TL=280,X=new THREE.Vector3(1,0,0);let B=[];
function add(r=6+Math.random()*20,m=1+Math.random()*3){
 const a=Math.random()*6.283,inc=(Math.random()-.5)*.5,pos=new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r),vel=new THREE.Vector3(-Math.sin(a),0,Math.cos(a)).multiplyScalar(Math.sqrt(GM/r));
 pos.applyAxisAngle(X,inc);vel.applyAxisAngle(X,inc);
 const col=new THREE.Color().setHSL(Math.random(),.7,.6),mesh=new THREE.Mesh(new THREE.SphereGeometry(.22+m*.07,28,18),new THREE.MeshStandardMaterial({color:col,roughness:.55,emissive:col,emissiveIntensity:.12}));
 const tp=new Float32Array(TL*3);for(let i=0;i<TL;i++)tp.set([pos.x,pos.y,pos.z],i*3);
 const tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.BufferAttribute(tp,3));
 const line=new THREE.Line(tg,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));line.frustumCulled=false;
 S.scene.add(mesh,line);B.push({m,pos,vel,mesh,line,tp,tg})}
function reset(){B.forEach(b=>{S.scene.remove(b.mesh,b.line)});B=[];[5,7.5,10.5,14,18,22,27].forEach(r=>add(r))}
reset();S.onclick=()=>add();
const a=new THREE.Vector3(),d=new THREE.Vector3();
S.run(dt=>{const N=6,h=dt*v.s/N;
 for(let s=0;s<N;s++){for(const b of B){const r2=b.pos.lengthSq()+EPS;a.copy(b.pos).multiplyScalar(-GM/(r2*Math.sqrt(r2)));
   for(const o of B){if(o===b)continue;d.subVectors(o.pos,b.pos);const q=d.lengthSq()+EPS;a.addScaledVector(d,o.m/(q*Math.sqrt(q)))}
   b.vel.addScaledVector(a,h)}
  for(const b of B)b.pos.addScaledVector(b.vel,h)}
 B=B.filter(b=>{if(b.pos.length()>140){S.scene.remove(b.mesh,b.line);return false}return true});
 for(const b of B){b.mesh.position.copy(b.pos);b.tp.copyWithin(0,3);b.tp.set([b.pos.x,b.pos.y,b.pos.z],(TL-1)*3);b.tg.attributes.position.needsUpdate=true}});
