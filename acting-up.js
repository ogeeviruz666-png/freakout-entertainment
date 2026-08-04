document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('audio');
  const playButton = document.getElementById('playButton');
  const label = playButton?.querySelector('.button-label');
  const seekBar = document.getElementById('seekBar');
  const currentTime = document.getElementById('currentTime');
  const duration = document.getElementById('duration');
  const status = document.getElementById('audioStatus');

  if (!audio || !playButton || !label || !seekBar || !currentTime || !duration) {
    console.error('Required audio-player elements were not found.');
    return;
  }

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  audio.load();

  audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration);
    setStatus('Audio ready');
  });

  audio.addEventListener('canplay', () => setStatus('Audio ready'));

  audio.addEventListener('waiting', () => setStatus('Loading audio…'));

  audio.addEventListener('playing', () => {
    playButton.classList.add('playing');
    label.textContent = 'PAUSE';
    setStatus('Now playing');
  });

  audio.addEventListener('pause', () => {
    if (!audio.ended) {
      playButton.classList.remove('playing');
      label.textContent = 'PLAY';
      setStatus('Paused');
    }
  });

  audio.addEventListener('timeupdate', () => {
    currentTime.textContent = formatTime(audio.currentTime);
    seekBar.value = audio.duration ? String((audio.currentTime / audio.duration) * 100) : '0';
  });

  audio.addEventListener('ended', () => {
    playButton.classList.remove('playing');
    label.textContent = 'PLAY';
    seekBar.value = '0';
    setStatus('Track finished');
  });

  audio.addEventListener('error', () => {
    const code = audio.error?.code;
    const messages = {
      1: 'Playback was stopped.',
      2: 'The MP3 could not be downloaded.',
      3: 'The MP3 could not be decoded.',
      4: 'The MP3 file or format was not found.'
    };
    setStatus(messages[code] || 'Audio could not be loaded.');
    console.error('Audio error:', audio.error);
  });

  playButton.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        setStatus('Starting audio…');
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      setStatus('Tap Play again, or refresh the page.');
      console.error('Audio playback failed:', error);
    }
  });

  seekBar.addEventListener('input', () => {
    if (audio.duration) {
      audio.currentTime = (Number(seekBar.value) / 100) * audio.duration;
    }
  });

  // Gold particle animation.
  const canvas = document.getElementById('particles');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

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
      r: Math.random() * 2.1 + 0.5,
      vy: Math.random() * 0.75 + 0.25,
      vx: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.65 + 0.15
    };
  }

  function initParticles() {
    particles = Array.from(
      { length: Math.min(90, Math.floor(innerWidth / 14)) },
      makeParticle
    );
  }

  function animateParticles() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of particles) {
      p.y -= p.vy;
      p.x += p.vx;
      if (p.y < -20) Object.assign(p, makeParticle(), { y: innerHeight + 20 });

      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      glow.addColorStop(0, `rgba(245,215,130,${p.a})`);
      glow.addColorStop(1, 'rgba(216,173,70,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(animateParticles);
  }

  resize();
  initParticles();
  animateParticles();
  addEventListener('resize', () => {
    resize();
    initParticles();
  });
});
