import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

const geometry = new THREE.IcosahedronGeometry(1.6, 64);
const material = new THREE.ShaderMaterial({
  uniforms:{
    time:{ value:0 },
    colorA:{ value:new THREE.Color(0.9,0.6,1.0) },
    colorB:{ value:new THREE.Color(0.15,0.15,0.15) }
  },
  vertexShader:`
    uniform float time;
    varying vec3 vNormal;
    void main(){
      vNormal = normal;
      vec3 pos = position + normal * sin(time + position.y * 6.0) * 0.12;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
    }
  `,
  fragmentShader:`
    uniform vec3 colorA;
    uniform vec3 colorB;
    varying vec3 vNormal;
    void main(){
      float i = pow(0.55 - dot(vNormal,vec3(0.0,0.0,1.0)),2.0);
      vec3 color = mix(colorB,colorA,i);
      gl_FragColor = vec4(color,1.0);
    }
  `,
  wireframe:true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

let perfMode = false;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animate(t){
  material.uniforms.time.value = t*0.001;
  if(prefersReducedMotion){
    renderer.render(scene, camera);
    return;
  }
  if(perfMode){
    mesh.rotation.x += 0.2 + Math.sin(t*0.01)*0.1;
    mesh.rotation.y += 0.3 + Math.cos(t*0.01)*0.1;
    material.uniforms.colorA.value.setHSL(Math.sin(t*0.005)*0.5+0.5,1.0,0.5);
    material.uniforms.colorB.value.setHSL(Math.cos(t*0.005)*0.5+0.5,1.0,0.5);
    camera.position.x = Math.sin(t*0.01)*0.2;
    camera.position.y = Math.cos(t*0.008)*0.2;
  } else {
    mesh.rotation.y += 0.0015;
    camera.position.x = 0;
    camera.position.y = 0;
  }
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
animate(0);

window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
});

window.addEventListener('scroll',()=>{ camera.position.z = 6 + window.scrollY*0.002; });

window.togglePerf = ()=> {
  perfMode = !perfMode;
  if (prefersReducedMotion) return;
  if (perfMode) requestAnimationFrame(animate);
};

window.toggleTheme = ()=>{
  const dark = document.body.dataset.theme==='dark';
  document.body.dataset.theme = dark?'light':'dark';
  if(dark){
    material.uniforms.colorA.value.set(0.15,0.15,0.15);
    material.uniforms.colorB.value.set(0.9,0.9,0.9);
  } else {
    material.uniforms.colorA.value.set(0.9,0.6,1.0);
    material.uniforms.colorB.value.set(0.15,0.15,0.15);
  }
};
