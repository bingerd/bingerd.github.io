/* Live loss landscape: a contoured surface with three optimizers
   (SGD, Momentum, Adam) racing to the minimum from the same start.
   Classic script (not a module) so it also works when the site is opened
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
const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (_e) {
  canvas.style.display = 'none';
  return;
}
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmall = () => window.innerWidth < 768;

/* ---------- The loss function (shared by GPU surface and CPU optimizers) ---------- */
const SIZE = 12;               // surface spans [-6, 6] on x and z
const H_SCALE = 0.85;          // world height per unit of loss
let drift = 0;                 // slow phase drift so the landscape breathes
let chaos = 0;                 // 0 = calm, 1 = chaos mode

function loss(x, z) {
  const a = 1 + chaos * 2.5;
  return 0.045 * (x * x + z * z)
    + 0.55 * a * Math.sin(0.85 * x + 0.4 + drift) * Math.cos(0.75 * z - 0.3)
    + 0.28 * a * Math.sin(1.6 * x - 1.1 * z + drift * 0.7)
    - 0.9 * Math.exp(-((x - 1.4) ** 2 + (z + 1.2) ** 2) / 2.2);
}
const LOSS_GLSL = `
  uniform float drift;
  uniform float chaos;
  float lossAt(vec2 p){
    float a = 1.0 + chaos * 2.5;
    return 0.045 * dot(p, p)
      + 0.55 * a * sin(0.85 * p.x + 0.4 + drift) * cos(0.75 * p.y - 0.3)
      + 0.28 * a * sin(1.6 * p.x - 1.1 * p.y + drift * 0.7)
      - 0.9 * exp(-(pow(p.x - 1.4, 2.0) + pow(p.y + 1.2, 2.0)) / 2.2);
  }
`;
function grad(x, z) {
  const e = 1e-3;
  return [
    (loss(x + e, z) - loss(x - e, z)) / (2 * e),
    (loss(x, z + e) - loss(x, z - e)) / (2 * e)
  ];
}

/* ---------- Surface ---------- */
const group = new THREE.Group();
scene.add(group);

const segs = isSmall() ? 110 : 200;
const geometry = new THREE.PlaneGeometry(SIZE, SIZE, segs, segs);
geometry.rotateX(-Math.PI / 2);

const uniforms = {
  drift: { value: 0 },
  chaos: { value: 0 },
  hue: { value: 0 },
  lineColor: { value: new THREE.Color() },
  lowColor: { value: new THREE.Color() },
  highColor: { value: new THREE.Color() },
  strength: { value: 1 }
};

const surface = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
  uniforms,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  vertexShader: `
    ${LOSS_GLSL}
    varying float vLoss;
    varying vec2 vXZ;
    void main(){
      vec3 p = position;
      vLoss = lossAt(p.xz);
      p.y = vLoss * ${H_SCALE.toFixed(3)};
      vXZ = p.xz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 lineColor;
    uniform vec3 lowColor;
    uniform vec3 highColor;
    uniform float strength;
    uniform float chaos;
    uniform float hue;
    varying float vLoss;
    varying vec2 vXZ;

    vec3 hsv(float h){ return clamp(abs(mod(h*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0); }

    void main(){
      // contour lines: iso-loss rings, crisp at any zoom
      float k = vLoss * 6.0;
      float w = fwidth(k);
      float contour = clamp(1.0 - smoothstep(0.0, 1.2 * w, min(fract(k), 1.0 - fract(k))), 0.0, 1.0);

      // faint grid for the "graph paper" feel
      vec2 g = vXZ * 2.0;
      vec2 gw = fwidth(g);
      vec2 gl = 1.0 - smoothstep(vec2(0.0), gw * 1.2, min(fract(g), 1.0 - fract(g)));
      float grid = max(gl.x, gl.y) * 0.18;

      float t = clamp((vLoss + 0.9) / 3.2, 0.0, 1.0);
      vec3 col = mix(lowColor, highColor, t);
      col = mix(col, hsv(fract(hue + t * 0.6)), chaos);

      // fade toward the edges of the surface
      float r = length(vXZ) / 6.0;
      float edge = 1.0 - smoothstep(0.55, 1.0, r);

      // low basins glow a little
      float basin = (1.0 - t) * 0.10;

      float a = (contour * 0.55 + grid + basin) * edge * strength;
      gl_FragColor = vec4(mix(col, lineColor, grid * 0.5), a);
    }
  `
}));
group.add(surface);

