// ---------- helpers ----------
const $ = id => document.getElementById(id);
const commas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const num = v => parseFloat(v) || 0;

// ---------- tabs ----------
const TOOLMETA = {
  commission: ['💰', 'Commission', 'Phí commission & point tối thiểu để thắng'],
  rr: ['📊', 'Risk / Reward', 'Kỳ vọng lợi nhuận & win rate tối thiểu'],
  laikep: ['📈', 'Lãi Kép', 'Mô phỏng lãi kép, nạp/rút & tính từ mục tiêu'],
  percent: ['%', 'Percentage', 'Phần trăm cơ bản, thay đổi & chênh lệch'],
  bmi: ['⚖️', 'BMI', 'Chỉ số khối cơ thể & phân loại sức khỏe'],
  amlich: ['🌙', 'Âm Lịch', 'Đổi âm–dương, can chi & giờ 12 con giáp'],
  counter: ['🔤', 'Text Counter', 'Đếm ký tự / từ và đổi kiểu chữ']
};
function updateTopbar(v) {
  const m = TOOLMETA[v]; if (!m) return;
  $('tb_icon').textContent = m[0]; $('tb_title').textContent = m[1]; $('tb_desc').textContent = m[2];
}
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
  if (!t.dataset.view) return;                 // docs link — let it navigate
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.view').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  $(t.dataset.view).classList.add('active');
  updateTopbar(t.dataset.view);
}));
document.querySelectorAll('.subtab').forEach(t => t.addEventListener('click', () => {
  const scope = t.closest('.view');
  scope.querySelectorAll('.subtab').forEach(x => x.classList.remove('active'));
  scope.querySelectorAll('.subview').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  $(t.dataset.sub).classList.add('active');
}));

// ---------- Commission (from main.cpp) ----------
function calcCommission() {
  const tick = num($('c_tick').value);
  const comPerLot = num($('c_com').value);
  const lot = num($('c_lot').value);
  const microCom = comPerLot * 0.01;
  const commission = microCom * (lot / 0.01);
  const minPoint = tick ? (commission / tick) + 1 : 0;
  $('c_out_com').textContent = commission.toFixed(4);
  $('c_out_pt').textContent = (Math.floor(minPoint * 100) / 100).toFixed(2);
}
['c_tick','c_com','c_lot'].forEach(id => $(id).addEventListener('input', calcCommission));
calcCommission();

// ---------- Risk/Reward (from main.py) ----------
function calcRR() {
  const wr = num($('r_wr').value) / 100;
  const risk = num($('r_risk').value);
  const reward = num($('r_reward').value);
  const profit = (wr * reward) - ((1 - wr) * risk);
  $('r_rr').textContent = `${risk} : ${reward}`;
  const el = $('r_profit');
  el.textContent = `${profit.toFixed(3)} R`;
  el.className = 'v ' + (profit >= 0 ? 'pos' : 'neg');
}
['r_wr','r_risk','r_reward'].forEach(id => $(id).addEventListener('input', calcRR));
calcRR();

function calcMinWR() {
  const risk = num($('m_risk').value);
  const reward = num($('m_reward').value);
  const profit = num($('m_profit').value);
  const minWR = (reward + risk) ? (profit + risk) / (reward + risk) : 0;
  $('m_out').textContent = (minWR * 100).toFixed(2) + '%';
}
['m_risk','m_reward','m_profit'].forEach(id => $(id).addEventListener('input', calcMinWR));
calcMinWR();

// ---------- Lãi Kép (from js.js) ----------
const lkTable = $('lk_table');
const lkStats = $('lk_stats');
const lkWrap = $('lk_tablewrap');

function showLkTable() { lkWrap.style.display = 'block'; }

