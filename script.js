/* =========================================================
   PULSE — script.js
   Вся логика сайта: данные, рендеринг, плеер, анимации.
   Структура сделана так, чтобы можно было легко подставить
   свои MP3-файлы и обложки — просто замени поля `src`/`cover`
   в массиве TRACKS (и, при желании, PLAYLISTS/ARTISTS) ниже.
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. ДАННЫЕ
     Чтобы подключить свою музыку: замени `src` на путь к своему
     файлу, например "assets/audio/moy-trek.mp3", а `cover` —
     на путь к своей обложке, например "assets/covers/moya-oblozhka.jpg".
     Демо-треки ниже используют открытые примеры аудио (SoundHelix)
     и случайные обложки (picsum.photos) исключительно для показа.
  --------------------------------------------------------- */

  const TRACKS = [
    { id: 1, title: "Ночной город", artist: "Nova Drift", genre: "synth", duration: "3:45", cover: "https://picsum.photos/seed/pulse1/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 2, title: "Тихий свет", artist: "Aura Bloom", genre: "ambient", duration: "4:12", cover: "https://picsum.photos/seed/pulse2/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 3, title: "Уголь и пепел", artist: "Kirov", genre: "electronic", duration: "3:28", cover: "https://picsum.photos/seed/pulse3/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { id: 4, title: "Медленный дождь", artist: "Losha", genre: "lofi", duration: "2:58", cover: "https://picsum.photos/seed/pulse4/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: 5, title: "Оранжевый горизонт", artist: "Nova Drift", genre: "synth", duration: "4:01", cover: "https://picsum.photos/seed/pulse5/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: 6, title: "Пыль в лучах", artist: "Mira Frost", genre: "ambient", duration: "3:33", cover: "https://picsum.photos/seed/pulse6/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { id: 7, title: "Пульс", artist: "Kirov", genre: "electronic", duration: "3:50", cover: "https://picsum.photos/seed/pulse7/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { id: 8, title: "Кофе в 6 утра", artist: "Losha", genre: "lofi", duration: "2:41", cover: "https://picsum.photos/seed/pulse8/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { id: 9, title: "Стеклянный след", artist: "Mira Frost", genre: "synth", duration: "4:20", cover: "https://picsum.photos/seed/pulse9/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    { id: 10, title: "Эхо волны", artist: "Aura Bloom", genre: "electronic", duration: "3:15", cover: "https://picsum.photos/seed/pulse10/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
    { id: 11, title: "Долгая ночь", artist: "Kirov", genre: "ambient", duration: "5:02", cover: "https://picsum.photos/seed/pulse11/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
    { id: 12, title: "Городской бриз", artist: "Nova Drift", genre: "lofi", duration: "3:09", cover: "https://picsum.photos/seed/pulse12/400/400", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
  ];

  const ARTISTS = [
    { name: "Nova Drift", genre: "Synthwave", avatar: "https://picsum.photos/seed/artist1/200/200" },
    { name: "Aura Bloom", genre: "Ambient / Chill", avatar: "https://picsum.photos/seed/artist2/200/200" },
    { name: "Kirov", genre: "Electronic", avatar: "https://picsum.photos/seed/artist3/200/200" },
    { name: "Losha", genre: "Lo-fi Hip-Hop", avatar: "https://picsum.photos/seed/artist4/200/200" },
    { name: "Mira Frost", genre: "Dream Pop", avatar: "https://picsum.photos/seed/artist5/200/200" },
    { name: "Echo Valley", genre: "Downtempo", avatar: "https://picsum.photos/seed/artist6/200/200" },
  ];

  const PLAYLISTS = [
    { id: "focus", title: "Фокус и работа", desc: "Спокойные биты для концентрации", cover: "https://picsum.photos/seed/pl1/400/400", trackIds: [4, 8, 12, 2, 6] },
    { id: "night", title: "Ночная смена", desc: "Тёмный синтвейв на всю ночь", cover: "https://picsum.photos/seed/pl2/400/400", trackIds: [1, 5, 9, 3, 7] },
    { id: "chill", title: "Полный релакс", desc: "Эмбиент и лёгкий даунтемпо", cover: "https://picsum.photos/seed/pl3/400/400", trackIds: [2, 6, 11, 10, 4] },
    { id: "energy", title: "Заряд энергии", desc: "Электроника для движения", cover: "https://picsum.photos/seed/pl4/400/400", trackIds: [3, 7, 10, 5, 1] },
  ];

  /* ---------------------------------------------------------
     2. РЕНДЕРИНГ КАРТОЧЕК
  --------------------------------------------------------- */

  function trackCardHTML(track) {
    return `
      <article class="track-card glass-card" data-id="${track.id}" data-genre="${track.genre}">
        <div class="track-cover">
          <img src="${track.cover}" alt="Обложка трека «${track.title}»" loading="lazy">
          <div class="track-play-overlay">
            <button class="track-play-btn" aria-label="Воспроизвести ${track.title}">
              <i class="ph-fill ph-play"></i>
            </button>
          </div>
        </div>
        <div class="track-title">${track.title}</div>
        <div class="track-artist">${track.artist}</div>
      </article>`;
  }

  function artistCardHTML(artist) {
    return `
      <article class="artist-card glass-card">
        <div class="artist-avatar"><img src="${artist.avatar}" alt="${artist.name}" loading="lazy"></div>
        <div class="artist-name">${artist.name}</div>
        <div class="artist-genre">${artist.genre}</div>
      </article>`;
  }

  const popularRow = document.getElementById("popularRow");
  const newRow = document.getElementById("newRow");
  const musicGrid = document.getElementById("musicGrid");
  const artistGrid = document.getElementById("artistGrid");

  popularRow.innerHTML = TRACKS.slice(0, 8).map(trackCardHTML).join("");
  newRow.innerHTML = [...TRACKS].slice(4, 12).reverse().map(trackCardHTML).join("");
  musicGrid.innerHTML = TRACKS.map(trackCardHTML).join("");
  artistGrid.innerHTML = ARTISTS.map(artistCardHTML).join("");

  /* Фильтр по жанру в разделе «Музыка» */
  const genreFilters = document.getElementById("genreFilters");
  genreFilters.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    genreFilters.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const genre = chip.dataset.genre;
    musicGrid.querySelectorAll(".track-card").forEach((card) => {
      const show = genre === "all" || card.dataset.genre === genre;
      card.style.display = show ? "" : "none";
    });
  });

  /* ---------------------------------------------------------
     3. ПЛЕЙЛИСТЫ
  --------------------------------------------------------- */

  const playlistTabs = document.getElementById("playlistTabs");
  const playlistView = document.getElementById("playlistView");

  function trackById(id) { return TRACKS.find((t) => t.id === id); }

  function renderPlaylistTabs() {
    playlistTabs.innerHTML = PLAYLISTS.map((pl, i) => `
      <button class="playlist-tab ${i === 0 ? "active" : ""}" data-id="${pl.id}">
        <img src="${pl.cover}" alt="">
        <span>${pl.title}</span>
      </button>`).join("");
  }

  function renderPlaylistView(playlistId) {
    const pl = PLAYLISTS.find((p) => p.id === playlistId) || PLAYLISTS[0];
    const tracks = pl.trackIds.map(trackById).filter(Boolean);

    playlistView.classList.remove("glass-card"); // контейнер сам не карточка, карточка — вложенный блок
    playlistView.innerHTML = `
      <div class="playlist-cover-wrap glass-card" style="padding:24px;">
        <img src="${pl.cover}" alt="Обложка плейлиста «${pl.title}»">
        <div>
          <h3>${pl.title}</h3>
          <p>${pl.desc} · ${tracks.length} треков</p>
          <button class="btn btn-primary play-playlist-btn">
            <i class="ph-fill ph-play"></i> Слушать плейлист
          </button>
        </div>
      </div>
      <div class="playlist-track-list glass-card" style="padding:14px;">
        ${tracks.map((t, i) => `
          <div class="pl-track" data-id="${t.id}">
            <span class="pl-index">${i + 1}</span>
            <span class="pl-index-play"><i class="ph-fill ph-play"></i></span>
            <img class="pl-cover" src="${t.cover}" alt="">
            <div>
              <div class="pl-title">${t.title}</div>
              <div class="pl-artist">${t.artist}</div>
            </div>
            <span class="pl-duration">${t.duration}</span>
          </div>`).join("")}
      </div>`;

    playlistView.querySelector(".play-playlist-btn").addEventListener("click", () => {
      loadQueue(tracks, 0);
      playCurrent();
    });

    playlistView.querySelectorAll(".pl-track").forEach((row, i) => {
      row.addEventListener("click", () => {
        loadQueue(tracks, i);
        playCurrent();
      });
    });
  }

  renderPlaylistTabs();
  renderPlaylistView(PLAYLISTS[0].id);

  playlistTabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".playlist-tab");
    if (!tab) return;
    playlistTabs.querySelectorAll(".playlist-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderPlaylistView(tab.dataset.id);
  });

  /* ---------------------------------------------------------
     4. МУЗЫКАЛЬНЫЙ ПЛЕЕР
  --------------------------------------------------------- */

  const audio = document.getElementById("audio");
  const playBtn = document.getElementById("playBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const repeatBtn = document.getElementById("repeatBtn");
  const likeBtn = document.getElementById("likeBtn");
  const muteBtn = document.getElementById("muteBtn");

  const playerCover = document.getElementById("playerCover");
  const playerTitle = document.getElementById("playerTitle");
  const playerArtist = document.getElementById("playerArtist");

  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const progressBuffered = document.querySelector(".progress-buffered");
  const progressHandle = document.getElementById("progressHandle");
  const currentTimeEl = document.getElementById("currentTime");
  const durationTimeEl = document.getElementById("durationTime");

  const volumeBar = document.getElementById("volumeBar");
  const volumeFill = document.getElementById("volumeFill");

  let queue = [...TRACKS];   // текущая очередь воспроизведения
  let currentIndex = 0;      // индекс текущего трека в очереди
  let isShuffled = false;
  let repeatMode = "off";    // off | all | one
  let likedIds = new Set();

  audio.volume = 0.7;

  function loadQueue(tracks, startIndex = 0) {
    queue = tracks;
    currentIndex = startIndex;
    loadTrack(queue[currentIndex]);
  }

  function loadTrack(track) {
    if (!track) return;
    audio.src = track.src;
    playerCover.src = track.cover;
    playerCover.alt = `Обложка «${track.title}»`;
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    updateLikeUI(track.id);
    highlightActiveCards(track.id);
  }

  function playCurrent() {
    audio.play().catch(() => {
      /* Воспроизведение может быть заблокировано браузером до
         взаимодействия пользователя — это ожидаемо и не является ошибкой. */
    });
    setPlayingUI(true);
  }

  function setPlayingUI(playing) {
    playBtn.innerHTML = playing ? '<i class="ph-fill ph-pause"></i>' : '<i class="ph-fill ph-play"></i>';
    document.querySelectorAll(".track-play-btn").forEach((b) => b.classList.remove("playing"));
    if (playing) {
      const activeCard = document.querySelector(".track-card.is-active .track-play-btn");
      if (activeCard) activeCard.classList.add("playing");
    }
  }

  function highlightActiveCards(trackId) {
    document.querySelectorAll(".track-card").forEach((c) => {
      c.classList.toggle("is-active", Number(c.dataset.id) === trackId);
    });
    document.querySelectorAll(".pl-track").forEach((r) => {
      r.classList.toggle("is-active", Number(r.dataset.id) === trackId);
    });
  }

  function togglePlay() {
    if (!audio.src) {
      loadQueue(TRACKS, 0);
      playCurrent();
      return;
    }
    if (audio.paused) { playCurrent(); }
    else { audio.pause(); setPlayingUI(false); }
  }

  function playNext() {
    if (!queue.length) return;
    if (repeatMode === "one") { audio.currentTime = 0; playCurrent(); return; }
    currentIndex = (currentIndex + 1) % queue.length;
    if (currentIndex === 0 && repeatMode !== "all" && !isShuffled) {
      loadTrack(queue[currentIndex]);
      setPlayingUI(false);
      return;
    }
    loadTrack(queue[currentIndex]);
    playCurrent();
  }

  function playPrev() {
    if (!queue.length) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    loadTrack(queue[currentIndex]);
    playCurrent();
  }

  function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle("active", isShuffled);
    const current = queue[currentIndex];
    if (isShuffled) {
      const rest = queue.filter((_, i) => i !== currentIndex);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      queue = [current, ...rest];
    } else {
      queue = [...TRACKS];
    }
    currentIndex = queue.findIndex((t) => t.id === current.id);
  }

  function cycleRepeat() {
    repeatMode = repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
    repeatBtn.classList.toggle("active", repeatMode !== "off");
    repeatBtn.innerHTML = repeatMode === "one"
      ? '<i class="ph ph-repeat-once"></i>'
      : '<i class="ph ph-repeat"></i>';
  }

  function updateLikeUI(trackId) {
    const liked = likedIds.has(trackId);
    likeBtn.classList.toggle("liked", liked);
    likeBtn.innerHTML = liked ? '<i class="ph-fill ph-heart"></i>' : '<i class="ph ph-heart"></i>';
  }

  function toggleLike() {
    const track = queue[currentIndex];
    if (!track) return;
    if (likedIds.has(track.id)) likedIds.delete(track.id);
    else likedIds.add(track.id);
    updateLikeUI(track.id);
  }

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  /* --- события audio-элемента --- */
  audio.addEventListener("play", () => setPlayingUI(true));
  audio.addEventListener("pause", () => setPlayingUI(false));
  audio.addEventListener("ended", playNext);

  audio.addEventListener("loadedmetadata", () => {
    durationTimeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progressFill.style.width = pct + "%";
    progressHandle.style.left = pct + "%";
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("progress", () => {
    if (audio.buffered.length && audio.duration) {
      const end = audio.buffered.end(audio.buffered.length - 1);
      progressBuffered.style.width = (end / audio.duration) * 100 + "%";
    }
  });

  /* --- клики по управлению --- */
  playBtn.addEventListener("click", togglePlay);
  nextBtn.addEventListener("click", playNext);
  prevBtn.addEventListener("click", playPrev);
  shuffleBtn.addEventListener("click", toggleShuffle);
  repeatBtn.addEventListener("click", cycleRepeat);
  likeBtn.addEventListener("click", toggleLike);

  /* --- перемотка по клику/драгу на полосе прогресса --- */
  function seekFromEvent(clientX) {
    const rect = progressBar.getBoundingClientRect();
    const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    if (audio.duration) audio.currentTime = pct * audio.duration;
  }
  let seeking = false;
  progressBar.addEventListener("mousedown", (e) => { seeking = true; seekFromEvent(e.clientX); });
  window.addEventListener("mousemove", (e) => { if (seeking) seekFromEvent(e.clientX); });
  window.addEventListener("mouseup", () => { seeking = false; });
  progressBar.addEventListener("touchstart", (e) => seekFromEvent(e.touches[0].clientX), { passive: true });
  progressBar.addEventListener("touchmove", (e) => seekFromEvent(e.touches[0].clientX), { passive: true });

  /* --- громкость --- */
  function setVolumeFromEvent(clientX) {
    const rect = volumeBar.getBoundingClientRect();
    const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    audio.volume = pct;
    volumeFill.style.width = pct * 100 + "%";
    muteBtn.innerHTML = pct === 0
      ? '<i class="ph ph-speaker-x"></i>'
      : pct < 0.5 ? '<i class="ph ph-speaker-low"></i>' : '<i class="ph ph-speaker-high"></i>';
  }
  let draggingVol = false;
  volumeBar.addEventListener("mousedown", (e) => { draggingVol = true; setVolumeFromEvent(e.clientX); });
  window.addEventListener("mousemove", (e) => { if (draggingVol) setVolumeFromEvent(e.clientX); });
  window.addEventListener("mouseup", () => { draggingVol = false; });
  volumeFill.style.width = audio.volume * 100 + "%";

  let lastVolume = 0.7;
  muteBtn.addEventListener("click", () => {
    if (audio.volume > 0) {
      lastVolume = audio.volume;
      audio.volume = 0;
      volumeFill.style.width = "0%";
      muteBtn.innerHTML = '<i class="ph ph-speaker-x"></i>';
    } else {
      audio.volume = lastVolume || 0.7;
      volumeFill.style.width = audio.volume * 100 + "%";
      muteBtn.innerHTML = '<i class="ph ph-speaker-high"></i>';
    }
  });

  /* --- клики по карточкам треков (везде на сайте) --- */
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".track-card");
    if (!card) return;
    const id = Number(card.dataset.id);
    const idx = TRACKS.findIndex((t) => t.id === id);
    if (idx === -1) return;
    loadQueue([...TRACKS], idx);
    playCurrent();
  });

  /* --- кнопка «Слушать сейчас» в hero --- */
  document.getElementById("heroPlayBtn").addEventListener("click", () => {
    loadQueue([...TRACKS], 0);
    playCurrent();
    document.getElementById("music").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------------------------------------------------------
     5. ШАПКА: скролл-состояние, активный пункт, бургер-меню
  --------------------------------------------------------- */

  const siteHeader = document.getElementById("siteHeader");
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileNav = document.getElementById("mobileNav");

  window.addEventListener("scroll", () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });

  burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("open");
    mobileNav.classList.toggle("open");
  });

  document.querySelectorAll(".mobile-nav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      burgerBtn.classList.remove("open");
      mobileNav.classList.remove("open");
    });
  });

  /* Подсветка активного пункта меню при скролле */
  const sections = document.querySelectorAll("main .section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((l) => l.classList.toggle("active", l.dataset.section === id));
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });

  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------------------------------------------------------
     6. АНИМАЦИИ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
  --------------------------------------------------------- */

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------
     7. СЧЁТЧИКИ В РАЗДЕЛЕ «О САЙТЕ»
  --------------------------------------------------------- */

  const statNums = document.querySelectorAll(".stat-num");
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      statsObserver.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  statNums.forEach((el) => statsObserver.observe(el));

  /* ---------------------------------------------------------
     8. КНОПКА «НАВЕРХ»
  --------------------------------------------------------- */

  const toTopBtn = document.getElementById("toTopBtn");
  window.addEventListener("scroll", () => {
    toTopBtn.classList.toggle("visible", window.scrollY > 700);
  }, { passive: true });
  toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------------------------------------------------
     9. ФОРМА КОНТАКТОВ (демо-отправка без бэкенда)
  --------------------------------------------------------- */

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formStatus.textContent = "Отправка...";
    setTimeout(() => {
      formStatus.textContent = "Спасибо! Сообщение отправлено (демо-режим).";
      contactForm.reset();
    }, 700);
  });

  /* ---------------------------------------------------------
     10. ГОД В ФУТЕРЕ
  --------------------------------------------------------- */

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     11. АНИМИРОВАННЫЙ ФОН: частицы + волны на <canvas>
  --------------------------------------------------------- */

  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let width, height, particles;
  const PARTICLE_COUNT = 70;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15,
      hueOrange: Math.random() > 0.72, // часть частиц окрашена в акцентный оранжевый
    }));
  }

  let t = 0;
  function drawWaves() {
    const waveConfigs = [
      { amp: 26, len: 0.0055, speed: 0.008, y: height * 0.82, color: "rgba(255,90,31,0.06)" },
      { amp: 18, len: 0.008, speed: -0.006, y: height * 0.88, color: "rgba(255,167,89,0.045)" },
      { amp: 34, len: 0.004, speed: 0.004, y: height * 0.94, color: "rgba(255,90,31,0.035)" },
    ];
    waveConfigs.forEach((w) => {
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 12) {
        const y = w.y + Math.sin(x * w.len + t * w.speed * 10) * w.amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = w.color;
      ctx.fill();
    });
  }

  function drawParticles() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.hueOrange
        ? `rgba(255,127,63,${p.alpha})`
        : `rgba(245,243,239,${p.alpha * 0.6})`;
      ctx.fill();
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawWaves();
    drawParticles();
    t++;
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  initParticles();
  window.addEventListener("resize", () => { resizeCanvas(); initParticles(); });

  if (!prefersReducedMotion) {
    animate();
  } else {
    // при сниженной анимации рисуем один статичный кадр
    drawWaves();
    drawParticles();
  }

})();
