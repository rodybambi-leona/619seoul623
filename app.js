// ===== App State =====
let currentTab = "itinerary";
let currentDay = 1;
let checklistState = {}; // { "0-0": true, ... }
let expenses = []; // { id, store, amount_krw, amount_twd, items, category, date, payment, raw }
let dailyBudgetKRW = 0;
let storageReady = false;
let contentTaskState = {}; // { "0-0": true, ... }

const TABS = [
  { id: "itinerary", label: "行程", icon: "🗓️" },
  { id: "common", label: "常用", icon: "🧰" },
  { id: "prep", label: "行前準備", icon: "🎒" },
  { id: "nightlife", label: "夜生活", icon: "🍸" },
  { id: "content", label: "帳號經營", icon: "🎬" },
  { id: "tools", label: "功能", icon: "✨" }
];

// ===== Init =====
function init() {
  renderTabNav();
  loadPersistedData().then(() => {
    renderTab();
  });
}

function renderTabNav() {
  const nav = document.getElementById("tabNav");
  nav.innerHTML = TABS.map(t => `
    <button class="tab-btn ${t.id === currentTab ? 'active' : ''}" data-tab="${t.id}" onclick="switchTab('${t.id}')">
      ${t.icon}<br>${t.label}
    </button>
  `).join("");
}

function switchTab(tabId) {
  currentTab = tabId;
  renderTabNav();
  renderTab();
}

function renderTab() {
  const content = document.getElementById("tabContent");
  switch (currentTab) {
    case "itinerary": content.innerHTML = renderItinerary(); break;
    case "common": content.innerHTML = renderCommon(); break;
    case "prep": content.innerHTML = renderPrep(); attachPrepListeners(); break;
    case "nightlife": content.innerHTML = renderNightlife(); break;
    case "content": content.innerHTML = renderContent(); break;
    case "tools": content.innerHTML = renderTools(); attachToolsListeners(); break;
  }
  window.scrollTo(0, 0);
}

// ===== ITINERARY TAB =====
function renderItinerary() {
  const day = TRIP_DAYS.find(d => d.id === currentDay);
  const pills = TRIP_DAYS.map(d => `
    <button class="day-pill ${d.id === currentDay ? 'active' : ''}" onclick="selectDay(${d.id})">
      Day ${d.id}<span class="pill-date">${d.date}（${d.weekday}）</span>
    </button>
  `).join("");

  const timelineItems = day.items.map(item => renderTimelineItem(item)).join("");

  return `
    ${renderWeatherStrip()}
    <div class="day-pills">${pills}</div>
    <div class="day-route-card">
      <div class="day-route-title">Day ${day.id} · ${day.date}（${day.weekday}）</div>
      <div class="day-route-flow">${day.route.replace(/➔/g, '<span class="arrow">➔</span>')}</div>
    </div>
    <div class="timeline">${timelineItems}</div>
  `;
}

function renderWeatherStrip() {
  const cards = SEOUL_CLIMATE_REFERENCE.map(d => `
    <div class="weather-card">
      <div class="weather-date">${d.label}</div>
      <div class="weather-icon">${d.icon}</div>
      <div class="weather-temp">${d.high}°<span class="lo">/${d.low}°</span></div>
      <div class="weather-desc">${d.desc}</div>
      <div class="weather-rain">☔️ ${d.rainChance}%</div>
    </div>
  `).join("");
  return `
    <div class="section-title" style="margin-top:0;">🌦️ 首爾天氣（6月下旬氣候參考）</div>
    <div class="weather-strip">${cards}</div>
    <div style="font-size:10.5px;color:var(--morandi-brown);margin:-10px 0 18px;line-height:1.5;">
      ⓘ 6月底首爾進入梅雨季，數值為歷年同期平均，僅供打包行李參考。出發前建議再查一次即時預報。
    </div>
  `;
}

