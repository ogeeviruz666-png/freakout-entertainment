document.addEventListener('DOMContentLoaded', () => {
  const songs = window.OGF_SONGS || [];

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[char]);
  }

  function getSongId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('song') || 'acting-up';
  }

  function findSong(id) {
    return songs.find(song => song.id === id) || songs[0];
  }

  const vault = document.querySelector('[data-song-vault]');
  if (vault) {
    const search = document.querySelector('[data-song-search]');
    const filter = document.querySelector('[data-song-filter]');

    function renderVault() {
      const query = (search?.value || '').trim().toLowerCase();
      const category = filter?.value || 'all';

      const visible = songs.filter(song => {
        const matchesText = [song.title, song.artist, song.collection, song.genre]
          .join(' ')
          .toLowerCase()
          .includes(query);
        const matchesCategory = category === 'all' || song.collection === category;
        return matchesText && matchesCategory;
      });

      vault.innerHTML = visible.map(song => `
        <article class="vault-card reveal visible">
          <a href="song.html?song=${encodeURIComponent(song.id)}" class="vault-art">
            <img src="${escapeHtml(song.cover)}" alt="${escapeHtml(song.title)} cover art">
            <span class="vault-play">▶</span>
          </a>
          <div class="vault-meta">
            <p class="kicker">${escapeHtml(song.collection)}</p>
            <h3>${escapeHtml(song.title)}</h3>
            <p>${escapeHtml(song.artist)} • ${escapeHtml(song.runtime)}</p>
            <a class="text-link" href="song.html?song=${encodeURIComponent(song.id)}">Enter song experience →</a>
          </div>
        </article>
      `).join('') || '<p class="vault-empty">No songs match your search.</p>';
    }

    search?.addEventListener('input', renderVault);
    filter?.addEventListener('change', renderVault);
    renderVault();
  }

  const songRoot = document.querySelector('[data-song-page]');
  if (!songRoot || !songs.length) return;

  const song = findSong(getSongId());
  document.title = `${song.title} | ${song.artist}`;

  const hero = document.querySelector('[data-song-hero]');
  if (hero) {
    hero.style.setProperty('--song-cover', `url("${song.cover}")`);
  }

  document.querySelectorAll('[data-song-title]').forEach(el => el.textContent = song.title);
  document.querySelectorAll('[data-song-artist]').forEach(el => el.textContent = song.artist);
  document.querySelectorAll('[data-song-tagline]').forEach(el => el.textContent = song.tagline);
  document.querySelectorAll('[data-song-runtime]').forEach(el => el.textContent = song.runtime);
  document.querySelectorAll('[data-song-genre]').forEach(el => el.textContent = song.genre);
  document.querySelectorAll('[data-song-story]').forEach(el => el.textContent = song.story);

  const audio = document.querySelector('[data-song-audio]');
  if (audio) {
    audio.src = song.audio;
    audio.load();
  }

  const cover = document.querySelector('[data-song-cover]');
  if (cover) {
    cover.src = song.cover;
    cover.alt = `${song.title} cover art`;
  }

  const lyrics = document.querySelector('[data-song-lyrics]');
  if (lyrics) {
    lyrics.innerHTML = song.lyrics.map(block => `
      <section class="lyric-block">
        <h3>${escapeHtml(block.section)}</h3>
        ${block.lines.map(line => `<p>${escapeHtml(line)}</p>`).join('')}
      </section>
    `).join('');
  }

  const credits = document.querySelector('[data-song-credits]');
  if (credits) {
    const items = {
      Artist: song.credits.artist,
      Songwriter: song.credits.songwriter,
      Label: song.credits.label,
      Roots: song.credits.location,
      Runtime: song.runtime,
      Genre: song.genre
    };
    credits.innerHTML = Object.entries(items).map(([label, value]) => `
      <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
    `).join('');
  }

  const status = document.querySelector('[data-audio-status]');
  const customButton = document.querySelector('[data-custom-play]');
  if (audio && customButton) {
    customButton.addEventListener('click', async () => {
      try {
        if (audio.paused) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch (error) {
        if (status) status.textContent = 'Use the audio controls below to start playback.';
      }
    });

    audio.addEventListener('playing', () => {
      customButton.textContent = '❚❚ PAUSE';
      if (status) status.textContent = 'Now playing';
    });
    audio.addEventListener('pause', () => {
      if (!audio.ended) {
        customButton.textContent = '▶ PLAY';
        if (status) status.textContent = 'Paused';
      }
    });
    audio.addEventListener('ended', () => {
      customButton.textContent = '▶ PLAY';
      if (status) status.textContent = 'Track finished';
    });
    audio.addEventListener('canplay', () => {
      if (status) status.textContent = 'Audio ready';
    });
    audio.addEventListener('error', () => {
      if (status) status.textContent = 'Audio could not be loaded.';
    });
  }
});
