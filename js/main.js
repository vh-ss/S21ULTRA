// ===== S21 Ultra — інтерактивність лендінгу =====
(function () {
  "use strict";

  // --- Рік у підвалі ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Час на екрані телефона ---
  const phoneTime = document.getElementById("phoneTime");
  function updateTime() {
    if (!phoneTime) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    phoneTime.textContent = `${hh}:${mm}`;
  }
  updateTime();
  setInterval(updateTime, 10000);

  // --- Фон навігації при скролі ---
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  });

  // --- Мобільне меню (бургер) ---
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    burger.addEventListener("click", () => navLinks.classList.toggle("is-open"));
    navLinks.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => navLinks.classList.remove("is-open"))
    );
  }

  // --- Поява блоків при скролі ---
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // --- Лічильники у Hero ---
  const counters = document.querySelectorAll(".stat__num");
  let countersDone = false;
  function animateCounters() {
    if (countersDone) return;
    countersDone = true;
    counters.forEach((el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString("uk-UA");
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  if ("IntersectionObserver" in window && counters.length) {
    const cObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          animateCounters();
          cObserver.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    cObserver.observe(counters[0]);
  } else {
    animateCounters();
  }

  // --- Вибір кольору ---
  const colors = document.querySelectorAll(".color");
  const colorName = document.getElementById("colorName");
  colors.forEach((btn) => {
    btn.addEventListener("click", () => {
      colors.forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      if (colorName) colorName.textContent = btn.dataset.color;
    });
  });

  // --- Форма замовлення ---
  const form = document.getElementById("orderForm");
  const formMsg = document.getElementById("formMsg");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      if (!name || phone.length < 7) {
        if (formMsg) {
          formMsg.style.color = "#ff6b6b";
          formMsg.textContent = "Будь ласка, заповніть імʼя та коректний телефон.";
        }
        return;
      }
      if (formMsg) {
        formMsg.style.color = "";
        formMsg.textContent = `Дякуємо, ${name}! Ми зателефонуємо вам найближчим часом. 🎉`;
      }
      form.reset();
    });
  }
})();