function renderTimelineItem(item) {
  const typeClass = item.type === "food" ? "food" : (item.type === "transport" ? "transport" : (item.type === "content" ? "content" : (item.type === "note" ? "note" : "")));
  const titleClass = item.type === "food" ? "food-title" : (item.type === "content" ? "content-title" : "");
  const cardClass = item.type === "content" ? "content-card" : "";
  const timeTag = item.time ? `<span class="timeline-time">⏰ ${item.time}</span><br>` : "";
  const desc = item.desc ? `<div class="card-desc">${escapeHtml(item.desc)}</div>` : "";
  const linkClass = (item.link && item.link.includes("naver")) ? "naver" : "";
  const link = item.link ? `<a class="card-link ${linkClass}" href="${item.link}" target="_blank" rel="noopener">📍 查看地圖</a>` : "";
  const icon = item.type === "food" ? "🍴" : (item.type === "shop" ? "🛍️" : (item.type === "content" ? "📹" : (item.type === "transport" ? "🚗" : "📌")));

  return `
    <div class="timeline-item ${typeClass}">
      <div class="timeline-dot"></div>
      ${timeTag}
      <div class="card ${cardClass}">
        <div class="card-title ${titleClass}">${icon} ${escapeHtml(item.title)}</div>
        ${desc}
        ${link}
      </div>
    </div>
  `;
}

function selectDay(id) {
  currentDay = id;
  renderTab();
}

// ===== COMMON TAB =====
function renderCommon() {
  return `
    <div class="section-title">💻 匯率換算器</div>
    <div class="tool-card">
      <div class="tool-label">韓鍰（KRW）</div>
      <input type="number" class="tool-input" id="krwInput" placeholder="輸入韓元金額" oninput="convertCurrency('krw')">
      <div class="swap-result" id="twdResult">= 0<span class="unit">台幣 NTD</span></div>
      <div style="font-size:11px;color:var(--morandi-brown);margin-top:10px;">匯率：46.7 韓元 = 1 台幣</div>
    </div>

    <div class="section-title brown">🏠 住宿</div>
    <div class="card" style="margin-bottom:18px;">
      <div class="card-desc">${COMMON_INFO.accommodation.address}</div>
      <a class="card-link naver" href="${COMMON_INFO.accommodation.link}" target="_blank" rel="noopener">📍 查看地圖</a>
    </div>

    <div class="section-title red">✈️ 班機資訊</div>
    ${COMMON_INFO.flights.map(f => `
      <div class="card" style="margin-bottom:10px;">
        <div class="info-row" style="padding:4px 0;border:none;">
          <div class="info-row-label">${f.date}</div>
          <div class="info-row-value" style="font-weight:700;color:var(--deep-red);">${f.flight}</div>
        </div>
        <div class="card-desc" style="margin-top:4px;">${f.note}</div>
      </div>
    `).join("")}
    <a class="card-link" href="https://www.flightaware.com/live/flight/BR170" target="_blank" rel="noopener" style="margin-bottom:6px;">🔎 預覽 BR170 航班</a><br>
    <a class="card-link" href="https://www.flightaware.com/live/flight/BR159" target="_blank" rel="noopener">🔎 預覽 BR159 航班</a>
  `;
}

function convertCurrency(source) {
  const krwInput = document.getElementById("krwInput");
  const krw = parseFloat(krwInput.value) || 0;
  const twd = krw / EXCHANGE_RATE;
  document.getElementById("twdResult").innerHTML = `= ${twd.toLocaleString(undefined, {maximumFractionDigits: 1})}<span class="unit">台幣 NTD</span>`;
}