// two-way link target <-> percent
const initInput = $('lk2_money'), targetIn = $('lk2_target'), percentIn = $('lk2_percent');
function syncPercent() {
  const iv = num(initInput.value);
  percentIn.value = iv ? (((num(targetIn.value) - iv) / iv) * 100).toFixed(2) : '';
}
targetIn.addEventListener('input', syncPercent);
percentIn.addEventListener('input', () => {
  const iv = num(initInput.value);
  targetIn.value = (iv + iv * num(percentIn.value) / 100).toFixed(2);
});
syncPercent();

// Table 1
$('lk_submit').addEventListener('click', () => {
  const firstMoney = num($('lk_money').value);
  let money = firstMoney;
  const interest = num($('lk_interest').value);
  const adding = num($('lk_adding').value);
  let addingNum = num($('lk_addingNum').value);
  const period = num($('lk_period').value);
  const withdraw = num($('lk_withdraw').value);
  const startWithdraw = parseInt($('lk_startWithdraw').value) - 1;
  if (addingNum === -1) addingNum = period;

  let rows = '<thead><tr><th>Kỳ</th><th>Vốn</th><th>Tổng Lãi</th><th>Rút</th></tr></thead><tbody>';
  let totalProfit = 0, totalBank = 0, allDeposit = firstMoney;

  function step(time) {
    let m = money, bank = 0, addingMoney = 0;
    for (let i = 0; i < time; i++) {
      addingMoney = (i > 0) ? adding : 0;
      if (i >= addingNum) addingMoney = 0;
      const cash = m * interest / 100;
      bank = (i >= startWithdraw) ? cash * withdraw / 100 : 0;
      m += cash - bank + addingMoney;
      totalBank += bank;
      totalProfit = m - firstMoney - (addingMoney * i);
    }
    allDeposit += addingMoney;
    const gain = ((m - firstMoney - adding * (time - 1)) * 100 / firstMoney).toFixed(2);
    rows += `<tr><td>${time}</td><td>${commas(m.toFixed(2))}</td><td>${commas(gain)}%</td><td>${commas(bank.toFixed(2))}</td></tr>`;
  }
  // reset accumulators per full run
  totalBank = 0;
  for (let i = 1; i <= period; i++) step(i);
  rows += '</tbody>';
  lkTable.innerHTML = rows;
  showLkTable();

  lkStats.style.display = 'block';
  lkStats.innerHTML = `
    <div class="row"><span>Vốn Ban Đầu</span><span>${commas(firstMoney)}</span></div>
    <div class="row"><span>Tổng Tiền Gửi</span><span>${commas(allDeposit)}</span></div>
    <div class="row"><span>Quá Trình</span><span>${commas(period)} Kỳ</span></div>
    <div class="row"><span>Lãi Suất</span><span>${commas(interest)}%</span></div>
    <div class="row"><span>Lãi/Vốn Tổng</span><span>${commas(totalProfit.toFixed(2))}</span></div>
    <div class="row"><span>Hiệu Suất Lãi/Vốn Tổng</span><span>${commas((totalProfit * 100 / allDeposit).toFixed(2))}%</span></div>
    <div class="row"><span>Hiệu Suất Lãi/Vốn Đầu</span><span>${commas((totalProfit * 100 / firstMoney).toFixed(2))}%</span></div>
    <div class="row"><span>Tổng Đã Rút</span><span>${commas(totalBank.toFixed(2))}</span></div>`;
});

