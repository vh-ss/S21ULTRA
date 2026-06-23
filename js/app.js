// ===== Мапа вітру: інтерактивна мапа з деталізацією по містах =====
"use strict";

// Вбудовані локації, згруповані за областями.
const BUILTIN_LOCATIONS = [
  {
    group: "Харківська область",
    points: [
      { name: "Харків", lat: 49.9935, lon: 36.2304 },
      { name: "Ізюм", lat: 49.2126, lon: 37.2506 },
      { name: "Куп'янськ", lat: 49.7106, lon: 37.6156 },
      { name: "Чугуїв", lat: 49.8361, lon: 36.6881 },
      { name: "Лозова", lat: 48.8897, lon: 36.3174 },
      { name: "Балаклія", lat: 49.4608, lon: 36.8581 },
      { name: "Богодухів", lat: 50.1631, lon: 35.5278 },
      { name: "Валки", lat: 49.8378, lon: 35.6203 },
      { name: "Вовчанськ", lat: 50.2914, lon: 36.9444 },
      { name: "Дергачі", lat: 50.1106, lon: 36.1208 },
      { name: "Красноград", lat: 49.3781, lon: 35.4419 },
      { name: "Первомайський", lat: 49.3858, lon: 36.2153 },
      { name: "Барвінкове", lat: 48.9078, lon: 37.0250 },
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
      { name: "Горлівка", lat: 48.3336, lon: 38.0925 },
      { name: "Макіївка", lat: 48.0478, lon: 37.9258 },
      { name: "Костянтинівка", lat: 48.5278, lon: 37.7053 },
      { name: "Дружківка", lat: 48.6186, lon: 37.5278 },
      { name: "Авдіївка", lat: 48.1392, lon: 37.7497 },
      { name: "Волноваха", lat: 47.6022, lon: 37.4972 },
      { name: "Лиман", lat: 48.9869, lon: 37.8042 },
      { name: "Святогірськ", lat: 49.0306, lon: 37.5664 },
      { name: "Черкаське", lat: 48.6911, lon: 37.3242 },
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
      { name: "Алчевськ", lat: 48.4708, lon: 38.7972 },
      { name: "Краснодон", lat: 48.2939, lon: 39.7339 },
      { name: "Сватове", lat: 49.4111, lon: 38.1542 },
      { name: "Кремінна", lat: 49.0428, lon: 38.2197 },
      { name: "Щастя", lat: 48.7392, lon: 39.2425 },
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
      { name: "Новомосковськ", lat: 48.6314, lon: 35.2206 },
      { name: "Марганець", lat: 47.6394, lon: 34.6256 },
      { name: "Жовті Води", lat: 48.3486, lon: 33.5042 },
      { name: "Синельникове", lat: 48.3186, lon: 35.5142 },
      { name: "Покров", lat: 47.6586, lon: 34.0750 },
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
      { name: "Пологи", lat: 47.4828, lon: 36.2533 },
      { name: "Василівка", lat: 47.4361, lon: 35.2767 },
      { name: "Оріхів", lat: 47.5683, lon: 35.7864 },
      { name: "Гуляйполе", lat: 47.6608, lon: 36.2622 },
      { name: "Приморськ", lat: 46.7283, lon: 36.3475 },
    ],
  },
  {
    group: "Полтавська область",
    points: [
      { name: "Полтава", lat: 49.5883, lon: 34.5514 },
      { name: "Кременчук", lat: 49.0670, lon: 33.4204 },
      { name: "Лубни", lat: 50.0186, lon: 32.9869 },
      { name: "Миргород", lat: 49.9686, lon: 33.6088 },
      { name: "Горішні Плавні", lat: 49.0119, lon: 33.6500 },
      { name: "Гадяч", lat: 50.3711, lon: 33.9967 },
      { name: "Пирятин", lat: 50.2417, lon: 32.5083 },
      { name: "Карлівка", lat: 49.4561, lon: 35.1278 },
      { name: "Хорол", lat: 49.7836, lon: 33.2728 },
    ],
  },
  {
    group: "Сумська область",
    points: [
      { name: "Суми", lat: 50.9077, lon: 34.7981 },
      { name: "Конотоп", lat: 51.2417, lon: 33.2027 },
      { name: "Охтирка", lat: 50.3100, lon: 34.8990 },
      { name: "Шостка", lat: 51.8730, lon: 33.4795 },
      { name: "Ромни", lat: 50.7461, lon: 33.4747 },
      { name: "Глухів", lat: 51.6781, lon: 33.9136 },
      { name: "Лебедин", lat: 50.5806, lon: 34.4856 },
      { name: "Кролевець", lat: 51.5483, lon: 33.3858 },
      { name: "Тростянець", lat: 50.4828, lon: 34.9628 },
    ],
  },
];