// ===== PREP TAB =====
function renderPrep() {
  const sections = PREP_CHECKLIST.map((cat, catIdx) => {
    const itemsHtml = cat.items.map((item, itemIdx) => {
      const key = `${catIdx}-${itemIdx}`;
      const checked = checklistState[key];
      const link = item.link ? `<a href="${item.link}" target="_blank" rel="noopener" style="font-size:11px;color:var(--deep-blue);">🔗 開啟連結</a>` : "";
      return `
        <div class="checklist-item">
          <div class="checklist-checkbox ${checked ? 'checked' : ''}" data-key="${key}" onclick="toggleCheck('${key}')"></div>
          <div>
            <div class="checklist-text ${checked ? 'checked-text' : ''}">${escapeHtml(item.text)}</div>
            ${item.sub ? `<div class="checklist-sub">${escapeHtml(item.sub)}</div>` : ""}
            ${link}
          </div>
        </div>
      `;
    }).join("");
    return `
      <div class="section-title ${catIdx % 2 === 0 ? '' : 'brown'}">${categoryIcon(cat.category)} ${cat.category}</div>
      <div class="card" style="margin-bottom:6px;">${itemsHtml}</div>
    `;
  }).join("");

  const total = PREP_CHECKLIST.reduce((sum, c) => sum + c.items.length, 0);
  const done = Object.values(checklistState).filter(Boolean).length;

  return `
    <div class="dash-stat" style="margin-bottom:18px;">
      <div class="dash-stat-label">準備進度</div>
      <div class="dash-stat-value">${done} / ${total}</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${total ? (done/total*100) : 0}%"></div></div>
    </div>
    ${sections}
  `;
}

function categoryIcon(cat) {
  const map = { "電子產品": "🔌", "證件 / 申請": "📋", "金融 / 預算": "💰", "衣物 / 個人用品": "👜", "其他": "📦" };
  return map[cat] || "✅";
}

function toggleCheck(key) {
  checklistState[key] = !checklistState[key];
  persistChecklist();
  renderTab();
}

function attachPrepListeners() {}

// ===== CONTENT TAB (帳號經營) =====
function renderContent() {
  const totalAll = CONTENT_TASKS.reduce((s, c) => s + c.items.length, 0);
  const doneAll = Object.values(contentTaskState).filter(Boolean).length;

  const sections = CONTENT_TASKS.map((group, gIdx) => {
    const doneCount = group.items.filter((_, i) => contentTaskState[`${gIdx}-${i}`]).length;
    const itemsHtml = group.items.map((item, iIdx) => {
      const key = `${gIdx}-${iIdx}`;
      const checked = contentTaskState[key];
      return `
        <div class="checklist-item">
          <div class="checklist-checkbox ${checked ? 'checked' : ''}" data-key="${key}" onclick="toggleContentCheck('${key}')"></div>
          <div class="checklist-text ${checked ? 'checked-text' : ''}">${escapeHtml(item.text)}</div>
        </div>
      `;
    }).join("");

    return `
      <div class="content-task-card">
        <div class="content-task-header">
          <span class="content-task-icon">${group.icon}</span>
          <span class="content-task-title">${escapeHtml(group.title)}</span>
          <span class="content-task-count">${doneCount}/${group.items.length}</span>
        </div>
        <div class="card-desc" style="margin-bottom:10px;">${escapeHtml(group.desc)}</div>
        ${itemsHtml}
      </div>
    `;
  }).join("");

  return `
    <div class="dash-stat" style="margin-bottom:18px;">
      <div class="dash-stat-label">素材拍攝總進度</div>
      <div class="dash-stat-value">${doneAll} / ${totalAll}</div>
      <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${totalAll ? (doneAll/totalAll*100) : 0}%"></div></div>
    </div>
    ${sections}
  `;
}

function toggleContentCheck(key) {
  contentTaskState[key] = !contentTaskState[key];
  persistContentTasks();
  renderTab();
}

