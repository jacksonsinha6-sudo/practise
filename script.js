const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const seedBtn = document.getElementById('seed-btn');
const saveBtn = document.getElementById('save-btn');
const seedLabel = document.getElementById('seed-label');
const storyText = document.getElementById('story-text');
const traits = document.getElementById('traits');

const moods = ['luminous', 'melancholic', 'electric', 'calm', 'mythic'];
const biomes = ['floating reefs', 'crystal dunes', 'neon forests', 'mirror lakes', 'aurora valleys'];
const events = ['silent meteor rain', 'singing wind', 'fractal bloom', 'tidal pulse', 'clockwork dawn'];

function rngFactory(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function generateWorld(seed = Date.now()) {
  const rand = rngFactory(seed);
  seedLabel.textContent = `Seed: ${seed}`;

  const hueA = Math.floor(rand() * 360);
  const hueB = (hueA + 60 + Math.floor(rand() * 80)) % 360;

  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, `hsl(${hueA} 55% 22%)`);
  sky.addColorStop(0.65, `hsl(${hueB} 50% 14%)`);
  sky.addColorStop(1, '#05070f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 140; i += 1) {
    const x = rand() * canvas.width;
    const y = rand() * (canvas.height * 0.62);
    const r = rand() * 2.1;
    ctx.beginPath();
    ctx.fillStyle = `hsla(${hueA + rand() * 120}, 85%, 80%, ${0.35 + rand() * 0.6})`;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const layers = 5;
  for (let l = 0; l < layers; l += 1) {
    const baseY = canvas.height * (0.58 + l * 0.08);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x <= canvas.width; x += 24) {
      const y = baseY - rand() * (70 + l * 20);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fillStyle = `hsla(${hueB + l * 12}, 50%, ${12 + l * 5}%, 0.85)`;
    ctx.fill();
  }

  const constellation = Math.floor(4 + rand() * 5);
  ctx.strokeStyle = `hsla(${hueA + 120}, 70%, 74%, 0.35)`;
  ctx.lineWidth = 1;
  let prev;
  for (let i = 0; i < constellation; i += 1) {
    const node = { x: 120 + rand() * (canvas.width - 240), y: 70 + rand() * 200 };
    ctx.beginPath();
    ctx.fillStyle = '#dbeafe';
    ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
    ctx.fill();
    if (prev) {
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(node.x, node.y);
      ctx.stroke();
    }
    prev = node;
  }

  const mood = pick(rand, moods);
  const biome = pick(rand, biomes);
  const event = pick(rand, events);

  storyText.textContent = `In this ${mood} universe, civilizations migrated across ${biome} during a ${event}.`;
  traits.innerHTML = '';

  [
    `Sky palette shifts between ${hueA}° and ${hueB}° hues.`,
    `Constellation size: ${constellation} anchor stars.`,
    `Terrain profile generated from ${layers} stacked noise layers.`
  ].forEach((line) => {
    const li = document.createElement('li');
    li.textContent = line;
    traits.appendChild(li);
  });

  localStorage.setItem('quantum-garden-seed', String(seed));
}

seedBtn.addEventListener('click', () => generateWorld(Math.floor(Math.random() * 1_000_000_000)));
saveBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `quantum-garden-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

const savedSeed = Number(localStorage.getItem('quantum-garden-seed'));
generateWorld(Number.isFinite(savedSeed) && savedSeed > 0 ? savedSeed : Date.now());
