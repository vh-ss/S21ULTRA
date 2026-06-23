// ===== Мапа вітру: інтерактивна мапа з деталізацією по містах =====
"use strict";

// Локації, згруповані за областями.
const LOCATIONS = [
  {
    group: "Харківська область",
    points: [
      { name: "Харків", lat: 49.9935, lon: 36.2304 },
      { name: "Ізюм", lat: 49.2126, lon: 37.2506 },
      { name: "Куп'янськ", lat: 49.7106, lon: 37.6156 },
      { name: "Чугуїв", lat: 49.8361, lon: 36.6881 },
      { name: "Лозова", lat: 48.8897, lon: 36.3174 },
      { name: "Балаклія", lat: 49.4608, lon: 36.8581 },
    ],
  },
  {
    group: "Донецька область",
    points: [
      { name: "Донецьк", lat: 48.0159, lon: 37.8028 },
      { name: "Маріуполь", lat: 47.0971, lon: 37.5434 },
      { name: "Краматорськ", lat: 48.7389, lon: 37.5848 },
      { name: "Слов'янськ", lat: 48.8531, lon: 37.6111 },
      { name: "Бахмут", lat: 48.5947, lon: 38.0019 },
      { name: "Покровськ", lat: 48.2814, lon: 37.1763 },
    ],
  },
  {
    group: "Луганська область",
    points: [
      { name: "Луганськ", lat: 48.5740, lon: 39.3078 },
      { name: "Сєвєродонецьк", lat: 48.9482, lon: 38.4929 },
      { name: "Лисичанськ", lat: 48.9170, lon: 38.4308 },
      { name: "Рубіжне", lat: 49.0114, lon: 38.3792 },
      { name: "Старобільськ", lat: 49.2769, lon: 38.9067 },
    ],
  },
  {
    group: "Дніпропетровська область",
    points: [
      { name: "Дніпро", lat: 48.4647, lon: 35.0462 },
      { name: "Кривий Ріг", lat: 47.9105, lon: 33.3918 },
      { name: "Кам'янське", lat: 48.5110, lon: 34.6021 },
      { name: "Павлоград", lat: 48.5350, lon: 35.8700 },
      { name: "Нікополь", lat: 47.5670, lon: 34.4080 },
    ],
  },
  {
    group: "Запорізька область",
    points: [
      { name: "Запоріжжя", lat: 47.8388, lon: 35.1396 },
      { name: "Мелітополь", lat: 46.8489, lon: 35.3653 },
      { name: "Бердянськ", lat: 46.7553, lon: 36.7885 },
      { name: "Енергодар", lat: 47.4986, lon: 34.6582 },
      { name: "Токмак", lat: 47.2540, lon: 35.7080 },
    ],
  },
  {
    group: "Полтавська область",
    points: [
      { name: "Полтава", lat: 49.5883, lon: 34.5514 },
      { name: "Кременчук", lat: 49.0670, lon: 33.4204 },
      { name: "Лубни", lat: 50.0186, lon: 32.9869 },
      { name: "Миргород", lat: 49.9686, lon: 33.6088 },
    ],
  },
  {
    group: "Сумська область",
    points: [
      { name: "Суми", lat: 50.9077, lon: 34.7981 },
      { name: "Конотоп", lat: 51.2417, lon: 33.2027 },
      { name: "Охтирка", lat: 50.3100, lon: 34.8990 },
      { name: "Шостка", lat: 51.8730, lon: 33.4795 },
    ],
  },
];

const API = "https://api.open-meteo.com/v1/forecast";
const MAX_OBLASTS = 3;
const DEFAULT_OBLASTS = ["Харківська область", "Донецька область"];
const STORAGE_KEY = "windOblasts";

// Елементи DOM
const els = {
  settingsBtn: document.getElementById("settingsBtn"),
  settingsModal: document.getElementById("settingsModal"),
  oblastList: document.getElementById("oblastList"),
  oblastCounter: document.getElementById("oblastCounter"),
  saveSettings: document.getElementById("saveSettings"),
  brandSub: document.getElementById("brandSub"),
  mapHint: document.getElementById("mapHint"),
  detailModal: document.getElementById("detailModal"),
  detailTitle: document.getElementById("detailTitle"),
  detailStatus: document.getElementById("detailStatus"),
  detailBody: document.getElementById("detailBody"),
  arrow: document.getElementById("compassArrow"),
  speed: document.getElementById("currentSpeed"),
  dir: document.getElementById("currentDir"),
  gust: document.getElementById("currentGust"),
  force: document.getElementById("currentForce"),
  updated: document.getElementById("currentUpdated"),
  hourly: document.getElementById("hourly"),
  daily: document.getElementById("daily"),
};

let map, markersLayer;