// ===== NIGHTLIFE TAB =====
function renderNightlife() {
  const areas = [...new Set(NIGHTLIFE.map(v => v.area))];
  return areas.map(area => {
    const venues = NIGHTLIFE.filter(v => v.area === area);
    return `
      <div class="section-title red">📍 ${area}</div>
      ${venues.map(v => `
        <div class="venue-card">
          <div class="venue-area-tag">${v.area}</div>
          <div class="venue-name">${escapeHtml(v.name)}</div>
          <div class="venue-desc">${escapeHtml(v.desc)}</div>
          <a class="venue-link" href="${v.link}" target="_blank" rel="noopener">📍 查看地圖</a>
        </div>
      `).join("")}
    `;
  }).join("");
}

// ===== TOOLS TAB (functions: receipt OCR, dashboard, stats) =====
function renderTools() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const totalKRW = expenses.reduce((s, e) => s + e.amount_krw, 0);
  const todayKRW = expenses.filter(e => e.date === todayStr).reduce((s, e) => s + e.amount_krw, 0);
  const totalTWD = totalKRW / EXCHANGE_RATE;
  const todayTWD = todayKRW / EXCHANGE_RATE;

  // category breakdown
  const catTotals = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount_krw; });
  const catEntries = Object.entries(catTotals).sort((a,b) => b[1]-a[1]);

  // payment breakdown
  const payTotals = {};
  expenses.forEach(e => { payTotals[e.payment || "未填寫"] = (payTotals[e.payment || "未填寫"] || 0) + e.amount_krw; });

  // top 10
  const top10 = [...expenses].sort((a,b) => b.amount_krw - a.amount_krw).slice(0, 10);

  // daily trend
  const dayTotals = {};
  expenses.forEach(e => { dayTotals[e.date] = (dayTotals[e.date] || 0) + e.amount_krw; });
  const sortedDays = Object.keys(dayTotals).sort();

  return `
    <div class="func-card">
      <div class="func-card-title">🧾 手動記帳</div>
      <div class="func-card-desc">輸入店名、金額、類別，快速記錄這趟旅程的花費</div>
    </div>

    <div class="tool-card">
      <div class="tool-label">店名</div>
      <input type="text" class="tool-input" id="manualStore" placeholder="例如：利庭園燒肉" style="margin-bottom:12px;">

      <div class="tool-label">金額（韓元 KRW）</div>
      <input type="number" class="tool-input" id="manualAmount" placeholder="例如：35000" style="margin-bottom:12px;">

      <div class="tool-label">類別</div>
      <select class="tool-input" id="manualCategory" style="margin-bottom:12px;">
        ${EXPENSE_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("")}
      </select>

      <div class="tool-label">日期</div>
      <input type="date" class="tool-input" id="manualDate" min="2026-06-19" max="2026-06-23" value="${new Date().toISOString().slice(0,10)}" style="margin-bottom:12px;">

      <div class="tool-label">支付方式</div>
      <select class="tool-input" id="manualPayment" style="margin-bottom:14px;">
        <option value="現金">現金</option>
        <option value="信用卡">信用卡</option>
      </select>

      <button class="btn-primary" style="width:100%;padding:12px;font-size:14px;" onclick="addManualExpense()">新增紀錄</button>
    </div>
    <div id="ocrStatus"></div>

    <div class="section-title">📊 即時 Dashboard</div>
    <div class="dash-grid">
      <div class="dash-stat">
        <div class="dash-stat-label">今日花費</div>
        <div class="dash-stat-value red">₩${todayKRW.toLocaleString()}</div>
        <div class="dash-stat-sub">≈ NT$${todayTWD.toFixed(0)}</div>
      </div>
      <div class="dash-stat">
        <div class="dash-stat-label">旅程累計</div>
        <div class="dash-stat-value">₩${totalKRW.toLocaleString()}</div>
        <div class="dash-stat-sub">≈ NT$${totalTWD.toFixed(0)}</div>
      </div>
    </div>

    <div class="tool-card">
      <div class="tool-label">💰 現金預算進度</div>
      <input type="number" class="tool-input" id="budgetInput" placeholder="設定現金預算（韓元）" value="${dailyBudgetKRW || ''}" oninput="setBudget(this.value)">
      ${dailyBudgetKRW ? `
        <div style="margin-top:10px;font-size:13px;color:var(--deep-brown);">已花費 ₩${totalKRW.toLocaleString()} / 預算 ₩${dailyBudgetKRW.toLocaleString()}</div>
        <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${Math.min(100, totalKRW/dailyBudgetKRW*100)}%; background:${totalKRW > dailyBudgetKRW ? 'var(--deep-red)' : ''}"></div></div>
      ` : `<div style="margin-top:8px;font-size:11px;color:var(--morandi-brown);">設定預算後可追蹤花費進度</div>`}
    </div>

    <div class="section-title brown">📈 統計分析</div>

    ${sortedDays.length > 0 ? `
      <div class="card" style="margin-bottom:14px;">
        <div class="card-title">每日花費趨勢</div>
        ${sortedDays.map(d => {
          const max = Math.max(...Object.values(dayTotals));
          const pct = max ? (dayTotals[d] / max * 100) : 0;
          return `
            <div style="margin:10px 0;">
              <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--deep-brown);margin-bottom:3px;">
                <span>${d}</span><span>₩${dayTotals[d].toLocaleString()}</span>
              </div>
              <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
            </div>
          `;
        }).join("")}
      </div>
    ` : ""}

    ${catEntries.length > 0 ? `
      <div class="card" style="margin-bottom:14px;">
        <div class="card-title">類別佔比</div>
        ${catEntries.map(([cat, amt]) => {
          const pct = totalKRW ? (amt/totalKRW*100) : 0;
          return `
            <div style="margin:10px 0;">
              <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--deep-brown);margin-bottom:3px;">
                <span>${cat}</span><span>${pct.toFixed(0)}% · ₩${amt.toLocaleString()}</span>
              </div>
              <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
            </div>
          `;
        }).join("")}
      </div>
    ` : ""}

    ${Object.keys(payTotals).length > 0 ? `
      <div class="card" style="margin-bottom:14px;">
        <div class="card-title">支付方式分布</div>
        ${Object.entries(payTotals).map(([pay, amt]) => `
          <div class="info-row">
            <div class="info-row-label">${pay}</div>
            <div class="info-row-value">₩${amt.toLocaleString()}</div>
          </div>
        `).join("")}
      </div>
    ` : ""}

    ${top10.length > 0 ? `
      <div class="card" style="margin-bottom:18px;">
        <div class="card-title">TOP 10 消費</div>
        ${top10.map((e, i) => `
          <div class="info-row">
            <div class="info-row-label">${i+1}. ${escapeHtml(e.store)}</div>
            <div class="info-row-value" style="font-weight:700;color:var(--deep-red);">₩${e.amount_krw.toLocaleString()}</div>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <div class="section-title red">🧾 消費紀錄</div>
    ${expenses.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state-icon">🧾</div>
        <div class="empty-state-text">還沒有消費紀錄<br>填寫上方表單開始記帳吧</div>
      </div>
    ` : [...expenses].reverse().map(e => `
      <div class="expense-item">
        <div class="expense-top">
          <div class="expense-store">${escapeHtml(e.store)}</div>
          <div class="expense-amount">₩${e.amount_krw.toLocaleString()}</div>
        </div>
        <div class="expense-meta">${e.date}${e.area ? " · " + e.area : ""}${e.payment ? " · " + e.payment : ""}</div>
        <span class="expense-cat-tag">${e.category}</span>
        <button onclick="deleteExpense('${e.id}')" style="background:none;border:none;color:var(--morandi-brown);font-size:11px;float:right;cursor:pointer;">刪除</button>
      </div>
    `).join("")}
  `;
}

function attachToolsListeners() {}

function setBudget(val) {
  dailyBudgetKRW = parseFloat(val) || 0;
  persistBudget();
}

// ===== Manual expense entry =====
function addManualExpense() {
  const store = document.getElementById("manualStore").value.trim();
  const amount = parseFloat(document.getElementById("manualAmount").value);
  const category = document.getElementById("manualCategory").value;
  const date = document.getElementById("manualDate").value;
  const payment = document.getElementById("manualPayment").value;

  const statusEl = document.getElementById("ocrStatus");

  if (!store) {
    statusEl.innerHTML = `<div class="card" style="margin-bottom:16px;border-color:var(--deep-red);"><div style="font-size:12px;color:var(--deep-red);font-weight:700;">⚠️ 請輸入店名</div></div>`;
    return;
  }
  if (!amount || amount <= 0) {
    statusEl.innerHTML = `<div class="card" style="margin-bottom:16px;border-color:var(--deep-red);"><div style="font-size:12px;color:var(--deep-red);font-weight:700;">⚠️ 請輸入有效金額</div></div>`;
    return;
  }

  const expense = {
    id: "exp_" + Date.now(),
    store,
    amount_krw: amount,
    items: [],
    category,
    payment,
    date: date || new Date().toISOString().slice(0, 10),
    area: detectAreaForDate(date)
  };

  expenses.push(expense);
  persistExpenses();
  statusEl.innerHTML = `<div class="card" style="margin-bottom:16px;border-color:var(--morandi-blue);"><div style="font-size:12px;color:var(--deep-blue);font-weight:700;">✅ 已新增消費紀錄</div></div>`;
  renderTab();
}

// 根據日期自動判斷該天的旅程地區（依行程資料推斷主要地區）
function detectAreaForDate(dateStr) {
  const dayAreaMap = {
    "2026-06-19": "明洞 / 弘大",
    "2026-06-20": "漢南洞 / 聖水洞",
    "2026-06-21": "狎鷗亭 / 東大門",
    "2026-06-22": "南大門 / 梨泰院",
    "2026-06-23": "新堂洞"
  };
  return dayAreaMap[dateStr] || "";
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  persistExpenses();
  renderTab();
}

// ===== Persistence (localStorage — works in any browser) =====
const STORAGE_PREFIX = "seoul-trip:";

async function loadPersistedData() {
  try {
    const c = localStorage.getItem(STORAGE_PREFIX + "checklist-state");
    if (c) checklistState = JSON.parse(c);
  } catch (e) { /* not found, fine */ }

  try {
    const e = localStorage.getItem(STORAGE_PREFIX + "expenses-list");
    if (e) expenses = JSON.parse(e);
  } catch (e) { /* not found, fine */ }

  try {
    const b = localStorage.getItem(STORAGE_PREFIX + "daily-budget");
    if (b) dailyBudgetKRW = JSON.parse(b);
  } catch (e) { /* not found, fine */ }

  try {
    const ct = localStorage.getItem(STORAGE_PREFIX + "content-task-state");
    if (ct) contentTaskState = JSON.parse(ct);
  } catch (e) { /* not found, fine */ }

  storageReady = true;
}

async function persistChecklist() {
  try { localStorage.setItem(STORAGE_PREFIX + "checklist-state", JSON.stringify(checklistState)); }
  catch (e) { console.error("persist checklist failed", e); }
}

async function persistExpenses() {
  try { localStorage.setItem(STORAGE_PREFIX + "expenses-list", JSON.stringify(expenses)); }
  catch (e) { console.error("persist expenses failed", e); }
}

async function persistBudget() {
  try { localStorage.setItem(STORAGE_PREFIX + "daily-budget", JSON.stringify(dailyBudgetKRW)); }
  catch (e) { console.error("persist budget failed", e); }
}

async function persistContentTasks() {
  try { localStorage.setItem(STORAGE_PREFIX + "content-task-state", JSON.stringify(contentTaskState)); }
  catch (e) { console.error("persist content tasks failed", e); }
}

// ===== Utils =====
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

init();
