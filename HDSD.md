# HDSD — MyTools Trading Toolkit

Mở `index.html` bằng trình duyệt. Chọn tool ở **sidebar menu** bên trái.

---

## 1. 💰 Commission

Tính phí commission và số **point tối thiểu** để hòa/thắng lệnh.

| Input | Ý nghĩa |
|---|---|
| Tick Price | Giá trị tiền của 1 point |
| Commission / 1 Lot | Phí broker thu trên 1 lot |
| Lot Size | Khối lượng lệnh |

**Công thức:**
```
commission = (comPerLot * 0.01) * (lotSize / 0.01)
minPoint   = commission / tickPrice + 1   (làm tròn xuống 2 số lẻ)
```
Tính ngay khi gõ. VD: tick=0.01, com=4.5, lot=0.21 → commission=**9.45**, min point=**946.00**.

---

## 2. 📊 Risk / Reward

**Card 1 — Profit theo Win Rate:** kỳ vọng lợi nhuận mỗi lệnh (đơn vị R).
```
profit = winRate * reward − (1 − winRate) * risk
```
profit dương → xanh, âm → đỏ.

**Card 2 — Min Win Rate cần thiết:** win rate tối thiểu để đạt profit kỳ vọng.
```
minWinRate = (profit + risk) / (reward + risk)
```
VD: R:R = 1:9, muốn +1R/lệnh → cần win rate ≥ **20%**.

---

## 3. 📈 Lãi Kép

Hai chế độ (subtab):

### a) Lãi kép + Rút
Mô phỏng lãi kép từng kỳ, có nạp thêm và rút định kỳ.

| Input | Ý nghĩa |
|---|---|
| Vốn ban đầu | Số vốn khởi điểm |
| Lãi suất (%) | Lãi mỗi kỳ |
| Thêm mỗi kỳ | Nạp thêm mỗi kỳ |
| Số kỳ thêm | `-1` = nạp suốt kỳ hạn |
| Kỳ hạn | Tổng số kỳ |
| Rút mỗi kỳ (%) | % lãi rút ra mỗi kỳ |
| Bắt đầu rút từ kỳ | Kỳ đầu tiên bắt đầu rút |

Bảng: Kỳ · Vốn · Tổng Lãi · Rút. Kèm bảng thống kê tổng.

### b) Từ Mục Tiêu
Cho vốn đầu + mục tiêu + số kỳ → tính **% cần mỗi kỳ** để đạt mục tiêu.
```
dailyFactor = (target / initial) ^ (1 / days)
%mỗi kỳ     = (dailyFactor − 1) * 100
```
Ô Mục Tiêu ↔ Phần trăm liên kết 2 chiều (đổi ô này ô kia tự cập nhật).

**Quy ước:** 1 năm = 52 tuần / 260 ngày (trừ T7-CN); 1 tháng = 24 ngày.

---

## 4. % Percentage

3 dạng cơ bản (điền 2 ô, kết quả tự hiện):

| Dạng | Công thức |
|---|---|
| Bao nhiêu là **P%** của **B** | `P/100 * B` |
| **A** là bao nhiêu % của **B** | `A/B * 100` |
| **A** là **P%** của số nào | `A / (P/100)` |

**Percentage Change** — % tăng/giảm V₁ → V₂:
```
change = (V₂ − V₁) / |V₁| * 100
```
**Percentage Difference** — chênh lệch tương đối:
```
diff = |V₁ − V₂| / |(V₁ + V₂) / 2| * 100
```

---

## 5. ⚖️ BMI

Chỉ số khối cơ thể, 2 hệ đơn vị (subtab): **Metric** (cm/kg) hoặc **US** (ft·in/lb).
```
BMI = kg / (m)²
```
| BMI | Phân loại |
|---|---|
| < 18.5 | Gầy |
| 18.5 – 24.9 | Bình thường |
| 25 – 29.9 | Thừa cân |
| ≥ 30 | Béo phì |

Hiển thị: BMI, phân loại (màu), khoảng cân nặng khỏe mạnh (BMI 18.5–25), thanh scale có mũi tên vị trí. Live-calc.

---

## 6. 🌙 Âm Dương Lịch

Đổi dương → âm, không cần internet (thuật toán Hồ Ngọc Đức, múi giờ VN +7).

- **Chọn ngày** hoặc bấm **Hôm nay** → hiện âm lịch, can chi năm/tháng/ngày, tiết khí.
- **Giờ 12 con giáp**: bảng can chi từng khung 2 giờ (Tý 23–01 … Hợi 21–23). Chọn **múi giờ** (mặc định UTC+7) → dòng giờ hiện tại tô xanh có chấm ●.
- **Lịch tháng**: ô lớn = ngày dương, số nhỏ = ngày âm (mùng 1 tô xanh + hiện tháng âm). Nút ‹ › đổi tháng.

Can (10): Giáp Ất Bính Đinh Mậu Kỷ Canh Tân Nhâm Quý.
Chi (12): Tý Sửu Dần Mão Thìn Tỵ Ngọ Mùi Thân Dậu Tuất Hợi.

---

## 7. 🔤 Text Counter + Case

Dán/nhập văn bản vào ô → đếm live:

| Chỉ số | Cách tính |
|---|---|
| Ký tự | tổng độ dài |
| Không dấu cách | bỏ mọi khoảng trắng |
| Từ | tách theo khoảng trắng |
| Câu | kết thúc bởi `. ! ? …` |
| Đoạn | khối tách bởi dòng trống |
| Dòng | số dòng `\n` |
| Đọc | ~200 từ/phút |

Nút convert: **UPPER**, **lower**, **Sentence case**, **Title Case**, **aLtErNaTiNg**, **InVeRsE**, **✕ Xóa**.

---

## Ghi chú kỹ thuật
- `index.html` là **single-file**: HTML + CSS + JS trong 1 file, không cần server, mở trực tiếp.
- Source gốc lưu trong: `CommissionCalc/`, `Laikep/`, `RR Winrate calc/`.
- Xem thay đổi ở [CHANGELOG.md](CHANGELOG.md), tài liệu trực quan ở [docs.html](docs.html).