// Table 2
$('lk2_submit').addEventListener('click', () => {
  const initial = num($('lk2_money').value);
  const target = num($('lk2_target').value);
  const days = num($('lk2_period').value);
  if (!initial || !days) return;
  const dailyFactor = Math.pow(target / initial, 1 / days);
  const dailyIncrease = (dailyFactor - 1) * 100;
  let current = initial;

  let rows = '<thead><tr><th>Kỳ</th><th>Vốn</th><th>Cần</th><th>%</th></tr></thead><tbody>';
  for (let i = 1; i <= days; i++) {
    const dailyAmount = current * dailyFactor - current;
    current += dailyAmount;
    rows += `<tr><td>${i}</td><td>${commas(current.toFixed(2))}</td><td>${commas(dailyAmount.toFixed(2))}</td><td>${commas(dailyIncrease.toFixed(3))}%</td></tr>`;
  }
  rows += '</tbody>';
  lkTable.innerHTML = rows;
  showLkTable();
  lkStats.style.display = 'block';
  lkStats.innerHTML = `
    <div class="row"><span>Vốn Ban Đầu</span><span>${commas(initial)}</span></div>
    <div class="row"><span>Mục Tiêu</span><span>${commas(target)}</span></div>
    <div class="row"><span>Kỳ Hạn</span><span>${commas(days)} Kỳ</span></div>
    <div class="row"><span>% mỗi kỳ</span><span>${dailyIncrease.toFixed(3)}%</span></div>`;
});

// ---------- Percentage (calculator.net style) ----------
const fmt = n => Number.isFinite(n) ? (+n.toFixed(4)).toLocaleString('en-US') : '—';

function pc1() { $('p1_out').textContent = fmt(num($('p1_a').value) / 100 * num($('p1_b').value)); }        // P% of B
function pc2() { const b = num($('p2_b').value); $('p2_out').textContent = b ? fmt(num($('p2_a').value) / b * 100) : '—'; } // A is what % of B
function pc3() { const p = num($('p3_b').value); $('p3_out').textContent = p ? fmt(num($('p3_a').value) / (p / 100)) : '—'; } // A is P% of what
['p1_a','p1_b'].forEach(id => $(id).addEventListener('input', pc1));
['p2_a','p2_b'].forEach(id => $(id).addEventListener('input', pc2));
['p3_a','p3_b'].forEach(id => $(id).addEventListener('input', pc3));
pc1(); pc2(); pc3();

function pcChange() {
  const v1 = num($('pc_from').value), v2 = num($('pc_to').value);
  const el = $('pc_change');
  if (!v1) { el.textContent = '—'; el.className = 'v'; return; }
  const ch = (v2 - v1) / Math.abs(v1) * 100;
  el.textContent = (ch >= 0 ? '+' : '') + fmt(ch) + '%';
  el.className = 'v ' + (ch >= 0 ? 'pos' : 'neg');
}
['pc_from','pc_to'].forEach(id => $(id).addEventListener('input', pcChange));
pcChange();

function pcDiff() {
  const a = num($('pd_a').value), b = num($('pd_b').value);
  const avg = (a + b) / 2;
  $('pd_out').textContent = avg ? fmt(Math.abs(a - b) / Math.abs(avg) * 100) + '%' : '—';
}
['pd_a','pd_b'].forEach(id => $(id).addEventListener('input', pcDiff));
pcDiff();