const API = "https://api.open-meteo.com/v1/forecast";
const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const MAX_OBLASTS = 3;
const DEFAULT_OBLASTS = ["Харківська область", "Донецька область"];
const STORAGE_KEY = "windOblasts";
const CUSTOM_KEY = "windCustomCities";
const HIDDEN_KEY = "windHiddenCities";
const CUSTOM_GROUP = "Мої міста";

// ---- Сховище кастомних і прихованих міст ----
function readArray(key) {
  try {
    const a = JSON.parse(localStorage.getItem(key));
    return Array.isArray(a) ? a : [];
  } catch (e) { return []; }
}
function getCustomCities() { return readArray(CUSTOM_KEY); }
function setCustomCities(a) { localStorage.setItem(CUSTOM_KEY, JSON.stringify(a)); }
function getHidden() { return readArray(HIDDEN_KEY); }
function setHidden(a) { localStorage.setItem(HIDDEN_KEY, JSON.stringify(a)); }
function cityKey(group, name) { return `${group}::${name}`; }

// Підсумковий список локацій: вбудовані (без прихованих) + кастомні
function getLocations() {
  const hidden = new Set(getHidden());
  const groups = BUILTIN_LOCATIONS.map((g) => ({
    group: g.group,
    points: g.points.filter((p) => !hidden.has(cityKey(g.group, p.name))),
  }));
  const custom = getCustomCities().filter((p) => !hidden.has(cityKey(CUSTOM_GROUP, p.name)));
  if (custom.length) {
    groups.push({
      group: CUSTOM_GROUP,
      points: custom.map((p) => ({ name: p.name, lat: p.lat, lon: p.lon })),
    });
  }
  return groups.filter((g) => g.points.length);
}

