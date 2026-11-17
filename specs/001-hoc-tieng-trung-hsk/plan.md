# Implementation Plan: Website học tiếng Trung HSK

**Branch**: `001-hoc-tieng-trung-hsk` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-hoc-tieng-trung-hsk/spec.md`

## Summary

Website học tiếng Trung cho người Việt mới bắt đầu, nội dung Pinyin + HSK 1–3 (~600 từ): flashcard có
pinyin, phát âm, mẹo nhớ và hình liên tưởng; ôn tập ngắt quãng (hộp Leitner); trang từ vựng với câu ví dụ
và nét viết; lộ trình; mục tiêu ngày tự điều chỉnh; 5 trò luyện tập khó đoán + Thử thách tuần; trang chủ
phong cách Trung Hoa hiện đại nhiều hiệu ứng có phần chọn level; nhắc học bằng thông báo đẩy.

Cách làm: ứng dụng web tĩnh (Vite + React + TypeScript + Tailwind) cài được như app (PWA, chạy offline),
tiến độ lưu trên trình duyệt. Hiệu ứng bằng GSAP + CSS, nét chữ bằng Hanzi Writer. Ngoại lệ duy nhất:
một hàm serverless nhỏ chỉ để gửi thông báo nhắc học đúng giờ (xem Complexity Tracking).
Thiết kế: [design-system.md](./design-system.md). Các quyết định và lý do: [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript (bản ổn định mới nhất), Node.js LTS ≥ 20 để build

**Primary Dependencies**: React, React Router, Vite, Tailwind CSS, Zustand (persist), GSAP + ScrollTrigger,
Hanzi Writer + hanzi-writer-data, vite-plugin-pwa (Workbox), Lucide icons. Hàm nhắc: Cloudflare Workers + thư viện Web Push.

**Storage**: localStorage (một khoá, có `schemaVersion`); nội dung là file JSON tĩnh; hàm nhắc dùng Cloudflare KV
(chỉ mã thiết bị, lịch nhắc, múi giờ)

**Testing**: Vitest (logic), Playwright (luồng chính ở 360/768/1280 + reduced motion), Lighthouse mobile

**Target Platform**: Trình duyệt mới nhất: Chrome/Edge (Android, Windows), Safari iOS ≥ 16.4 (cần cho Web Push
khi đã thêm vào màn hình chính), Firefox

**Project Type**: Ứng dụng web tĩnh (PWA) + một hàm serverless nhỏ tách biệt

**Performance Goals**: hiệu ứng ~60fps trên điện thoại tầm trung; tương tác ≤ 400ms; trang chủ hiện phần đầu
≤ 2s trên 4G; tìm kiếm < 1s; phát âm bắt đầu ≤ 1s; Lighthouse mobile Performance ≥ 85, Accessibility ≥ 90

**Constraints**: chạy offline sau lần mở đầu; không tài khoản; giao diện tiếng Việt; tôn trọng
`prefers-reduced-motion`; gói JS ban đầu nhỏ (tách code theo trang, GSAP/Hanzi Writer chỉ tải ở trang cần)

**Scale/Scope**: ~600 từ, ~1.200 câu ví dụ, ~900 chữ có dữ liệu nét, ~300–350 ảnh minh hoạ (≤ 40KB/ảnh),
~16 trang, 5 trò + Thử thách tuần

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Nguyên tắc | Đánh giá | Ghi chú |
|---|---|---|
| I. Responsive mobile-first | ✅ Đạt | Tailwind mobile-first; e2e kiểm 360/768/1280; nút ≥ 44px; chữ Hán thẻ ≥ 72px |
| II. Đơn giản cho người mới | ✅ Đạt | Không đăng ký; chọn level → thẻ đầu ≤ 3 lần bấm; toàn tiếng Việt |
| III. Bản sắc, không "mùi AI" | ✅ Đạt, có rủi ro | Design system riêng, không dùng kết quả Claymorphism/tím chàm mặc định của tool; icon Lucide. **Rủi ro**: ảnh minh hoạ tạo bằng công cụ AI → giảm thiểu bằng hướng dẫn phong cách thuỷ mặc cố định + duyệt từng ảnh + phương án dự phòng (research R5) |
| IV. Hiệu ứng có mục đích | ✅ Đạt | Bảng hiệu ứng gắn từng mục đích; chỉ transform/opacity (+ stroke-dashoffset cho nét); helper reduced-motion; không chặn thao tác |
| V. Nội dung chính xác | ✅ Đạt | Script `validate:content` chặn build; người duyệt nghĩa; âm pinyin dùng file thu thật |
| VI. Đơn giản, không backend | ⚠️ Ngoại lệ có lý do | Ứng dụng chính 100% tĩnh. Thông báo đẩy đúng giờ **không thể** làm mà không có máy chủ (research R10) → một hàm serverless nhỏ, tách biệt, tắt được. Ghi trong Complexity Tracking |
| Chất lượng & hiệu năng | ✅ Đạt | Mục tiêu Lighthouse, WCAG AA, bàn phím, 3s/4G đều có trong Technical Context và quickstart |
| Quy trình | ✅ Đạt | Đã chạy `ui-ux-pro-max` trước khi thiết kế giao diện |

**Kết quả gate (trước Phase 0)**: Đạt, có 1 ngoại lệ được ghi lý do.
**Kiểm tra lại sau Phase 1**: Đạt. Data model, contracts và quickstart không thêm máy chủ hay tài khoản nào khác;
hàm nhắc chỉ lưu mã thiết bị ngẫu nhiên (contracts/reminder-api.md).

## Project Structure

### Documentation (this feature)

```text
specs/001-hoc-tieng-trung-hsk/
├── plan.md              # File này
├── research.md          # Phase 0: các quyết định công nghệ và nguồn dữ liệu
├── design-system.md     # Màu, font, hiệu ứng, bố cục trang chủ (từ ui-ux-pro-max)
├── data-model.md        # Phase 1: các loại dữ liệu và quy tắc
├── quickstart.md        # Phase 1: cách chạy và kịch bản kiểm tra
├── contracts/
│   ├── routes.md        # Các trang và đường dẫn
│   ├── content-schema.md# Định dạng file từ vựng + quy tắc kiểm tra
│   ├── storage-schema.md# Lưu tiến độ, xuất/nhập
│   └── reminder-api.md  # Hàm nhắc nhở
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks — chưa tạo)
```

### Source Code (repository root)

```text
web/                          # Ứng dụng chính (tĩnh, PWA)
├── public/
│   ├── data/                 # stages, lessons/, words/, pinyin, badges, placement-test
│   ├── strokes/              # dữ liệu nét Hanzi Writer cho chữ HSK 1–3
│   ├── images/words/         # ảnh minh hoạ WebP
│   ├── audio/pinyin/         # âm thanh chặng pinyin
│   └── textures/paper.webp
├── src/
│   ├── app/                  # router, layout, thanh điều hướng
│   ├── pages/                # mỗi route một file (theo contracts/routes.md)
│   ├── features/
│   │   ├── flashcard/
│   │   ├── review/           # lịch ôn Leitner
│   │   ├── vocabulary/       # danh sách, tìm kiếm, chi tiết từ
│   │   ├── roadmap/          # lộ trình, chọn level, kiểm tra trình độ
│   │   ├── goals/            # mục tiêu tự điều chỉnh, streak, huy hiệu
│   │   ├── reminders/        # bật nhắc, đăng ký đẩy, file .ics
│   │   ├── games/            # match, listen, write, order, race, weekly + engine chung (đáp án nhiễu, độ khó, sự kiện)
│   │   └── home/             # các section trang chủ + hiệu ứng
│   ├── components/ui/        # Button, Card, Seal (con dấu), InkReveal, ProgressRing, HanziStroke…
│   ├── lib/
│   │   ├── motion.ts         # helper hiệu ứng + reduced motion
│   │   ├── speech.ts         # phát âm
│   │   ├── content.ts        # tải nội dung JSON
│   │   └── date.ts           # ngày theo giờ địa phương
│   ├── store/                # Zustand + persist + migration
│   └── styles/tokens.css     # biến màu/font từ design-system.md
├── scripts/
│   ├── validate-content.ts
│   └── build-search-index.ts
└── tests/
    ├── unit/                 # review, goals, games engine, search, content
    └── e2e/                  # các kịch bản quickstart

