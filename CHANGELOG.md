# CHANGELOG — MyTools

Định dạng theo [Keep a Changelog]. Ngày: YYYY-MM-DD.

## [1.2.2] — 2026-07-04
### Added
- Favicon cho `index.html` + `docs.html`. Rename 4 icon trong `res/`: `tool-box (1..4).png` → `favicon-{32,64,256,512}x{...}.png` (theo kích thước thật), 512 dùng apple-touch-icon.
### Changed
- Logo web (sidebar + docs header) đổi từ chữ "MT" sang ảnh `res/favicon-256x256.png`.
- Âm Lịch: ô nhập ngày đổi từ `type=date` sang text **dd/mm/yyyy** (có validate, tính lại khi gõ).

## [1.2.1] — 2026-07-04
### Changed
- Âm Lịch: chuyển **Lịch âm theo tháng** lên đầu tab.
- Giờ 12 con giáp: thêm dropdown **múi giờ** (mặc định UTC+7) — dòng giờ hiện tại tô xanh + chấm ●, đổi múi giờ cập nhật ngay.

## [1.2.0] — 2026-07-04
### Added
- **BMI Calculator** (theo calculator.net): Metric (cm/kg) + US (ft·in/lb), BMI, phân loại (gầy/bình thường/thừa cân/béo phì), khoảng cân nặng khỏe mạnh, thanh scale màu có mũi tên vị trí.
- **Âm Dương Lịch** — thuật toán **Hồ Ngọc Đức** (public domain, thuần JS, không API, múi giờ VN +7):
  - Đổi dương → âm, can chi năm / tháng / ngày, tiết khí.
  - Bảng **12 giờ con giáp** (can chi từng giờ theo ngày).
  - **Lịch âm theo tháng** dạng grid, điều hướng tháng trước/sau, đánh dấu hôm nay, mùng 1 hiện tháng âm.
  - Đã verify: Tết Canh Tý (25/1/2020), Giáp Ngọ (31/1/2014), Giáp Thìn (10/2/2024) khớp chính xác.
- **Text Counter + Case Converter** (theo wordcounter.net + caseconverter.cc): đếm ký tự / không dấu cách / từ / câu / đoạn / dòng + thời gian đọc; convert UPPER, lower, Sentence, Title, aLtErNaTiNg, InVeRsE, Xóa.
- Đơn vị: tất cả **client-side thuần**, không gọi API ngoài → deploy được GitHub Pages.
- `.claude/launch.json` (python http.server) để preview cục bộ.

## [1.1.0] — 2026-07-04
### Added
- **Percentage Calculator** (tab mới, theo calculator.net):
  - 3 dạng cơ bản: `P% của B`, `A là bao nhiêu % của B`, `A là P% của số nào`.
  - **Percentage Change** — % tăng/giảm từ V₁ → V₂ (màu xanh/đỏ theo dấu).
  - **Percentage Difference** — `|V₁−V₂| / ((V₁+V₂)/2)`.
  - Tất cả live-calc (tính ngay khi gõ), format số kiểu `en-US`.
- Docs: `HDSD.md`, `docs.html`, `CHANGELOG.md`.

## [1.0.0] — 2026-07-04
### Added
- Gộp 3 tool rời thành 1 trang `index.html` (single-file, dark trading theme):
  - **Commission** (từ `CommissionCalc/main.cpp`) — commission + min point to win.
  - **Risk / Reward** (từ `RR Winrate calc/main.py`) — profit/trade theo win rate + min win rate.
  - **Lãi Kép** (từ `Laikep/`) — 2 mode: lãi kép + rút, và tính từ mục tiêu.
- Thiết kế lại UI: layout **sidebar menu** + content, responsive (<720px sidebar xuống top).

### Notes
- Logic gốc giữ nguyên 100%, chỉ port sang JS thuần.
- Nguồn cũ vẫn còn trong các thư mục con (`CommissionCalc/`, `Laikep/`, `RR Winrate calc/`).
