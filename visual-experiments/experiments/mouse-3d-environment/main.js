import{THREE,stage,hud,dot}from '../../assets/js/core.js';
const S=stage({fov:50,pos:[0,1.5,11],min:5,max:24,auto:0});
const v=hud({title:'Mouse 3D Environment',accent:'#3fa9ff',hint:'Move to tilt the cube · hold to overcharge · click for a shockwave · drag to orbit',controls:[{id:'e',label:'Energy',min:.3,max:2.5,value:1.2},{id:'s',label:'Spin',min:0,max:2,value:.5}]});
const BLUE=0x3fa9ff,ICE=0x9be7ff,add=THREE.AdditiveBlending;
const rig=new THREE.Group();S.scene.add(rig);
// glowing faces: bright frame, stepped inner panel, fresnel rim
const faceMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:add,uniforms:{uT:{value:0},uE:{value:1}},
vertexShader:`varying vec2 vUv;varying vec3 vN,vV;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}`,
fragmentShader:`uniform float uT,uE;varying vec2 vUv;varying vec3 vN,vV;
void main(){vec2 c=abs(vUv-.5)*2.;float m=max(c.x,c.y);
 float frame=smoothstep(.84,.88,m)*(1.-smoothstep(.97,1.,m));
 float step1=smoothstep(.56,.58,m)*(1.-smoothstep(.62,.64,m));
 float fres=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.);
 float flow=.5+.5*sin((vUv.x-vUv.y)*10.-uT*2.5);
 float glow=(1.-smoothstep(0.,.55,m))*(.25+.2*flow);
 float a=frame*.95+step1*.55+fres*.3+glow;
 vec3 col=mix(vec3(.15,.55,1.),vec3(.75,.95,1.),frame*.7+glow*.5);
 gl_FragColor=vec4(col*a*uE,clamp(a*.8,0.,1.));}`});
const S1=3.2,cube=new THREE.Mesh(new THREE.BoxGeometry(S1,S1,S1),faceMat);rig.add(cube);
function edges(size,col,op){const l=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(size,size,size)),new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op,blending:add,depthWrite:false}));return l}
const outer=[edges(S1,ICE,1),edges(S1*1.012,BLUE,.7),edges(S1*1.03,BLUE,.35)];outer.forEach(l=>rig.add(l));
const inner=[edges(2.1,BLUE,.8),edges(1.3,ICE,.9)];inner.forEach(l=>rig.add(l));
// energy core
const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.34,1),new THREE.MeshBasicMaterial({color:0xffffff}));rig.add(core);
const tex=dot(),halo=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:ICE,blending:add,depthWrite:false})),aura=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color:BLUE,blending:add,depthWrite:false,opacity:.55}));
rig.add(halo,aura);
// beams from core to the 8 corners
const h=S1/2,cp=[];for(const x of[-h,h])for(const y of[-h,h])for(const z of[-h,h])cp.push(0,0,0,x,y,z);
const beams=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(cp,3)),new THREE.LineBasicMaterial({color:BLUE,transparent:true,opacity:.35,blending:add,depthWrite:false}));rig.add(beams);
// sparks drifting out of the cube
const N=2600,P=new Float32Array(N*3),V=new Float32Array(N*3);
function spark(i){const u=Math.random()*6.283,w=Math.acos(2*Math.random()-1),r=2.2+Math.random()*.8,d=[Math.sin(w)*Math.cos(u),Math.cos(w),Math.sin(w)*Math.sin(u)],sp=.2+Math.random()*.9;for(let k=0;k<3;k++){P[i*3+k]=d[k]*r;V[i*3+k]=d[k]*sp}}
for(let i=0;i<N;i++){spark(i);for(let k=0;k<3;k++)P[i*3+k]*=1+Math.random()*3}
const sg=new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(P,3));
S.scene.add(new THREE.Points(sg,new THREE.PointsMaterial({size:.09,map:tex,color:ICE,transparent:true,opacity:.8,depthWrite:false,blending:add})));
const light=new THREE.PointLight(BLUE,60,0,2);S.scene.add(light);
// click shockwaves and hold-to-overcharge
const rings=[];let charge=0,held=false;
addEventListener('pointerdown',()=>held=true);addEventListener('pointerup',()=>held=false);
S.onclick=()=>{const r=new THREE.Mesh(new THREE.RingGeometry(.97,1,96),new THREE.MeshBasicMaterial({color:ICE,transparent:true,blending:add,depthWrite:false,side:THREE.DoubleSide}));r.userData.a=0;r.lookAt(S.camera.position);S.scene.add(r);rings.push(r)};
S.run((dt,t)=>{
 charge+=((held?1:0)-charge)*Math.min(1,dt*4);
 const E=v.e*(1+charge*1.4),pulse=.85+.15*Math.sin(t*3)+.1*Math.sin(t*9.1);
 faceMat.uniforms.uT.value=t;faceMat.uniforms.uE.value=E*(.85+.15*pulse);
 // tilt toward the mouse while spinning on its own
 rig.rotation.x+=((-S.mouse.y*.7+Math.sin(t*.4)*.15)-rig.rotation.x)*Math.min(1,dt*3);
 rig.rotation.y+=dt*v.s*(1+charge*2);rig.rotation.y+=(S.mouse.x*.02);
 rig.position.y=Math.sin(t*1.1)*.12;
 inner[0].rotation.set(t*.6,-t*.8,t*.3);inner[1].rotation.set(-t*.9,t*.7,t*.5);
 core.rotation.set(t,t*1.3,0);core.scale.setScalar(1+charge*.6+.12*Math.sin(t*5));
 halo.scale.setScalar((2.6+charge*2)*pulse*E*.8);aura.scale.setScalar((9+charge*5)*(.9+.1*pulse)*Math.min(E,1.6));
 beams.material.opacity=Math.min(1,.25*E+charge*.5);light.intensity=60*E*pulse;
 for(const l of outer)l.material.opacity=Math.min(1,l.material.opacity*0+(l===outer[0]?1:l===outer[1]?.7:.35)*(.6+.4*E/1.2));
 const sp=1+charge*3;
 for(let i=0;i<N;i++){const k=i*3;P[k]+=V[k]*dt*sp;P[k+1]+=V[k+1]*dt*sp;P[k+2]+=V[k+2]*dt*sp;if(P[k]*P[k]+P[k+1]*P[k+1]+P[k+2]*P[k+2]>110)spark(i)}
 sg.attributes.position.needsUpdate=true;
 for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.userData.a+=dt;const k=r.userData.a/1.4;r.scale.setScalar(1+k*14);r.material.opacity=Math.max(0,1-k)*.9;if(k>=1){S.scene.remove(r);r.geometry.dispose();r.material.dispose();rings.splice(i,1)}}
});
