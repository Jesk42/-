/* ==========================================================
   JESK42 — script.js
   ========================================================== */

/* ---------- Playlist -------------------------------------
   GitHub Pages is static hosting: there is no server-side
   directory listing, so the track list is declared here.
   To add a track: drop the mp3 in /music and add one line
   below — everything else (cards, player, mini-player)
   updates automatically.
------------------------------------------------------------ */
const PLAYLIST = [
  { file: "Kishlak - Samyj luchshij den.mp3", title: "Самый лучший день", artist: "Kishlak" },
  { file: "Kishlak - YA disko shar.mp3",       title: "Я диско шар",        artist: "Kishlak" },
  { file: "Onda Andar - Sleep Mode.mp3",       title: "Sleep Mode",         artist: "Onda Andar" },
  { file: "Sladkiy Pirozhok.mp3",              title: "Сладкий пирожок",    artist: "Jesk42" },
].map(t => ({ ...t, src: "music/" + encodeURIComponent(t.file) }));

/* ---------- Preloader -------------------------------------- */
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  setTimeout(() => pre.classList.add("loaded"), 500);
});

/* ---------- Custom cursor ----------------------------------- */
(function cursor(){
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (matchMedia("(hover:none), (pointer:coarse)").matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });
  (function loop(){
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  const hoverables = "a, button, input[type=range], .track-card";
  document.addEventListener("mouseover", e => {
    if (e.target.closest(hoverables)) ring.classList.add("hovering");
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest(hoverables)) ring.classList.remove("hovering");
  });
})();

/* ---------- Ambient particles canvas ------------------------- */
(function particles(){
  const canvas = document.getElementById("bg-particles");
  const ctx = canvas.getContext("2d");
  let w, h, particlesArr;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function makeParticles(){
    const count = Math.min(90, Math.floor((w * h) / 22000));
    particlesArr = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.5 + 0.15,
    }));
  }
  function step(){
    ctx.clearRect(0, 0, w, h);
    particlesArr.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.shadowBlur = 4;
      ctx.fill();
    });
    requestAnimationFrame(step);
  }
  resize(); makeParticles();
  window.addEventListener("resize", () => { resize(); makeParticles(); });
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) step();
})();

/* ---------- Nav: scroll shadow, active link, mobile toggle --- */
(function nav(){
  const navEl = document.getElementById("siteNav");
  const burger = document.getElementById("navBurger");
  const mobile = document.getElementById("navMobile");
  const links = document.querySelectorAll("[data-nav]");
  const sections = document.querySelectorAll(".section");

  window.addEventListener("scroll", () => {
    navEl.classList.toggle("scrolled", window.scrollY > 30);
  });

  burger.addEventListener("click", () => {
    const open = burger.classList.toggle("open");
    mobile.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });
  mobile.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    burger.classList.remove("open");
    mobile.classList.remove("open");
  }));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => io.observe(s));
})();

/* ---------- Scroll reveal ------------------------------------ */
(function reveal(){
  const items = document.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 70 + "ms";
    io.observe(el);
  });
})();