reminder-worker/              # Hàm nhắc (Cloudflare Worker), tách biệt
├── src/index.ts
└── tests/

content-tools/                # Công cụ soạn nội dung (không đưa lên web)
├── prompts/                  # mẫu soạn nghĩa, câu ví dụ, mẹo nhớ, hướng dẫn phong cách ảnh
└── review/                   # danh sách duyệt
```

**Structure Decision**: Một ứng dụng web tĩnh trong `web/`, chia theo tính năng (`features/`) để mỗi phần sửa
độc lập. Hàm nhắc nằm riêng trong `reminder-worker/` để có thể bỏ đi mà không ảnh hưởng app. Công cụ soạn nội
dung tách ra `content-tools/` vì đó là quy trình làm nội dung, không phải code chạy trên web.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Một hàm serverless (Cloudflare Worker + KV + Cron) cho nhắc nhở — constitution VI yêu cầu bản đầu không backend | Spec chốt nhắc bằng thông báo đẩy (Clarifications Q2, FR-022a) và không nhắc khi đã đạt mục tiêu (FR-022). Trình duyệt chỉ nhận thông báo đúng giờ khi app đã đóng nếu có máy chủ gửi | Chỉ file `.ics`: nhắc đúng giờ nhưng không bỏ được nhắc khi đã học xong và không phải thông báo đẩy. Periodic Background Sync: không có trên iOS, không đúng giờ. Giữ `.ics` làm phương án dự phòng |
| Ảnh minh hoạ tạo bằng công cụ AI (rủi ro với nguyên tắc III) | ~300–350 từ cụ thể cần hình (Clarifications Q2); một người không vẽ tay kịp | Thư viện mở không phủ đủ từ/không đúng phong cách; emoji bị cấm. Giảm thiểu: hướng dẫn phong cách cố định + duyệt từng ảnh + dự phòng hình tách bộ thủ |

## Quyết định đã xác nhận (2026-11-16)

1. **Hàm nhắc nhở serverless**: người dùng đồng ý. File `.ics` giữ làm phương án dự phòng.
2. **Ảnh minh hoạ**: tạo bằng **Canva** (Canva AI tạo ảnh, có kết nối sẵn trong môi trường làm việc) theo
   hướng dẫn phong cách thuỷ mặc ở research R5, duyệt từng ảnh. Làm thử ~5 ảnh trước, rồi 20 ảnh, đạt mới làm hết.
   Trước khi đưa lên website MUST đọc lại điều khoản giấy phép nội dung của Canva cho ảnh AI và phần tử
   có sẵn (research R5).
