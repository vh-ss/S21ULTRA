// ===== Трекер вітру: Донецька та Харківська області =====
"use strict";

// Локації, згруповані за областями.
// Донецька та Харківська — основні; решта — суміжні області.
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

// Елементи DOM
const els = {
  select: document.getElementById("locationSelect"),
  refresh: document.getElementById("refreshBtn"),
  status: document.getElementById("status"),
  arrow: document.getElementById("compassArrow"),
  place: document.getElementById("currentPlace"),
  speed: document.getElementById("currentSpeed"),
  dir: document.getElementById("currentDir"),
  gust: document.getElementById("currentGust"),
  force: document.getElementById("currentForce"),
  updated: document.getElementById("currentUpdated"),
  hourly: document.getElementById("hourly"),
  daily: document.getElementById("daily"),
};

// ---- Допоміжні функції ----

// Назва напрямку (звідки дме) за градусами
const COMPASS_16 = [
  "Пн", "Пн-ПнСх", "ПнСх", "Сх-ПнСх", "Сх", "Сх-ПдСх", "ПдСх", "Пд-ПдСх",
  "Пд", "Пд-ПдЗх", "ПдЗх", "Зх-ПдЗх", "Зх", "Зх-ПнЗх", "ПнЗх", "Пн-ПнЗх",
];
function dirName(deg) {
  const i = Math.round(((deg % 360) / 22.5)) % 16;
  return COMPASS_16[i];
}

// Стрілка-емодзі, що показує куди ДМЕ вітер (протилежно до "звідки")
const ARROWS_8 = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
function windArrow(fromDeg) {
  // fromDeg = звідки дме. Куди дме = +180. Емодзі ↑ означає "на північ".
  const i = Math.round((fromDeg % 360) / 45) % 8;
  return ARROWS_8[i];
}

// Класифікація сили вітру за шкалою Бофорта (м/с)
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

function setStatus(msg, isError = false) {
  els.status.textContent = msg || "";
  els.status.classList.toggle("is-error", isError);
}

// ---- Заповнення селектора локацій ----
function buildSelect() {
  LOCATIONS.forEach((g) => {
    const og = document.createElement("optgroup");
    og.label = g.group;
    g.points.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = `${p.lat},${p.lon}`;
      opt.textContent = p.name;
      opt.dataset.name = p.name;
      og.appendChild(opt);
    });
    els.select.appendChild(og);
  });
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

// ---- Рендер поточних умов ----
function renderCurrent(data, placeName) {
  const c = data.current;
  const speed = c.wind_speed_10m;
  const deg = c.wind_direction_10m;
  const gust = c.wind_gusts_10m;
  const force = beaufort(speed);

  els.place.textContent = placeName;
  els.speed.textContent = fmt(speed);
  els.dir.textContent = `${dirName(deg)} (${Math.round(deg)}°)`;
  els.gust.textContent = `${fmt(gust)} м/с`;
  els.force.textContent = force.txt;
  els.force.className = `meta__value ${force.cls}`;

  // Стрілка показує, КУДИ дме вітер: deg = звідки, тож обертаємо на deg+180
  els.arrow.style.transform = `translate(-50%, -50%) rotate(${deg + 180}deg)`;

  const t = new Date(c.time);
  els.updated.textContent = `Оновлено: ${t.toLocaleString("uk-UA", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}`;
}

// ---- Рендер погодинного прогнозу (наступні 24 год) ----
function renderHourly(data) {
  const h = data.hourly;
  const now = Date.now();
  const rows = [];
  for (let i = 0; i < h.time.length; i++) {
    const t = new Date(h.time[i]).getTime();
    if (t >= now - 30 * 60 * 1000) rows.push(i);
    if (rows.length >= 24) break;
  }
  els.hourly.innerHTML = rows
    .map((i) => {
      const t = new Date(h.time[i]);
      const speed = h.wind_speed_10m[i];
      const deg = h.wind_direction_10m[i];
      const gust = h.wind_gusts_10m[i];
      const f = beaufort(speed);
      return `
        <div class="hour">
          <div class="hour__time">${t.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}</div>
          <div class="hour__arrow ${f.cls}" title="${dirName(deg)}">${windArrow(deg)}</div>
          <div class="hour__speed ${f.cls}">${fmt(speed)}</div>
          <div class="hour__unit">м/с</div>
          <div class="hour__gust">↟ ${fmt(gust)}</div>
        </div>`;
    })
    .join("");
}

// ---- Рендер денного прогнозу ----
function renderDaily(data) {
  const d = data.daily;
  els.daily.innerHTML = d.time
    .map((day, i) => {
      const dt = new Date(day);
      const name = dt.toLocaleDateString("uk-UA", { weekday: "long", day: "numeric", month: "short" });
      const maxSpeed = d.wind_speed_10m_max[i];
      const maxGust = d.wind_gusts_10m_max[i];
      const deg = d.wind_direction_10m_dominant[i];
      const f = beaufort(maxSpeed);
      return `
        <div class="day">
          <div class="day__name">${name}</div>
          <div class="day__row"><span>Макс. вітер</span><b class="${f.cls}">${fmt(maxSpeed)} м/с</b></div>
          <div class="day__row"><span>Пориви</span><b class="f-strong">${fmt(maxGust)} м/с</b></div>
          <div class="day__row"><span>Напрямок</span><b><span class="day__arrow">${windArrow(deg)}</span> ${dirName(deg)}</b></div>
        </div>`;
    })
    .join("");
}

// ---- Головна функція завантаження ----
let isLoading = false;
async function load() {
  if (isLoading) return;
  isLoading = true;
  els.refresh.classList.add("is-spinning");
  setStatus("Завантаження даних…");

  const opt = els.select.selectedOptions[0];
  const [lat, lon] = els.select.value.split(",").map(Number);
  const placeName = opt ? opt.dataset.name : "—";

  try {
    const data = await fetchWind(lat, lon);
    renderCurrent(data, placeName);
    renderHourly(data);
    renderDaily(data);
    setStatus("");
    localStorage.setItem("windLocation", els.select.value);
  } catch (err) {
    console.error(err);
    setStatus("Не вдалося завантажити дані. Перевірте зʼєднання та спробуйте оновити.", true);
  } finally {
    isLoading = false;
    els.refresh.classList.remove("is-spinning");
  }
}

// ---- Ініціалізація ----
function init() {
  buildSelect();
  const saved = localStorage.getItem("windLocation");
  if (saved && [...els.select.options].some((o) => o.value === saved)) {
    els.select.value = saved;
  }
  els.select.addEventListener("change", load);
  els.refresh.addEventListener("click", load);
  load();
  // Автооновлення кожні 10 хвилин
  setInterval(load, 10 * 60 * 1000);
}

document.addEventListener("DOMContentLoaded", init);
