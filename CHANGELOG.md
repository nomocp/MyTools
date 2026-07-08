# CHANGELOG — MyTools

Định dạng theo [Keep a Changelog]. Ngày: YYYY-MM-DD.

## [1.4.0] — 2026-07-04
### Changed — Responsive mobile/tablet
- Nav bọc trong `<nav class="navlist">`.
- **Tablet (≤1024px)**: sidebar hẹp lại 216px.
- **Mobile (≤760px)**: sidebar → top bar; nav thành **thanh cuộn ngang** (scroll-snap, không wrap), tab dạng pill; topbar/card thu gọn.
- **Phone (≤480px)**: input grid xếp 1 cột, result chip 2 cột, `.pc-line` stack full-width, bảng + lịch âm co lại (cell 44px), subtab full-width.
- Fix thứ tự CSS: dồn toàn bộ media query xuống cuối file để override thắng base rule (trước đó base đặt sau nên đè mất responsive).
- Verify: 375px không tràn ngang, nav cuộn được; 1280px giữ nguyên sidebar/active-bar/3-cột.

## [1.3.1] — 2026-07-04
### Changed
- Tách `index.html`: CSS → `css/style.css`, JS → `js/app.js`. HTML chỉ còn markup + `<link>`/`<script src>`. Không đổi logic, verify chạy đúng.

## [1.3.0] — 2026-07-04
### Changed — Redesign UX (theo 100 UX tips của Intechnic)
- **Visibility of system status**: thêm **topbar** hiện tên + mô tả tool đang mở, cập nhật theo nav.
- **Recognition of location**: nav active có thanh accent bên trái + icon phát sáng.
- **Fitts's law**: mọi target ≥ 44px (nav, input, button); button phụ ≥ 38–40px.
- **Contrast (WCAG AA)**: muted `#8b949e → #a3adbb`, text sáng hơn, accent `#2f81f7 → #4c9dff`.
- **Visual hierarchy**: type scale rõ hơn (topbar 24px, card title 17px), input 16px (chống zoom iOS).
- **Spacing rhythm**: token 8px (`--s1..--s6`) áp dụng nhất quán.
- **Feedback**: button có active-press + shadow động, card hover nâng, focus-visible ring.
- **Output vs input**: result chip có viền accent trái + value 24px đậm để phân biệt kết quả.
- **Accessibility**: `prefers-reduced-motion` tắt animation; subtab gộp thành segmented control.
- Đồng bộ palette mới sang `docs.html`.

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