// ---------- BMI (calculator.net) ----------
function bmiCategory(b) {
  if (b < 16) return ['Gầy độ III', 'neg'];
  if (b < 17) return ['Gầy độ II', 'neg'];
  if (b < 18.5) return ['Gầy độ I', 'neg'];
  if (b < 25) return ['Bình thường', 'pos'];
  if (b < 30) return ['Thừa cân', 'blue'];
  if (b < 35) return ['Béo phì I', 'neg'];
  if (b < 40) return ['Béo phì II', 'neg'];
  return ['Béo phì III', 'neg'];
}
function calcBMI() {
  let hM, kg;
  if ($('bmi_metric').classList.contains('active')) {
    hM = num($('bmi_cm').value) / 100;
    kg = num($('bmi_kg').value);
  } else {
    hM = (num($('bmi_ft').value) * 12 + num($('bmi_in').value)) * 0.0254;
    kg = num($('bmi_lb').value) * 0.45359237;
  }
  if (!hM || !kg) { $('bmi_val').textContent = '—'; $('bmi_cat').textContent = '—'; $('bmi_range').textContent = '—'; return; }
  const bmi = kg / (hM * hM);
  const [cat, cls] = bmiCategory(bmi);
  $('bmi_val').textContent = bmi.toFixed(1);
  const cEl = $('bmi_cat'); cEl.textContent = cat; cEl.className = 'v ' + cls;
  const lo = (18.5 * hM * hM), hi = (25 * hM * hM);
  const metric = $('bmi_metric').classList.contains('active');
  const unit = metric ? 'kg' : 'lb', f = metric ? 1 : 1 / 0.45359237;
  $('bmi_range').textContent = `${(lo * f).toFixed(1)}–${(hi * f).toFixed(1)} ${unit}`;
  // scale bar
  const segs = [['Gầy', '#3fb950', 18.5], ['Bình thường', '#2f81f7', 25], ['Thừa cân', '#d29922', 30], ['Béo phì', '#f85149', 40]];
  const min = 15, max = 40, span = max - min;
  let bars = '<div class="bmi-bar">';
  let prev = min;
  segs.forEach(([lbl, col, end]) => { bars += `<span style="background:${col};flex:${(end - prev) / span}">${lbl}</span>`; prev = end; });
  bars += '</div>';
  const pos = Math.max(0, Math.min(100, (bmi - min) / span * 100));
  bars += `<div class="bmi-mark"><i style="left:${pos}%">▲</i></div>`;
  $('bmi_scale').innerHTML = bars;
}
['bmi_cm','bmi_kg','bmi_ft','bmi_in','bmi_lb'].forEach(id => $(id).addEventListener('input', calcBMI));
document.querySelectorAll('[data-sub^="bmi_"]').forEach(b => b.addEventListener('click', () => setTimeout(calcBMI, 0)));
calcBMI();

// ---------- Âm lịch (thuật toán Hồ Ngọc Đức, public domain) ----------
const TZ = 7;
const CAN = ["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
const CHI = ["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
const TIETKHI = ["Xuân phân","Thanh minh","Cốc vũ","Lập hạ","Tiểu mãn","Mang chủng","Hạ chí","Tiểu thử","Đại thử","Lập thu","Xử thử","Bạch lộ","Thu phân","Hàn lộ","Sương giáng","Lập đông","Tiểu tuyết","Đại tuyết","Đông chí","Tiểu hàn","Đại hàn","Lập xuân","Vũ thủy","Kinh trập"];
const INT = Math.floor;
function jdFromDate(dd, mm, yy) {
  const a = INT((14 - mm) / 12), y = yy + 4800 - a, m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  return jd;
}
function jdToDate(jd) {
  let a, b, c;
  if (jd > 2299160) { a = jd + 32044; b = INT((4 * a + 3) / 146097); c = a - INT((b * 146097) / 4); }
  else { b = 0; c = jd + 32082; }
  const d = INT((4 * c + 3) / 1461), e = c - INT((1461 * d) / 4), m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1, month = m + 3 - 12 * INT(m / 10), year = b * 100 + d - 4800 + INT(m / 10);
  return [day, month, year];
}
function NewMoon(k) {
  const T = k / 1236.85, T2 = T * T, T3 = T2 * T, dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr) - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr)) - 0.0074 * Math.sin(dr * (M - Mpr));
  C1 = C1 + 0.0004 * Math.sin(dr * (2 * F + M)) - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  const deltat = (T < -11) ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3 : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return Jd1 + C1 - deltat;
}
function SunLongitude(jdn) {
  const T = (jdn - 2451545.0) / 36525, T2 = T * T, dr = Math.PI / 180;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L = L - Math.PI * 2 * INT(L / (Math.PI * 2));
  return L;
}
function getSunLongitude(dayNumber, tz) { return INT(SunLongitude(dayNumber - 0.5 - tz / 24) / Math.PI * 6); }
function getNewMoonDay(k, tz) { return INT(NewMoon(k) + 0.5 + tz / 24); }
function getLunarMonth11(yy, tz) {
  const off = jdFromDate(31, 12, yy) - 2415021, k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, tz);
  if (getSunLongitude(nm, tz) >= 9) nm = getNewMoonDay(k - 1, tz);
  return nm;
}
function getLeapMonthOffset(a11, tz) {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0, i = 1, arc = getSunLongitude(getNewMoonDay(k + i, tz), tz);
  do { last = arc; i++; arc = getSunLongitude(getNewMoonDay(k + i, tz), tz); } while (arc != last && i < 14);
  return i - 1;
}
function convertSolar2Lunar(dd, mm, yy, tz) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, tz);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, tz);
  let a11 = getLunarMonth11(yy, tz), b11 = a11, lunarYear;
  if (a11 >= monthStart) { lunarYear = yy; a11 = getLunarMonth11(yy - 1, tz); }
  else { lunarYear = yy + 1; b11 = getLunarMonth11(yy + 1, tz); }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = 0, lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, tz);
    if (diff >= leapMonthDiff) { lunarMonth = diff + 10; if (diff == leapMonthDiff) lunarLeap = 1; }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return [lunarDay, lunarMonth, lunarYear, lunarLeap];
}
function yearCanChi(y) { return CAN[(y + 6) % 10] + ' ' + CHI[(y + 8) % 12]; }
function monthCanChi(lm, ly) { return CAN[(ly * 12 + lm + 3) % 10] + ' ' + CHI[(lm + 1) % 12]; }
function dayCanChi(jd) { return CAN[(jd + 9) % 10] + ' ' + CHI[(jd + 1) % 12]; }