/* ---------- To top button -------------------------------------- */
(function toTop(){
  const btn = document.getElementById("toTop");
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 600);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ---------- Music player ---------------------------------------- */
(function player(){
  const audio = document.getElementById("audio");
  const trackList = document.getElementById("trackList");
  const trackTitle = document.getElementById("trackTitle");
  const trackArtist = document.getElementById("trackArtist");
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");
  const volumeBar = document.getElementById("volumeBar");
  const timeCurrent = document.getElementById("timeCurrent");
  const timeDuration = document.getElementById("timeDuration");
  const artDisc = document.getElementById("artDisc");
  const heroListenBtn = document.getElementById("heroListenBtn");

  const miniPlayer = document.getElementById("miniPlayer");
  const miniTitle = document.getElementById("miniTitle");
  const miniDisc = document.getElementById("miniDisc");
  const miniPlay = document.getElementById("miniPlay");
  const miniPlayIcon = document.getElementById("miniPlayIcon");
  const miniPrev = document.getElementById("miniPrev");
  const miniNext = document.getElementById("miniNext");

  const ICON_PLAY = '<path d="M8 5v14l11-7L8 5z" fill="currentColor"/>';
  const ICON_PAUSE = '<path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/>';

  let current = 0;
  let isPlaying = false;

  function fmt(sec){
    if (!isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function renderList(){
    trackList.innerHTML = "";
    PLAYLIST.forEach((t, i) => {
      const card = document.createElement("div");
      card.className = "track-card";
      card.dataset.index = i;
      card.innerHTML = `
        <span class="track-index">${String(i + 1).padStart(2, "0")}</span>
        <span class="track-meta">
          <span class="track-name">${t.title}</span>
        </span>
        <span class="track-wave"><span></span><span></span><span></span></span>
        <span class="track-dur" data-dur>--:--</span>
      `;
      card.addEventListener("click", () => loadTrack(i, true));
      trackList.appendChild(card);

      const probe = new Audio();
      probe.preload = "metadata";
      probe.src = t.src;
      probe.addEventListener("loadedmetadata", () => {
        const el = card.querySelector("[data-dur]");
        if (el) el.textContent = fmt(probe.duration);
      });
    });
  }

  function highlightActive(){
    trackList.querySelectorAll(".track-card").forEach(c => {
      c.classList.toggle("active", Number(c.dataset.index) === current);
    });
  }

  function loadTrack(i, autoplay){
    current = (i + PLAYLIST.length) % PLAYLIST.length;
    const t = PLAYLIST[current];
    audio.src = t.src;
    trackTitle.textContent = t.title;
    trackArtist.textContent = t.artist;
    miniTitle.textContent = t.title;
    highlightActive();
    if (autoplay) play();
  }

  function play(){
    audio.play().then(() => {
      isPlaying = true;
      updatePlayIcons();
    }).catch(() => {});
  }
  function pause(){
    audio.pause();
    isPlaying = false;
    updatePlayIcons();
  }
  function togglePlay(){
    if (!audio.src) loadTrack(0, true);
    else isPlaying ? pause() : play();
  }
  function updatePlayIcons(){
    playIcon.innerHTML = isPlaying ? ICON_PAUSE : ICON_PLAY;
    miniPlayIcon.innerHTML = isPlaying ? ICON_PAUSE : ICON_PLAY;
    artDisc.classList.toggle("spinning", isPlaying);
    miniDisc.classList.toggle("spinning", isPlaying);
    miniPlayer.classList.toggle("show", !!audio.src);
  }

  function next(){ loadTrack(current + 1, true); }
  function prev(){ loadTrack(current - 1, true); }

  playBtn.addEventListener("click", togglePlay);
  miniPlay.addEventListener("click", togglePlay);
  nextBtn.addEventListener("click", next);
  miniNext.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  miniPrev.addEventListener("click", prev);

  heroListenBtn.addEventListener("click", () => {
    document.getElementById("music").scrollIntoView({ behavior: "smooth" });
    if (!audio.src) loadTrack(0, true);
    else if (!isPlaying) play();
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.value = pct;
    progressBar.style.setProperty("--val", pct + "%");
    timeCurrent.textContent = fmt(audio.currentTime);
    timeDuration.textContent = fmt(audio.duration);
  });
  audio.addEventListener("ended", next);

  progressBar.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  });

  volumeBar.addEventListener("input", () => {
    audio.volume = volumeBar.value;
    volumeBar.style.setProperty("--val", (volumeBar.value * 100) + "%");
  });
  audio.volume = volumeBar.value;
  volumeBar.style.setProperty("--val", (volumeBar.value * 100) + "%");

  renderList();
})();

/* ---------- Footer year ------------------------------------------ */
document.getElementById("year").textContent = new Date().getFullYear();