// Пошук міста за назвою (геокодер Open-Meteo)
async function geocode(name) {
  const params = new URLSearchParams({ name, count: "6", language: "uk", format: "json" });
  const res = await fetch(`${GEO_API}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

// Елементи DOM
const els = {
  themeBtn: document.getElementById("themeBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsModal: document.getElementById("settingsModal"),
  oblastList: document.getElementById("oblastList"),
  oblastCounter: document.getElementById("oblastCounter"),
  saveSettings: document.getElementById("saveSettings"),
  citiesBtn: document.getElementById("citiesBtn"),
  citiesModal: document.getElementById("citiesModal"),
  citySearchInput: document.getElementById("citySearchInput"),
  citySearchBtn: document.getElementById("citySearchBtn"),
  citySearchResults: document.getElementById("citySearchResults"),
  cityMapBtn: document.getElementById("cityMapBtn"),
  citiesManageList: document.getElementById("citiesManageList"),
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

let map, markersLayer, tileLayer;
let mapPickActive = false;

// ---- Тема ----
const THEME_KEY = "windTheme";
const TILES = {
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
};
function getTheme() {
  return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
}
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  els.themeBtn.textContent = theme === "light" ? "🌙" : "☀️";
  els.themeBtn.title = theme === "light" ? "Темна тема" : "Світла тема";
  if (tileLayer) tileLayer.setUrl(TILES[theme]);
}
function toggleTheme() {
  const next = getTheme() === "light" ? "dark" : "light";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// ---- Допоміжні функції ----
const COMPASS_16 = [
  "Пн", "Пн-ПнСх", "ПнСх", "Сх-ПнСх", "Сх", "Сх-ПдСх", "ПдСх", "Пд-ПдСх",
  "Пд", "Пд-ПдЗх", "ПдЗх", "Зх-ПдЗх", "Зх", "Зх-ПнЗх", "ПнЗх", "Пн-ПнЗх",
];
function dirName(deg) {
  return COMPASS_16[Math.round((deg % 360) / 22.5) % 16];
}
// Стрілка вказує КУДИ дме вітер (напрямок руху повітря):
// вітер З півночі (0°) рухається на південь → ↓
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

// Колір маркера за швидкістю вітру (м/с)
function forceColor(ms) {
  if (typeof ms !== "number" || Number.isNaN(ms)) return "#8b97ab"; // нейтральний
  if (ms < 3.4) return "#22d3a6";   // штиль/легкий — зелений
  if (ms < 8.0) return "#38bdf8";   // помірний — блакитний
  if (ms < 13.9) return "#fbbf24";  // сильний — жовтий
  return "#f87171";                 // шторм — червоний
}

// Маркер = SVG: кольорове коло зі швидкістю + стрілка напрямку вітру
function makeIcon(point, speed, dir) {
  const color = forceColor(speed);
  const hasSpeed = typeof speed === "number";
  const label = hasSpeed ? fmt(speed, 0) : "";
  // Стрілка показує, КУДИ дме вітер (dir + 180), як на компасі
  const arrow = hasSpeed && typeof dir === "number"
    ? `<g transform="rotate(${dir + 180} 22 22)">
         <line x1="22" y1="19" x2="22" y2="5" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
         <polygon points="22,1 16.5,10 27.5,10" fill="#fff"/>
       </g>`
    : "";
  return L.divIcon({
    className: "city-marker",
    html:
      `<svg class="city-marker__svg" width="44" height="44" viewBox="0 0 44 44">
         ${arrow}
         <circle cx="22" cy="22" r="11" fill="${color}" stroke="#fff" stroke-width="2"/>
         <text x="22" y="26" text-anchor="middle" class="city-marker__num">${label}</text>
       </svg>` +
      `<span class="city-marker__label">${point.name}</span>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

// Пакетний запит поточного вітру (швидкість + напрямок) для всіх точок — один виклик API
async function fetchCurrentBatch(points) {
  const params = new URLSearchParams({
    latitude: points.map((p) => p.lat).join(","),
    longitude: points.map((p) => p.lon).join(","),
    current: "wind_speed_10m,wind_direction_10m",
    wind_speed_unit: "ms",
    timezone: "auto",
  });
  const res = await fetch(`${API}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const arr = Array.isArray(data) ? data : [data];
  return arr.map((d) =>
    d && d.current
      ? { speed: d.current.wind_speed_10m, dir: d.current.wind_direction_10m }
      : {}
  );
}

// ---- Шкала компаса (поділки кожні 5°) ----
function buildCompassDial() {
  const svg = document.getElementById("compassDial");
  if (!svg) return;
  const cx = 100, cy = 100, rOuter = 94;
  let html = "";
  for (let a = 0; a < 360; a += 5) {
    const major = a % 90 === 0;
    const mid = a % 30 === 0;
    const len = major ? 16 : mid ? 11 : 6;
    const rad = (a * Math.PI) / 180;
    const x1 = cx + rOuter * Math.sin(rad), y1 = cy - rOuter * Math.cos(rad);
    const x2 = cx + (rOuter - len) * Math.sin(rad), y2 = cy - (rOuter - len) * Math.cos(rad);
    const cls = major ? "tick tick--major" : mid ? "tick tick--mid" : "tick";
    html += `<line class="${cls}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" />`;
  }
  svg.innerHTML = html;
}

// ---- Мапа ----
function initMap() {
  map = L.map("map", { zoomControl: true, attributionControl: true }).setView([48.7, 37.0], 7);
  tileLayer = L.tileLayer(TILES[getTheme()], {
    attribution: '© OpenStreetMap, © CARTO',
    subdomains: "abcd",
    maxZoom: 18,
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);

  // Додавання міста кліком по мапі
  map.on("click", (e) => {
    if (!mapPickActive) return;
    const name = (window.prompt("Назва нової точки:") || "").trim();
    if (name) addCustomCity({ name, latitude: e.latlng.lat, longitude: e.latlng.lng });
    stopMapPick();
  });
}

function startMapPick() {
  closeModal(els.citiesModal);
  mapPickActive = true;
  map.getContainer().style.cursor = "crosshair";
  els.mapHint.textContent = "Натисніть на мапі, щоб додати місто (Esc — скасувати)";
}
function stopMapPick() {
  mapPickActive = false;
  if (map) map.getContainer().style.cursor = "";
  els.mapHint.textContent = "Натисніть на місто, щоб побачити деталі вітру";
}

async function renderMarkers() {
  markersLayer.clearLayers();
  const selected = getSelectedOblasts();
  const points = [];
  getLocations().filter((g) => selected.includes(g.group)).forEach((g) => {
    g.points.forEach((p) => points.push(p));
  });

  // Спершу нейтральні маркери, щоб мапа була інтерактивна одразу
  const markers = points.map((p) => {
    const m = L.marker([p.lat, p.lon], { icon: makeIcon(p), title: p.name }).addTo(markersLayer);
    m.on("click", () => openDetail(p));
    return { m, p };
  });

  if (points.length) {
    map.fitBounds(points.map((p) => [p.lat, p.lon]), { padding: [60, 60], maxZoom: 9 });
  }
  els.brandSub.textContent = selected.join(" · ");

  // Потім підвантажуємо швидкість і розфарбовуємо
  if (!points.length) return;
  els.mapHint.textContent = "Завантаження вітру…";
  try {
    const wind = await fetchCurrentBatch(points);
    markers.forEach(({ m, p }, i) => m.setIcon(makeIcon(p, wind[i].speed, wind[i].dir)));
    els.mapHint.textContent = "Натисніть на місто, щоб побачити деталі вітру";
  } catch (err) {
    console.error(err);
    els.mapHint.textContent = "Не вдалося завантажити швидкість вітру для мапи";
  }
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
  // Стрілка показує, куди дме вітер (напрямок руху повітря)
  els.arrow.style.transform = `rotate(${c.wind_direction_10m + 180}deg)`;
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
  els.oblastList.innerHTML = getLocations().map((g) => {
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

// ---- Керування містами ----
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function openCities() {
  els.citySearchInput.value = "";
  els.citySearchResults.innerHTML = "";
  buildManageList();
  openModal(els.citiesModal);
}

async function handleCitySearch() {
  const name = els.citySearchInput.value.trim();
  if (!name) return;
  els.citySearchResults.innerHTML = `<p class="search-note">Пошук…</p>`;
  try {
    const results = await geocode(name);
    if (!results.length) {
      els.citySearchResults.innerHTML = `<p class="search-note">Нічого не знайдено. Спробуйте іншу назву або додайте точку на мапі ⬇</p>`;
      return;
    }
    const existing = new Set(getCustomCities().map((c) => c.name));
    els.citySearchResults.innerHTML = results.map((r, i) => {
      const sub = [r.admin1, r.country].filter(Boolean).join(", ");
      const added = existing.has(r.name);
      return `
        <div class="result-item">
          <div class="result-item__info">
            <div class="result-item__name">${escapeHtml(r.name)}</div>
            <div class="result-item__sub">${escapeHtml(sub)}</div>
          </div>
          <button class="result-item__add" data-idx="${i}" ${added ? "disabled" : ""}>${added ? "Додано" : "+ Додати"}</button>
        </div>`;
    }).join("");
    els.citySearchResults.querySelectorAll(".result-item__add").forEach((btn) => {
      btn.addEventListener("click", () => addCustomCity(results[+btn.dataset.idx], btn));
    });
  } catch (err) {
    console.error(err);
    els.citySearchResults.innerHTML = `<p class="search-note is-error">Помилка пошуку. Перевірте зʼєднання.</p>`;
  }
}

function addCustomCity(result, btn) {
  const list = getCustomCities();
  if (list.some((c) => c.name === result.name)) return;
  list.push({ name: result.name, lat: result.latitude, lon: result.longitude });
  setCustomCities(list);
  // Прибрати з прихованих, якщо колись ховали
  setHidden(getHidden().filter((k) => k !== cityKey(CUSTOM_GROUP, result.name)));
  // Увімкнути групу «Мої міста», якщо є вільне місце
  const sel = getSelectedOblasts();
  if (!sel.includes(CUSTOM_GROUP) && sel.length < MAX_OBLASTS) {
    saveSelectedOblasts([...sel, CUSTOM_GROUP]);
  }
  if (btn) { btn.disabled = true; btn.textContent = "Додано"; }
  renderMarkers();
  buildManageList();
}

function removeCity(group, name) {
  if (group === CUSTOM_GROUP) {
    setCustomCities(getCustomCities().filter((c) => c.name !== name));
  } else {
    const hidden = getHidden();
    const key = cityKey(group, name);
    if (!hidden.includes(key)) setHidden([...hidden, key]);
  }
  renderMarkers();
  buildManageList();
}

function restoreCity(group, name) {
  setHidden(getHidden().filter((k) => k !== cityKey(group, name)));
  renderMarkers();
  buildManageList();
}

function buildManageList() {
  const hidden = new Set(getHidden());
  const groups = BUILTIN_LOCATIONS.map((g) => ({ group: g.group, points: g.points, builtin: true }));
  const custom = getCustomCities();
  if (custom.length) groups.push({ group: CUSTOM_GROUP, points: custom, builtin: false });

  els.citiesManageList.innerHTML = groups.map((g) => {
    const rows = g.points.map((p) => {
      const isHidden = hidden.has(cityKey(g.group, p.name));
      const tag = g.builtin ? "" : `<span class="manage-city__tag">моє</span>`;
      const btn = isHidden
        ? `<button class="manage-city__btn manage-city__btn--restore" title="Повернути" data-act="restore" data-group="${escapeHtml(g.group)}" data-name="${escapeHtml(p.name)}">↺</button>`
        : `<button class="manage-city__btn" title="Видалити" data-act="remove" data-group="${escapeHtml(g.group)}" data-name="${escapeHtml(p.name)}">✕</button>`;
      return `
        <div class="manage-city ${isHidden ? "is-hidden" : ""}">
          <span class="manage-city__name">${escapeHtml(p.name)}</span>${tag}${btn}
        </div>`;
    }).join("");
    return `<div class="manage-group"><div class="manage-group__title">${escapeHtml(g.group)}</div>${rows}</div>`;
  }).join("");

  els.citiesManageList.querySelectorAll(".manage-city__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const { act, group, name } = btn.dataset;
      if (act === "remove") removeCity(group, name);
      else restoreCity(group, name);
    });
  });
}

// ---- Ініціалізація ----
function init() {
  buildCompassDial();
  initMap();
  applyTheme(getTheme());
  renderMarkers();

  els.themeBtn.addEventListener("click", toggleTheme);
  els.settingsBtn.addEventListener("click", () => {
    buildSettings();
    openModal(els.settingsModal);
  });
  els.saveSettings.addEventListener("click", handleSaveSettings);

  els.citiesBtn.addEventListener("click", openCities);
  els.citySearchBtn.addEventListener("click", handleCitySearch);
  els.cityMapBtn.addEventListener("click", startMapPick);
  els.citySearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleCitySearch();
  });

  // Закриття модалок (хрестик, фон)
  const modalByKey = {
    settings: els.settingsModal,
    cities: els.citiesModal,
    detail: els.detailModal,
  };
  document.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", () => closeModal(modalByKey[el.dataset.close]));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (mapPickActive) stopMapPick();
      closeModal(els.settingsModal);
      closeModal(els.citiesModal);
      closeModal(els.detailModal);
    }
  });

  // Якщо області ще не обрані — підказати відкрити налаштування
  if (!localStorage.getItem(STORAGE_KEY)) {
    els.mapHint.textContent = "Натисніть ⚙, щоб обрати області, або клікніть на місто";
  }
}

document.addEventListener("DOMContentLoaded", init);
