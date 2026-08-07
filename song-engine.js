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

  // Project Legacy v3.2 — lyrics experience + persistent mini player.
  const lyricRoot = document.querySelector('[data-song-lyrics]');
  const lyricNav = document.querySelector('[data-lyric-nav]');

  if (lyricRoot && lyricNav) {
    const blocks = [...lyricRoot.querySelectorAll('.lyric-block')];
    blocks.forEach((block, index) => {
      block.id = `lyrics-${index + 1}`;
      const heading = block.querySelector('h3')?.textContent || `Section ${index + 1}`;
      const link = document.createElement('a');
      link.href = `#${block.id}`;
      link.textContent = heading;
      lyricNav.appendChild(link);
    });
  }

  const readingButton = document.querySelector('[data-reading-mode]');
  readingButton?.addEventListener('click', () => {
    document.body.classList.toggle('lyrics-reading-mode');
    readingButton.textContent = document.body.classList.contains('lyrics-reading-mode')
      ? 'Exit Reading Mode'
      : 'Reading Mode';
  });

  const copyLyricsButton = document.querySelector('[data-copy-lyrics]');
  copyLyricsButton?.addEventListener('click', async () => {
    if (!song || !navigator.clipboard) return;
    const text = song.lyrics
      .map(block => `${block.section}\n${block.lines.join('\n')}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(`${song.title} — ${song.artist}\n\n${text}`);
      copyLyricsButton.textContent = 'Copied ✓';
      setTimeout(() => copyLyricsButton.textContent = 'Copy Lyrics', 1600);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  });

  const shareButton = document.querySelector('[data-share-song]');
  shareButton?.addEventListener('click', async () => {
    const shareData = {
      title: `${song.title} — ${song.artist}`,
      text: `${song.title} by ${song.artist}`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        shareButton.textContent = 'Link Copied ✓';
        setTimeout(() => shareButton.textContent = 'Share Song', 1600);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') console.error('Share failed:', error);
    }
  });

  const mini = document.querySelector('[data-mini-player]');
  if (mini && audio) {
    const miniCover = mini.querySelector('[data-mini-cover]');
    const miniTitle = mini.querySelector('[data-mini-title]');
    const miniArtist = mini.querySelector('[data-mini-artist]');
    const miniToggle = mini.querySelector('[data-mini-toggle]');
    const miniSeek = mini.querySelector('[data-mini-seek]');
    const miniCurrent = mini.querySelector('[data-mini-current]');
    const miniDuration = mini.querySelector('[data-mini-duration]');

    miniCover.src = song.cover;
    miniCover.alt = `${song.title} cover art`;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist;

    const formatTime = (seconds) => {
      if (!Number.isFinite(seconds)) return '0:00';
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${min}:${sec}`;
    };

    miniToggle.addEventListener('click', async () => {
      try {
        if (audio.paused) await audio.play();
        else audio.pause();
      } catch (error) {
        console.error('Mini player error:', error);
      }
    });

    miniSeek.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (Number(miniSeek.value) / 100) * audio.duration;
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      miniDuration.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('timeupdate', () => {
      miniCurrent.textContent = formatTime(audio.currentTime);
      miniSeek.value = audio.duration ? String((audio.currentTime / audio.duration) * 100) : '0';
    });
    audio.addEventListener('playing', () => {
      miniToggle.textContent = '❚❚';
      mini.classList.add('is-playing');
      document.body.classList.add('song-is-playing');
    });
    audio.addEventListener('pause', () => {
      miniToggle.textContent = '▶';
      mini.classList.remove('is-playing');
      document.body.classList.remove('song-is-playing');
    });
    audio.addEventListener('ended', () => {
      miniToggle.textContent = '▶';
      miniSeek.value = '0';
      mini.classList.remove('is-playing');
      document.body.classList.remove('song-is-playing');
    });
  }

\n  // Project Legacy v4 — Up Next\n  const upNextGrid=document.querySelector('[data-up-next-grid]');\n  if(upNextGrid&&song){const ids=Array.isArray(song.related)?song.related:[];const items=ids.map(id=>songs.find(x=>x.id===id)).filter(Boolean);upNextGrid.innerHTML=items.length?items.map(item=>{const live=item.available!==false;return `<article class="up-next-card ${live?'is-live':'is-locked'}">${item.cover?`<img src="${item.cover}" alt="${item.title} cover art">`:`<div class="up-next-placeholder"><span>OG FAMOUS</span><strong>${item.title}</strong></div>`}<div><p class="kicker">${item.collection||'Project Legacy'}</p><h3>${item.title}</h3><p>${live?'Available now':'Coming soon'}</p>${live?`<a class="text-link" href="song.html?song=${encodeURIComponent(item.id)}">Play next →</a>`:`<span class="locked-copy">Experience locked</span>`}</div></article>`}).join(''):'<p class="vault-empty">More Project Legacy experiences are being prepared.</p>';}\n});
