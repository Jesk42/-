/* =========================================================
   FRM/36 — script.js
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. ДАННЫЕ
  --------------------------------------------------------- */

  const PROCESS_STEPS = [
    { num: "01", title: "Съёмка", desc: "Ты снимаешь ролик до конца и привозишь или присылаешь его нам в лабораторию." },
    { num: "02", title: "Проявка", desc: "Ручная проявка C-41, ЧБ или E-6 с контролем температуры и времени по каждому бачку." },
    { num: "03", title: "Сканирование", desc: "Барабанный сканер, 4000 dpi, цветокоррекция по каждому кадру вручную." },
    { num: "04", title: "Печать", desc: "Отпечатки на фотобумаге любого формата — по сканам или напрямую с негатива." },
  ];

  const STOCKS = [
    { name: "Portra 400", iso: "ISO 400", type: "Цвет, негатив", desc: "Мягкие тона кожи, широкая широта экспозиции.", color: "#c9803e" },
    { name: "HP5 Plus", iso: "ISO 400", type: "Ч/Б, негатив", desc: "Классическое зерно, глубокие тени.", color: "#9c8f80" },
    { name: "Superia 200", iso: "ISO 200", type: "Цвет, негатив", desc: "Насыщенные цвета, лёгкий зелёный оттенок.", color: "#6f8f5c" },
    { name: "Tri-X 400", iso: "ISO 400", type: "Ч/Б, негатив", desc: "Контрастная классика уличной съёмки.", color: "#e8402c" },
    { name: "CineStill 800T", iso: "ISO 800", type: "Цвет, негатив", desc: "Кино-эмульсия, ореолы вокруг источников света.", color: "#c9803e" },
    { name: "Ektachrome E100", iso: "ISO 100", type: "Слайд, E-6", desc: "Чистые цвета, минимальное зерно.", color: "#4a7fa3" },
  ];

  const CONTACT_FRAMES = Array.from({ length: 12 }, (_, i) => ({
    index: `36A-${(i + 1).toString().padStart(2, "0")}`,
    src: `https://picsum.photos/seed/frm36-${i + 1}/300/200`,
  }));

  const PRICES = [
    { tag: "Кадр 01", name: "Только проявка", value: "350₽", unit: "/ ролик", items: ["Проявка C-41 или Ч/Б", "Возврат негатива в нарезке", "Срок — 1 рабочий день"] },
    { tag: "Кадр 02", name: "Проявка + скан", value: "650₽", unit: "/ ролик", featured: true, items: ["Проявка + скан 4000 dpi", "Цветокоррекция каждого кадра", "Файлы в облаке 30 дней", "Срок — 2 рабочих дня"] },
    { tag: "Кадр 03", name: "Проявка + скан + печать", value: "1200₽", unit: "/ ролик", items: ["Всё из тарифа «Скан»", "Отпечатки 10×15 на весь ролик", "Бесплатный конверт для хранения"] },
  ];

  const LAB_LOG = [
    { time: "2016", text: "Лаборатория открыта в подвале на два стола." },
    { time: "2019", text: "Куплен барабанный сканер — <span>отказались от планшетного</span>." },
    { time: "2023", text: "Более 12 000 роликов прошло через проявку." },
    { time: "сейчас", text: "Химия обновляется каждые 40 роликов, а не по календарю." },
  ];

  /* ---------------------------------------------------------
     2. РЕНДЕРИНГ
  --------------------------------------------------------- */

  document.getElementById("rollSteps").innerHTML = PROCESS_STEPS.map((s) => `
    <div class="roll-frame reveal-child">
      <span class="frame-number">${s.num}</span>
      <div class="frame-title">${s.title}</div>
      <div class="frame-desc">${s.desc}</div>
    </div>`).join("");

  document.getElementById("stockGrid").innerHTML = STOCKS.map((s) => `
    <div class="stock-card reveal-child" style="--tab-color:${s.color}">
      <div class="stock-top">
        <span class="stock-iso">${s.iso}</span>
        <span class="stock-type">${s.type}</span>
      </div>
      <div class="stock-name">${s.name}</div>
      <div class="stock-desc">${s.desc}</div>
    </div>`).join("");

  const contactSheet = document.getElementById("contactSheet");
  const loupe = document.getElementById("loupe");
  contactSheet.insertAdjacentHTML("afterbegin", CONTACT_FRAMES.map((f) => `
    <div class="neg-frame" data-src="${f.src}">
      <img src="${f.src}" alt="Негатив кадра ${f.index}" loading="lazy">
      <span class="neg-index">${f.index}</span>
    </div>`).join(""));

  document.getElementById("priceGrid").innerHTML = PRICES.map((p) => `
    <div class="price-card ${p.featured ? "featured" : ""} reveal-child">
      <span class="price-tag">${p.tag}</span>
      <div class="price-name">${p.name}</div>
      <div class="price-value">${p.value} <span>${p.unit}</span></div>
      <ul class="price-list">${p.items.map((i) => `<li>${i}</li>`).join("")}</ul>
    </div>`).join("");

  document.getElementById("labLog").innerHTML = LAB_LOG.map((l) => `
    <div class="log-entry">
      <span class="log-time">${l.time}</span>
      <span class="log-text">${l.text}</span>
    </div>`).join("");

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     3. ЛУПА НА КОНТРОЛЬНОМ ЛИСТЕ
  --------------------------------------------------------- */

  const LOUPE_SIZE = 160;
  const ZOOM = 2.6;

  contactSheet.addEventListener("mousemove", (e) => {
    const frame = e.target.closest(".neg-frame");
    const sheetRect = contactSheet.getBoundingClientRect();

    if (!frame) {
      loupe.classList.remove("visible");
      return;
    }

    const frameRect = frame.getBoundingClientRect();
    const relX = e.clientX - frameRect.left;
    const relY = e.clientY - frameRect.top;

    loupe.classList.add("visible");
    loupe.style.left = e.clientX - sheetRect.left + "px";
    loupe.style.top = e.clientY - sheetRect.top + "px";
    loupe.style.backgroundImage = `url(${frame.dataset.src})`;
    loupe.style.backgroundSize = `${frameRect.width * ZOOM}px ${frameRect.height * ZOOM}px`;
    loupe.style.backgroundPosition = `-${relX * ZOOM - LOUPE_SIZE / 2}px -${relY * ZOOM - LOUPE_SIZE / 2}px`;
  });

  contactSheet.addEventListener("mouseleave", () => loupe.classList.remove("visible"));

  /* ---------------------------------------------------------
     4. ШАПКА: скролл-состояние + мобильное меню
  --------------------------------------------------------- */

  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  burger.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---------------------------------------------------------
     5. ВСПЫШКА ЗАТВОРА НА CTA-КНОПКАХ
  --------------------------------------------------------- */

  const flash = document.getElementById("flash");
  function fireFlash() {
    flash.classList.remove("fire");
    void flash.offsetWidth; // перезапуск анимации
    flash.classList.add("fire");
  }

  document.getElementById("ctaBtn").addEventListener("click", () => {
    fireFlash();
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });

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
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------------------
     7. ФОРМА ЗАЯВКИ (демо-отправка без бэкенда)
  --------------------------------------------------------- */

  const rollForm = document.getElementById("rollForm");
  const formStatus = document.getElementById("formStatus");

  rollForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fireFlash();
    formStatus.textContent = "Записываем ролик...";
    setTimeout(() => {
      formStatus.textContent = "Готово! Мы свяжемся с вами, чтобы согласовать приём (демо-режим).";
      rollForm.reset();
    }, 700);
  });

})();
