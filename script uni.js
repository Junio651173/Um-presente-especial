// Seletores principais
const scene = document.querySelector(".scene");
const sky = document.querySelector(".sky");
const sats1 = document.querySelectorAll(".orbit1 .satellite");
const sats2 = document.querySelectorAll(".orbit2 .satellite");
const sats3 = document.querySelectorAll(".orbit3 .satellite");

// ângulos e controle de rotação
let rotX = -20, rotY = 0;
let dragging = false, pointerId = null, last = {x:0, y:0};

// ângulos de órbitas
let angle1 = Math.random() * 360;
let angle2 = Math.random() * 360;
let angle3 = Math.random() * 360;

// zoom real 3D (translateZ)
let zoomZ = -200; // posição inicial (negativo = mais distante)

// configura perspectiva da câmera fixa
sky.style.perspective = "1000px";

// função para aplicar transformações
function updateSceneTransform() {
  scene.style.transform = `translateZ(${zoomZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

// raios e velocidades das órbitas
const radius1 = 180;
const radius2 = 280;
const radius3 = 380;

const baseAngles1 = Array.from(sats1, (_, i) => i * (360 / sats1.length));
const baseAngles2 = Array.from(sats2, (_, i) => i * (360 / sats2.length));
const baseAngles3 = Array.from(sats3, (_, i) => i * (360 / sats3.length));

const speed1 = 0.6;
const speed2 = 0.15;
const speed3 = 0.25;

const offset1 = Math.random() * 360;
const offset2 = Math.random() * 360;
const offset3 = Math.random() * 360;

// posicionamento das órbitas
function updateSatellites() {
  sats1.forEach((sat, i) => {
    const a = (baseAngles1[i] + angle1 + offset1) * Math.PI / 180;
    const x = Math.cos(a) * radius1;
    const z = Math.sin(a) * radius1;
    sat.style.transform = `translate3d(${x}px, 0, ${z}px)`;
  });

  sats2.forEach((sat, i) => {
    const a = (baseAngles2[i] + angle2 + offset2) * Math.PI / 180;
    const x = Math.cos(a) * radius2;
    const z = Math.sin(a) * radius2;
    sat.style.transform = `translate3d(${x}px, 0, ${z}px)`;
  });

  sats3.forEach((sat, i) => {
    const a = (baseAngles3[i] + angle3 + offset3) * Math.PI / 180;
    const x = Math.cos(a) * radius3;
    const z = Math.sin(a) * radius3;
    sat.style.transform = `translate3d(${x}px, 0, ${z}px)`;
  });
}

// animação contínua
function animate() {
  angle1 += speed1;
  angle2 += speed2;
  angle3 += speed3;
  updateSatellites();
  updateSceneTransform();
  requestAnimationFrame(animate);
}
animate();

/* === Interação por Pointer Events (funciona mouse + toque) === */
scene.addEventListener("pointerdown", (ev) => {
  dragging = true;
  pointerId = ev.pointerId;
  scene.setPointerCapture(pointerId);
  last.x = ev.clientX; last.y = ev.clientY;
});

scene.addEventListener("pointermove", (ev) => {
  if (!dragging || ev.pointerId !== pointerId) return;
  const dx = ev.clientX - last.x;
  const dy = ev.clientY - last.y;
  const sens = 0.3;
  rotY += dx * sens;
  rotX -= dy * sens;
  rotX = Math.max(-90, Math.min(90, rotX)); // trava inclinação
  last.x = ev.clientX; last.y = ev.clientY;
  updateSceneTransform();
});

scene.addEventListener("pointerup", (ev) => {
  if (ev.pointerId === pointerId) {
    dragging = false;
    try { scene.releasePointerCapture(pointerId); } catch(e){}
    pointerId = null;
  }
});

scene.addEventListener("pointercancel", () => {
  dragging = false;
  pointerId = null;
});

/* === Zoom 3D real (PC + celular) === */

// Scroll no computador
window.addEventListener("wheel", (e) => {
  e.preventDefault();
  zoomZ += e.deltaY * 3;
  if (zoomZ > 800) zoomZ = 800; // evita atravessar o planeta
  updateSceneTransform();
}, { passive: false });

// Pinça no celular
let touchDist = 0;

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    touchDist = Math.hypot(dx, dy);
  }
}, { passive: false });

window.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const newDist = Math.hypot(dx, dy);
    const delta = newDist - touchDist;
    zoomZ += delta * 2.5; // sensibilidade do zoom via pinça
    if (zoomZ > 800) zoomZ = 800;
    updateSceneTransform();
    touchDist = newDist;
  }
}, { passive: false });

/* === Estrelas coloridas aleatórias === */
function createColoredStars(count = 80) {
  const colors = ["#9fe8ff","#ffd97a","#ffb3e6","#bfe0a8","#c9d4ff"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "cstar";
    const size = Math.random() * 2.5 + 0.8;
    el.style.width = el.style.height = `${size}px`;
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = (Math.random() * 6 + 3).toFixed(2) + "s";
    el.style.animationDelay = (Math.random() * -8).toFixed(2) + "s";
    el.style.opacity = (Math.random() * 0.7 + 0.25).toFixed(2);
    el.style.transform = "translate(-50%,-50%)";
    sky.appendChild(el);
  }
}
createColoredStars(100);