// ---- Допоміжні функції ----
const COMPASS_16 = [
  "Пн", "Пн-ПнСх", "ПнСх", "Сх-ПнСх", "Сх", "Сх-ПдСх", "ПдСх", "Пд-ПдСх",
  "Пд", "Пд-ПдЗх", "ПдЗх", "Зх-ПдЗх", "Зх", "Зх-ПнЗх", "ПнЗх", "Пн-ПнЗх",
];
function dirName(deg) {
  return COMPASS_16[Math.round((deg % 360) / 22.5) % 16];
}
const ARROWS_8 = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
function windArrow(fromDeg) {
  return ARROWS_8[Math.round((fromDeg % 360) / 45) % 8];
}
function beaufort(ms) {
  if (ms < 1.6) return { txt: "Штиль", cls: "f-calm" };
  if (ms < 3.4) return { txt: "Легкий", cls: "f-calm" };
  if (ms < 5.5) return { txt: "Слабкий", cls: "f-mod" };
  if (ms < 8.0) return { txt: "Помірний", cls: "f-mod" };
  if (ms < 10.8) return { txt: "Свіжий", cls: "f-strong" };
  if (ms < 13.9) return { txt: "Сильний", cls: "f-strong" };
  if (ms < 17.2) return { txt: "Міцний", cls: "f-storm" };
  if (ms < 20.8) return { txt: "Дуже міцний", cls: "f-storm" };
  return { txt: "Шторм", cls: "f-storm" };
}
function fmt(n, d = 1) {
  return (Math.round(n * 10 ** d) / 10 ** d).toLocaleString("uk-UA");
}

// ---- Налаштування областей ----
function getSelectedOblasts() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(s) && s.length) return s.slice(0, MAX_OBLASTS);
  } catch (e) { /* ignore */ }
  return DEFAULT_OBLASTS.slice();
}
function saveSelectedOblasts(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, MAX_OBLASTS)));
}

// ---- Мапа ----
function initMap() {
  map = L.map("map", { zoomControl: true, attributionControl: true }).setView([48.7, 37.0], 7);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '© OpenStreetMap, © CARTO',
    subdomains: "abcd",
    maxZoom: 18,
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
}

