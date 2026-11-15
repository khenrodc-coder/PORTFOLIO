import{THREE,stage,hud}from '../../assets/js/core.js';
const S=stage({pos:[0,2,14],min:5,max:32,auto:.12});
const PAL=[[170,210,280,320],[0,20,40,330],[190,200,215,260],null];let pal=0;
const v=hud({title:'Harmonic Ribbons',accent:'#ff4fa3',hint:'Move to twist the ribbons · drag to orbit · scroll to zoom',controls:[{id:'n',label:'Lines',min:20,max:140,step:1,value:90},{id:'tw',label:'Twist',min:0,max:3,value:1.2},{id:'a',label:'Harmonics',min:1,max:7,step:1,value:3},{type:'button',label:'Next palette',on:()=>{pal=(pal+1)%4;paint()}}]});
const MAX=140,SEG=260,R=4.4,lines=[];
for(let i=0;i<MAX;i++){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array((SEG+1)*3),3));
 const l=new THREE.Line(g,new THREE.LineBasicMaterial({transparent:true,opacity:.34,blending:THREE.AdditiveBlending,depthWrite:false}));l.frustumCulled=false;lines.push(l);S.scene.add(l)}
function paint(){lines.forEach((l,i)=>{const k=i/MAX;PAL[pal]?l.material.color.setHSL((PAL[pal][i%4]+k*30)/360,.9,.62):l.material.color.setRGB(.82,.82,.88)})}paint();
S.run((dt,t)=>{const T=t*.4,N=v.n|0,A=v.a|0,tw=v.tw+S.mouse.x*1.5;
 for(let i=0;i<MAX;i++){const l=lines[i];l.visible=i<N;if(!l.visible)continue;const k=i/N,p=l.geometry.attributes.position.array;
  for(let j=0;j<=SEG;j++){const a=j/SEG*6.2832,e=.62+.38*Math.cos((A-1)*a-T*2+k*tw);
   p[j*3]=Math.sin(A*a+k*tw+T)*e*R*1.4;p[j*3+1]=Math.sin((A+1)*a-k*tw*.7-T*.8)*e*R*.8;p[j*3+2]=Math.cos((A+2)*a*.5+k*tw*.9+T*1.3)*e*R}
  l.geometry.attributes.position.needsUpdate=true}});