/* ---------- Optimizers ---------- */
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.18, 'rgba(255,255,255,0.9)');
  grd.addColorStop(0.45, 'rgba(255,255,255,0.25)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const glow = makeGlowTexture();
const TRAIL = 260;

const optimizers = [
  { name: 'sgd',  cssVar: '--accent',
    step(o, g) { o.x -= 0.045 * g[0]; o.z -= 0.045 * g[1]; } },
  { name: 'mom',  cssVar: '--accent-2',
    step(o, g) {
      o.vx = 0.9 * o.vx + g[0]; o.vz = 0.9 * o.vz + g[1];
      o.x -= 0.011 * o.vx; o.z -= 0.011 * o.vz;
    } },
  { name: 'adam', cssVar: '--accent-3',
    step(o, g) {
      const b1 = 0.9, b2 = 0.999, lr = 0.03, eps = 1e-8;
      o.t++;
      o.mx = b1 * o.mx + (1 - b1) * g[0]; o.mz = b1 * o.mz + (1 - b1) * g[1];
      o.sx = b2 * o.sx + (1 - b2) * g[0] * g[0]; o.sz = b2 * o.sz + (1 - b2) * g[1] * g[1];
      const c1 = 1 - Math.pow(b1, o.t), c2 = 1 - Math.pow(b2, o.t);
      o.x -= lr * (o.mx / c1) / (Math.sqrt(o.sx / c2) + eps);
      o.z -= lr * (o.mz / c1) / (Math.sqrt(o.sz / c2) + eps);
    } }
];

optimizers.forEach((o) => {
  o.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glow, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending
  }));
  o.sprite.scale.setScalar(0.55);
  group.add(o.sprite);

  o.trailPos = new Float32Array(TRAIL * 3);
  const tg = new THREE.BufferGeometry();
  tg.setAttribute('position', new THREE.BufferAttribute(o.trailPos, 3));
  tg.setDrawRange(0, 0);
  o.trail = new THREE.Line(tg, new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9, depthTest: false }));
  group.add(o.trail);
});

let settled = 0;
let totalSteps = 0;

function respawn() {
  // A fair race: everyone starts from the same high point on the rim.
  const ang = Math.random() * Math.PI * 2;
  const rad = 3.6 + Math.random() * 1.2;
  const sx = Math.cos(ang) * rad, sz = Math.sin(ang) * rad;
  optimizers.forEach((o) => {
    Object.assign(o, { x: sx, z: sz, vx: 0, vz: 0, mx: 0, mz: 0, sx: 0, sz: 0, t: 0, n: 0 });
    o.trail.geometry.setDrawRange(0, 0);
  });
  settled = 0;
  totalSteps = 0;
}

function pushTrail(o) {
  const y = loss(o.x, o.z) * H_SCALE + 0.04;
  if (o.n < TRAIL) {
    o.n++;
  } else {
    o.trailPos.copyWithin(0, 3);
  }
  const i = (o.n - 1) * 3;
  o.trailPos[i] = o.x; o.trailPos[i + 1] = y; o.trailPos[i + 2] = o.z;
  o.trail.geometry.attributes.position.needsUpdate = true;
  o.trail.geometry.setDrawRange(0, o.n);
  o.sprite.position.set(o.x, y + 0.02, o.z);
}

function stepAll(noRespawn) {
  let maxG = 0;
  optimizers.forEach((o) => {
    const g = grad(o.x, o.z);
    const lrBoost = 1 + chaos * 5;         // chaos mode: learning rate goes brrr
    o.step(o, [g[0] * lrBoost, g[1] * lrBoost]);
    if (!isFinite(o.x) || Math.abs(o.x) > 6.5 || Math.abs(o.z) > 6.5) {
      o.x = Math.max(-6, Math.min(6, o.x || 0));
      o.z = Math.max(-6, Math.min(6, o.z || 0));
      o.vx = o.vz = 0;
    }
    maxG = Math.max(maxG, Math.hypot(g[0], g[1]), Math.hypot(o.vx || 0, o.vz || 0) * 0.1);
    pushTrail(o);
  });
  totalSteps++;
  settled = maxG < 0.03 ? settled + 1 : 0;
  if (!noRespawn && (settled > 90 || totalSteps > 900)) respawn();
}

