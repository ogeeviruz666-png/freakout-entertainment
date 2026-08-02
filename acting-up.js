const audio = document.getElementById('audio');
const playButton = document.getElementById('playButton');
const label = playButton.querySelector('.button-label');
const seekBar = document.getElementById('seekBar');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

audio.addEventListener('loadedmetadata', () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  currentTime.textContent = formatTime(audio.currentTime);
  seekBar.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
});

audio.addEventListener('ended', () => {
  playButton.classList.remove('playing');
  label.textContent = 'PLAY';
});

playButton.addEventListener('click', async () => {
  try {
    if (audio.paused) {
      await audio.play();
      playButton.classList.add('playing');
      label.textContent = 'PAUSE';
    } else {
      audio.pause();
      playButton.classList.remove('playing');
      label.textContent = 'PLAY';
    }
  } catch (error) {
    console.error('Audio playback failed:', error);
  }
});

seekBar.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  }
});

// Gold particle animation
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function makeParticle() {
  return {
    x: Math.random() * innerWidth,
    y: innerHeight + Math.random() * 160,
    r: Math.random() * 2.1 + .5,
    vy: Math.random() * .75 + .25,
    vx: (Math.random() - .5) * .3,
    a: Math.random() * .65 + .15
  };
}
function initParticles() {
  particles = Array.from({length: Math.min(90, Math.floor(innerWidth / 14))}, makeParticle);
}
function animateParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of particles) {
    p.y -= p.vy;
    p.x += p.vx;
    if (p.y < -20) Object.assign(p, makeParticle(), {y: innerHeight + 20});
    const glow = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
    glow.addColorStop(0, `rgba(245,215,130,${p.a})`);
    glow.addColorStop(1, 'rgba(216,173,70,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r*5,0,Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(animateParticles);
}
resize();
initParticles();
animateParticles();
addEventListener('resize', () => { resize(); initParticles(); });
