import{THREE,stage,hud,dot}from '../../assets/js/core.js';
const S=stage({pos:[0,0,11],min:4,max:30,auto:.05});
const v=hud({title:'Particle Flow',accent:'#7fe3ff',hint:'Move to stir the field · hold to pull · drag to orbit',controls:[{id:'f',label:'Flow speed',min:.2,max:3,value:1.2},{id:'a',label:'Pull strength',min:0,max:6,value:2.5}]});
const N=36000,R=7,P=new Float32Array(N*3),C=new Float32Array(N*3),A=new Float32Array(N);
function spawn(i){const u=Math.random()*6.283,w=Math.acos(2*Math.random()-1),r=R*Math.cbrt(Math.random());P[i*3]=r*Math.sin(w)*Math.cos(u);P[i*3+1]=r*Math.sin(w)*Math.sin(u);P[i*3+2]=r*Math.cos(w);A[i]=2+Math.random()*8}
for(let i=0;i<N;i++)spawn(i);
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('color',new THREE.BufferAttribute(C,3));
S.scene.add(new THREE.Points(g,new THREE.PointsMaterial({size:.07,map:dot(),vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));
let down=false;addEventListener('pointerdown',()=>down=true);addEventListener('pointerup',()=>down=false);
const col=new THREE.Color(),nz=new THREE.Vector3(0,0,1);
S.run((dt,t)=>{
 const m=S.hit(nz,0),f=v.f,pull=v.a*(down?2.5:.5);
 for(let i=0;i<N;i++){const k=i*3,x=P[k],y=P[k+1],z=P[k+2];
  let vx=Math.sin(y*.7+t*.5)+Math.cos(z*.6-t*.35),vy=Math.sin(z*.7+t*.4)+Math.cos(x*.6+t*.25),vz=Math.sin(x*.7-t*.3)+Math.cos(y*.6+t*.45);
  if(m){const dx=m.x-x,dy=m.y-y,dz=m.z-z,d2=dx*dx+dy*dy+dz*dz+.5;if(d2<36){const s=pull/d2;vx+=dx*s;vy+=dy*s;vz+=dz*s}}
  P[k]=x+vx*f*dt;P[k+1]=y+vy*f*dt;P[k+2]=z+vz*f*dt;
  A[i]-=dt;if(A[i]<0||x*x+y*y+z*z>R*R*1.6)spawn(i);
  const sp=Math.min(1,Math.hypot(vx,vy,vz)/3);col.setHSL(.5+sp*.35,.85,.3+sp*.3);C[k]=col.r;C[k+1]=col.g;C[k+2]=col.b}
 g.attributes.position.needsUpdate=true;g.attributes.color.needsUpdate=true});