/* ---------- Colors from CSS tokens ---------- */
function cssColor(name, fallback) {
  const v = window.getComputedStyle(document.body).getPropertyValue(name).trim();
  try { return new THREE.Color(v || fallback); } catch (_e) { return new THREE.Color(fallback); }
}
function applyThemeColors(theme) {
  const light = theme === 'light';
  uniforms.lowColor.value.copy(cssColor('--accent', '#c4a1ff'));
  uniforms.highColor.value.copy(cssColor('--accent-2', '#ff9469'));
  uniforms.lineColor.value.copy(cssColor('--fg', light ? '#1a1611' : '#f2ede4'));
  uniforms.strength.value = light ? 1.25 : 1.0;
  optimizers.forEach((o) => {
    const c = cssColor(o.cssVar, '#ffffff');
    o.sprite.material.color.copy(c);
    o.trail.material.color.copy(c);
    // Additive glow disappears on paper; use normal blending in light mode.
    o.sprite.material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    o.sprite.material.needsUpdate = true;
  });
}

/* ---------- Camera, layout, input ---------- */
let scrollY = window.scrollY;
let mouseX = 0, mouseY = 0;

function layout() {
  const small = isSmall();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Desktop: landscape sits right of the headline; mobile: behind it, further away.
  group.position.set(small ? 0 : 3.6, small ? -1.2 : -0.9, 0);
}
function updateCamera() {
  const small = isSmall();
  const s = Math.min(scrollY / window.innerHeight, 2);
  const dist = small ? 15 : 12.5;
  camera.position.set(mouseX * 0.6, (small ? 8.5 : 6.8) + s * 2.2 - mouseY * 0.4, dist - s * 1.5);
  camera.lookAt(small ? 0 : 1.6, -0.8 - s * 1.2, 0);
  // Fade the figure as the reader moves into the content.
  canvas.style.opacity = String(Math.max(0.28, 1 - s * 0.72));
}

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

/* ---------- Loop ---------- */
let rafId = null;
let last = 0;
let acc = 0;
const STEP_MS = 1000 / 30;

function frame(t) {
  const dt = Math.min(t - (last || t), 100);
  last = t;
  drift += dt * 0.00006 * (1 + chaos * 20);
  uniforms.drift.value = drift;
  uniforms.chaos.value = chaos;
  if (chaos) uniforms.hue.value = (t * 0.0002) % 1;

  acc += dt;
  while (acc >= STEP_MS) { stepAll(); acc -= STEP_MS; }

  group.rotation.y += 0.0006 * (1 + chaos * 30);
  updateCamera();
  renderer.render(scene, camera);
  rafId = requestAnimationFrame(frame);
}

function start() {
  if (rafId !== null || prefersReducedMotion) return;
  last = 0;
  rafId = requestAnimationFrame(frame);
}
function stop() {
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
}
function renderOnce() { updateCamera(); renderer.render(scene, camera); }

layout();
applyThemeColors(document.body.dataset.theme);
respawn();

if (prefersReducedMotion) {
  // A still figure: show where each optimizer got after 180 steps.
  for (let i = 0; i < 180; i++) stepAll(true); // mid-race snapshot
  group.rotation.y = 0.35;
  renderOnce();
} else {
  start();
}

// Don't burn GPU while the tab is hidden.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stop(); else start();
});

window.addEventListener('resize', () => {
  layout();
  if (prefersReducedMotion) renderOnce();
});

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  if (prefersReducedMotion) renderOnce();
}, { passive: true });

window.togglePerf = () => {
  chaos = chaos ? 0 : 1;
  if (!chaos) { applyThemeColors(document.body.dataset.theme); respawn(); }
  if (prefersReducedMotion) renderOnce();
};

document.addEventListener('themechange', (e) => {
  applyThemeColors(e.detail.theme);
  if (prefersReducedMotion) renderOnce();
});

})();