function renderAmlich(d) {
  const dd = d.getDate(), mm = d.getMonth() + 1, yy = d.getFullYear();
  const [ld, lm, ly, leap] = convertSolar2Lunar(dd, mm, yy, TZ);
  const jd = jdFromDate(dd, mm, yy);
  $('al_lunar').textContent = `${ld}/${lm}${leap ? ' (nhuận)' : ''}/${ly}`;
  $('al_year').textContent = yearCanChi(ly);
  $('al_month').textContent = monthCanChi(lm, ly);
  $('al_day').textContent = dayCanChi(jd);
  const sl = getSunLongitude(jd + 1, TZ);
  $('al_tiet').textContent = TIETKHI[sl] || '—';
  curJd = jd;
  renderHours();
  renderCalendar(yy, mm, d);
}

let curJd = null;
function renderHours() {
  if (curJd === null) return;
  const dayCanIdx = (curJd + 9) % 10, canGioTy = (dayCanIdx % 5) * 2;
  const ranges = ['23–01','01–03','03–05','05–07','07–09','09–11','11–13','13–15','15–17','17–19','19–21','21–23'];
  // giờ hiện tại theo múi giờ đã chọn
  const tz = parseInt($('al_tz').value);
  const nowH = (new Date().getUTCHours() + tz + 24) % 24;
  const nowChi = INT(((nowH + 1) % 24) / 2) % 12;
  let rows = '<thead><tr><th>Giờ</th><th>Con giáp</th><th>Can Chi</th></tr></thead><tbody>';
  for (let i = 0; i < 12; i++) {
    const now = i === nowChi ? ' class="al-now"' : '';
    rows += `<tr${now}><td>${ranges[i]}</td><td>${CHI[i]}</td><td>${CAN[(canGioTy + i) % 10]} ${CHI[i]}</td></tr>`;
  }
  $('al_hours').innerHTML = rows + '</tbody>';
}
$('al_tz').addEventListener('change', renderHours);

