import{THREE,stage,hud}from '../../assets/js/core.js';
const S=stage({fov:55,pos:[0,.7,3.1],min:1.3,max:7,auto:.14,pr:.8});
const v=hud({title:'Fractal Explorer',accent:'#ffbf2e',hint:'A raymarched 3D Mandelbulb · drag to orbit · scroll to dive in',controls:[{id:'p',label:'Power',min:2,max:12,value:8,step:.05},{id:'g',label:'Glow',min:0,max:2,value:1}]});
const mat=new THREE.ShaderMaterial({uniforms:{uRes:{value:new THREE.Vector2()},uCam:{value:new THREE.Matrix4()},uPos:{value:new THREE.Vector3()},uTan:{value:1},uPower:{value:8},uGlow:{value:1}},
vertexShader:'void main(){gl_Position=vec4(position.xy,0.,1.);}',
fragmentShader:`precision highp float;
uniform vec2 uRes;uniform mat4 uCam;uniform vec3 uPos;uniform float uTan,uPower,uGlow;
float de(vec3 p,out float trap){vec3 z=p;float dr=1.,r=0.;trap=10.;
 for(int i=0;i<7;i++){r=length(z);if(r>2.)break;trap=min(trap,r);
  float th=acos(clamp(z.z/r,-1.,1.))*uPower,ph=atan(z.y,z.x)*uPower;
  dr=pow(r,uPower-1.)*uPower*dr+1.;float zr=pow(r,uPower);
  z=zr*vec3(sin(th)*cos(ph),sin(th)*sin(ph),cos(th))+p;}
 return .5*log(r)*r/dr;}
void main(){
 vec2 uv=(gl_FragCoord.xy*2.-uRes)/uRes.y;
 vec3 rd=normalize((uCam*vec4(uv*uTan,-1.,0.)).xyz),ro=uPos;
 float t=0.,tr=0.,d=0.,q;int st=0;bool hit=false;
 for(int i=0;i<110;i++){st=i;d=de(ro+rd*t,tr);if(d<.0006*t){hit=true;break;}t+=d;if(t>9.)break;}
 vec3 col=vec3(0.);
 if(hit){vec3 p=ro+rd*t;float e=.0012*t;
  vec3 n=normalize(vec3(de(p+vec3(e,0,0),q)-de(p-vec3(e,0,0),q),de(p+vec3(0,e,0),q)-de(p-vec3(0,e,0),q),de(p+vec3(0,0,e),q)-de(p-vec3(0,0,e),q)));
  vec3 L=normalize(vec3(.6,.8,.5));float dif=max(dot(n,L),0.),rim=pow(1.-max(dot(n,-rd),0.),3.);
  vec3 base=.5+.5*cos(6.283*(tr*1.3+vec3(0.,.12,.3))+vec3(.4,.2,.0));
  col=base*(.12+dif*.95)+rim*vec3(1.,.65,.25)*.55;}
 col+=vec3(1.,.5,.12)*pow(float(st)/110.,2.)*.9*uGlow;
 gl_FragColor=vec4(pow(col,vec3(.85)),1.);}`});
const quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat);quad.frustumCulled=false;S.scene.add(quad);
S.run(()=>{const u=mat.uniforms;S.renderer.getDrawingBufferSize(u.uRes.value);u.uCam.value.copy(S.camera.matrixWorld);u.uPos.value.copy(S.camera.position);
 u.uTan.value=Math.tan(S.camera.fov*Math.PI/360);u.uPower.value=v.p;u.uGlow.value=v.g});