function renderMarkers() {
  markersLayer.clearLayers();
  const selected = getSelectedOblasts();
  const groups = LOCATIONS.filter((g) => selected.includes(g.group));
  const bounds = [];

  groups.forEach((g) => {
    g.points.forEach((p) => {
      const icon = L.divIcon({
        className: "city-marker",
        html: `<span class="city-marker__dot"></span><span class="city-marker__label">${p.name}</span>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const m = L.marker([p.lat, p.lon], { icon, title: p.name }).addTo(markersLayer);
      m.on("click", () => openDetail(p));
      bounds.push([p.lat, p.lon]);
    });
  });

  if (bounds.length) {
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 9 });
  }

  // Підпис у шапці
  els.brandSub.textContent = selected.join(" · ");
}

// ---- Запит даних ----
async function fetchWind(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: "wind_speed_10m,wind_direction_10m,wind_gusts_10m",
    hourly: "wind_speed_10m,wind_direction_10m,wind_gusts_10m",
    daily: "wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant",
    wind_speed_unit: "ms",
    timezone: "auto",
    forecast_days: "5",
  });
  const res = await fetch(`${API}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ---- Рендер деталізації ----
function renderCurrent(data) {
  const c = data.current;
  const force = beaufort(c.wind_speed_10m);
  els.speed.textContent = fmt(c.wind_speed_10m);
  els.dir.textContent = `${dirName(c.wind_direction_10m)} (${Math.round(c.wind_direction_10m)}°)`;
  els.gust.textContent = `${fmt(c.wind_gusts_10m)} м/с`;
  els.force.textContent = force.txt;
  els.force.className = `meta__value ${force.cls}`;
  els.arrow.style.transform = `translate(-50%, -50%) rotate(${c.wind_direction_10m + 180}deg)`;
  const t = new Date(c.time);
  els.updated.textContent = `Оновлено: ${t.toLocaleString("uk-UA", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}`;
}

function renderHourly(data) {
  const h = data.hourly;
  const now = Date.now();
  const rows = [];
  for (let i = 0; i < h.time.length && rows.length < 24; i++) {
    if (new Date(h.time[i]).getTime() >= now - 30 * 60 * 1000) rows.push(i);
  }
  els.hourly.innerHTML = rows.map((i) => {
    const t = new Date(h.time[i]);
    const f = beaufort(h.wind_speed_10m[i]);
    return `
      <div class="hour">
        <div class="hour__time">${t.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}</div>
        <div class="hour__arrow ${f.cls}" title="${dirName(h.wind_direction_10m[i])}">${windArrow(h.wind_direction_10m[i])}</div>
        <div class="hour__speed ${f.cls}">${fmt(h.wind_speed_10m[i])}</div>
        <div class="hour__unit">м/с</div>
        <div class="hour__gust">↟ ${fmt(h.wind_gusts_10m[i])}</div>
      </div>`;
  }).join("");
}

function renderDaily(data) {
  const d = data.daily;
  els.daily.innerHTML = d.time.map((day, i) => {
    const dt = new Date(day);
    const name = dt.toLocaleDateString("uk-UA", { weekday: "long", day: "numeric", month: "short" });
    const f = beaufort(d.wind_speed_10m_max[i]);
    return `
      <div class="day">
        <div class="day__name">${name}</div>
        <div class="day__row"><span>Макс. вітер</span><b class="${f.cls}">${fmt(d.wind_speed_10m_max[i])} м/с</b></div>
        <div class="day__row"><span>Пориви</span><b class="f-strong">${fmt(d.wind_gusts_10m_max[i])} м/с</b></div>
        <div class="day__row"><span>Напрямок</span><b><span class="day__arrow">${windArrow(d.wind_direction_10m_dominant[i])}</span> ${dirName(d.wind_direction_10m_dominant[i])}</b></div>
      </div>`;
  }).join("");
}

// ---- Відкриття вікна деталізації ----
async function openDetail(point) {
  els.detailTitle.textContent = point.name;
  els.detailBody.hidden = true;
  els.detailStatus.textContent = "Завантаження даних…";
  els.detailStatus.classList.remove("is-error");
  openModal(els.detailModal);

  try {
    const data = await fetchWind(point.lat, point.lon);
    renderCurrent(data);
    renderHourly(data);
    renderDaily(data);
    els.detailStatus.textContent = "";
    els.detailBody.hidden = false;
  } catch (err) {
    console.error(err);
    els.detailStatus.textContent = "Не вдалося завантажити дані. Перевірте зʼєднання.";
    els.detailStatus.classList.add("is-error");
  }
}

// ---- Модальні вікна ----
function openModal(modal) {
  modal.hidden = false;
  if (map) setTimeout(() => map.invalidateSize(), 50);
}
function closeModal(modal) { modal.hidden = true; }

// ---- Налаштування: побудова списку ----
function buildSettings() {
  const selected = getSelectedOblasts();
  els.oblastList.innerHTML = LOCATIONS.map((g) => {
    const checked = selected.includes(g.group);
    return `
      <label class="oblast-item ${checked ? "is-checked" : ""}">
        <input type="checkbox" value="${g.group}" ${checked ? "checked" : ""} />
        <span>${g.group}</span>
        <small>${g.points.length} міст</small>
      </label>`;
  }).join("");
  updateOblastState();

  els.oblastList.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener("change", updateOblastState);
  });
}

function updateOblastState() {
  const boxes = [...els.oblastList.querySelectorAll('input[type="checkbox"]')];
  const checkedCount = boxes.filter((b) => b.checked).length;

  boxes.forEach((b) => {
    const item = b.closest(".oblast-item");
    item.classList.toggle("is-checked", b.checked);
    const disable = !b.checked && checkedCount >= MAX_OBLASTS;
    b.disabled = disable;
    item.classList.toggle("is-disabled", disable);
  });

  els.oblastCounter.textContent = `Обрано ${checkedCount} з ${MAX_OBLASTS}`;
  els.oblastCounter.classList.toggle("is-max", checkedCount >= MAX_OBLASTS);
  els.saveSettings.disabled = checkedCount === 0;
  els.saveSettings.style.opacity = checkedCount === 0 ? ".5" : "1";
}

function handleSaveSettings() {
  const chosen = [...els.oblastList.querySelectorAll('input[type="checkbox"]:checked')].map((b) => b.value);
  if (!chosen.length) return;
  saveSelectedOblasts(chosen);
  renderMarkers();
  closeModal(els.settingsModal);
}

// ---- Ініціалізація ----
function init() {
  initMap();
  renderMarkers();

  els.settingsBtn.addEventListener("click", () => {
    buildSettings();
    openModal(els.settingsModal);
  });
  els.saveSettings.addEventListener("click", handleSaveSettings);

  // Закриття модалок (хрестик, фон)
  document.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", () => {
      const which = el.dataset.close;
      closeModal(which === "settings" ? els.settingsModal : els.detailModal);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(els.settingsModal);
      closeModal(els.detailModal);
    }
  });

  // Якщо області ще не обрані — підказати відкрити налаштування
  if (!localStorage.getItem(STORAGE_KEY)) {
    els.mapHint.textContent = "Натисніть ⚙, щоб обрати області, або клікніть на місто";
  }
}

document.addEventListener("DOMContentLoaded", init);