let calY, calM;
function renderCalendar(yy, mm, selDate) {
  calY = yy; calM = mm;
  const first = new Date(yy, mm - 1, 1);
  const startDow = first.getDay();
  const days = new Date(yy, mm, 0).getDate();
  const today = new Date();
  let html = `<div class="cal-nav"><button id="cal_prev">‹</button><span class="m">Tháng ${mm}/${yy}</span><button id="cal_next">›</button></div>`;
  html += '<div class="cal-grid">';
  ['CN','T2','T3','T4','T5','T6','T7'].forEach(d => html += `<div class="dow">${d}</div>`);
  for (let i = 0; i < startDow; i++) html += '<div class="cal-cell empty"></div>';
  for (let d = 1; d <= days; d++) {
    const [ld, lm] = convertSolar2Lunar(d, mm, yy, TZ);
    const isToday = (d === today.getDate() && mm === today.getMonth() + 1 && yy === today.getFullYear());
    const lunTxt = ld === 1 ? `${ld}/${lm}` : ld;
    html += `<div class="cal-cell${isToday ? ' today' : ''}"><div class="sol">${d}</div><div class="lun${ld === 1 ? ' first' : ''}">${lunTxt}</div></div>`;
  }
  html += '</div>';
  $('al_cal').innerHTML = html;
  $('cal_prev').addEventListener('click', () => { let m = calM - 1, y = calY; if (m < 1) { m = 12; y--; } renderCalendar(y, m); });
  $('cal_next').addEventListener('click', () => { let m = calM + 1, y = calY; if (m > 12) { m = 1; y++; } renderCalendar(y, m); });
}

function fmtDMY(d) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
function parseDMY(s) {
  const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{3,4})$/);
  if (!m) return null;
  const dd = +m[1], mm = +m[2], yy = +m[3];
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const d = new Date(yy, mm - 1, dd);
  if (d.getDate() !== dd || d.getMonth() !== mm - 1) return null;
  return d;
}
function setAlToday() {
  const t = new Date();
  $('al_date').value = fmtDMY(t);
  renderAmlich(t);
}
$('al_date').addEventListener('input', () => { const d = parseDMY($('al_date').value); if (d) renderAmlich(d); });
$('al_today').addEventListener('click', setAlToday);
setAlToday();

// ---------- Text Counter + Case (wordcounter.net + caseconverter.cc) ----------
const tcText = $('tc_text');
function countText() {
  const t = tcText.value;
  $('tc_chars').textContent = commas(t.length);
  $('tc_nospace').textContent = commas(t.replace(/\s/g, '').length);
  const words = t.trim() ? t.trim().split(/\s+/).length : 0;
  $('tc_words').textContent = commas(words);
  const sentences = (t.match(/[^.!?…]+[.!?…]+/g) || []).length || (t.trim() ? 1 : 0);
  $('tc_sentences').textContent = commas(sentences);
  const paras = t.split(/\n+/).filter(p => p.trim()).length;
  $('tc_paras').textContent = commas(paras);
  const lines = t === '' ? 0 : t.split('\n').length;
  $('tc_lines').textContent = commas(lines);
  const sec = Math.round(words / 200 * 60);
  $('tc_read').textContent = sec < 60 ? sec + 's' : Math.floor(sec / 60) + 'm ' + (sec % 60) + 's';
}
tcText.addEventListener('input', countText);
function toTitle(s) { return s.replace(/\b\w/g, c => c.toUpperCase()); }
function toSentence(s) { return s.toLowerCase().replace(/(^\s*\w|[.!?…]\s*\w)/g, c => c.toUpperCase()); }
document.querySelectorAll('.cbtn').forEach(b => b.addEventListener('click', () => {
  const t = tcText.value, mode = b.dataset.case;
  if (mode === 'upper') tcText.value = t.toUpperCase();
  else if (mode === 'lower') tcText.value = t.toLowerCase();
  else if (mode === 'sentence') tcText.value = toSentence(t);
  else if (mode === 'title') tcText.value = toTitle(t);
  else if (mode === 'alt') tcText.value = t.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join('');
  else if (mode === 'inverse') tcText.value = t.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
  else if (mode === 'clear') tcText.value = '';
  countText();
}));
countText();
