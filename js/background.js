/* Classic script (not a module) so it also works when the site is opened
   via file:// — local module files are blocked by CORS, but dynamic
   import() of an https URL is allowed. */
(async () => {

let THREE;
try {
  THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
} catch (_e) {
  const bg = document.getElementById('bg');
  if (bg) bg.style.display = 'none';
  return;
}

const canvas = document.getElementById('bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

const detail = window.innerWidth < 768 ? 32 : 64;
const geometry = new THREE.IcosahedronGeometry(1.6, detail);
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

// Mouse-reactive parallax
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Single animation loop; started/stopped via start()/stop() so toggles
// and visibility changes never spawn a second concurrent loop.
let rafId = null;

function frame(t){
  material.uniforms.time.value = t*0.001;
  if(perfMode){
    mesh.rotation.x += 0.2 + Math.sin(t*0.01)*0.1;
    mesh.rotation.y += 0.3 + Math.cos(t*0.01)*0.1;
    material.uniforms.colorA.value.setHSL(Math.sin(t*0.005)*0.5+0.5,1.0,0.5);
    material.uniforms.colorB.value.setHSL(Math.cos(t*0.005)*0.5+0.5,1.0,0.5);
    camera.position.x = Math.sin(t*0.01)*0.2;
    camera.position.y = Math.cos(t*0.008)*0.2;
  } else {
    mesh.rotation.y += 0.0015;
    // Subtle mouse parallax
    mesh.rotation.x += (mouseY * 0.3 - mesh.rotation.x) * 0.02;
    mesh.rotation.y += (mouseX * 0.3 - mesh.rotation.y) * 0.02;
    camera.position.x = 0;
    camera.position.y = 0;
  }
  renderer.render(scene,camera);
  rafId = requestAnimationFrame(frame);
}

function start(){
  if (rafId !== null || prefersReducedMotion) return;
  rafId = requestAnimationFrame(frame);
}
function stop(){
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
}
function renderOnce(){ renderer.render(scene, camera); }

start();
if (prefersReducedMotion) renderOnce();

// Don't burn GPU while the tab is hidden.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop(); else start();
});

window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
  if (prefersReducedMotion) renderOnce();
});

window.addEventListener('scroll',()=>{
  camera.position.z = 6 + window.scrollY*0.002;
  if (prefersReducedMotion) renderOnce();
});

window.togglePerf = ()=> {
  perfMode = !perfMode;
  if (!perfMode) applyThemeColors(document.body.dataset.theme);
  if (prefersReducedMotion) renderOnce();
};

function applyThemeColors(theme){
  if (theme === 'light') {
    material.uniforms.colorA.value.set(0.15,0.15,0.15);
    material.uniforms.colorB.value.set(0.9,0.9,0.9);
  } else {
    material.uniforms.colorA.value.set(0.9,0.6,1.0);
    material.uniforms.colorB.value.set(0.15,0.15,0.15);
  }
}

applyThemeColors(document.body.dataset.theme);
if (prefersReducedMotion) renderOnce();

document.addEventListener('themechange', (e) => {
  applyThemeColors(e.detail.theme);
  if (prefersReducedMotion) renderOnce();
});

})();
