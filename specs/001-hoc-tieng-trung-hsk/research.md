# Research: Website học tiếng Trung HSK

**Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Mỗi mục: Decision / Rationale / Alternatives considered. Các thông tin về giấy phép và phiên bản thư
viện MUST được kiểm tra lại khi cài đặt (bước implement), vì có thể đã đổi.

## R1. Công nghệ giao diện

- **Decision**: Vite + React + TypeScript, React Router, Tailwind CSS. Bản ổn định mới nhất lúc khởi tạo.
- **Rationale**: Website có ~15 màn hình và nhiều thành phần lặp lại (thẻ, nút, trò chơi) → chia
  component giúp AI sửa từng phần (constitution VI). React + TS là bộ được AI viết đúng nhiều nhất.
  Vite build ra file tĩnh, không cần máy chủ. Tailwind giữ token màu/khoảng cách ở một chỗ.
- **Alternatives**: HTML/JS thuần (ít phụ thuộc nhưng 5 trò chơi + lộ trình sẽ thành code rối);
  Astro (tốt cho trang tĩnh, nhưng phần lớn app là tương tác); Next.js (thừa, hướng tới server).

## R2. Hiệu ứng

- **Decision**: GSAP + ScrollTrigger cho hiệu ứng cuộn và timeline phức tạp ở trang chủ; CSS
  transition cho tương tác nhỏ (lật thẻ, đúng/sai). Mọi hiệu ứng đi qua một helper `motion` kiểm tra
  `prefers-reduced-motion`.
- **Rationale**: Trang chủ cần mực loang theo cuộn và chuỗi hiệu ứng nối tiếp — GSAP làm việc này
  ổn định, chạy trên `transform/opacity`. GSAP và các plugin hiện miễn phí (kiểm tra lại giấy phép khi cài).
  Phần còn lại dùng CSS để nhẹ.
- **Alternatives**: Framer Motion (tốt cho React, nhưng scroll-scrub kém linh hoạt hơn GSAP);
  chỉ CSS (không làm được mực loang theo cuộn mượt).

## R3. Dữ liệu thứ tự nét chữ và hiệu ứng viết

- **Decision**: **Hanzi Writer** (giấy phép MIT) cho hoạt ảnh viết nét và trò Luyện viết (chế độ quiz
  nhận nét vẽ tay). Dữ liệu nét lấy từ **hanzi-writer-data** (gốc từ dự án Make Me a Hanzi, giấy phép
  Arphic Public License / LGPL — phải ghi nguồn trong trang "Giới thiệu"). Chỉ đóng gói dữ liệu của
  các chữ xuất hiện trong HSK 1–3 (~900 chữ, mỗi chữ vài KB) vào thư mục tĩnh của website để dùng offline.
- **Rationale**: Hanzi Writer đã có sẵn đúng 2 chức năng spec cần: hoạt ảnh thứ tự nét (FR-013) và
  chấm từng nét khi viết, gợi ý nét đúng khi sai (US8 kịch bản 4). Tự làm sẽ mất nhiều tuần.
- **Alternatives**: Tải dữ liệu nét từ CDN mỗi lần (không chạy offline, vi phạm FR-028);
  tự vẽ SVG (không khả thi cho 900 chữ).

## R4. Phân tích bộ thủ cho mẹo nhớ và hình tách bộ thủ

- **Decision**: Lấy trường phân tách thành phần (decomposition) và gợi ý nguồn gốc chữ từ file từ điển
  của **Make Me a Hanzi** làm dữ liệu khởi đầu; hình tách bộ thủ được **vẽ tự động bằng SVG** từ chính
  dữ liệu nét (tô màu khác nhau cho từng thành phần, hiệu ứng các phần ghép lại).
- **Rationale**: Từ trừu tượng không cần ảnh — hình được sinh từ dữ liệu, không tốn công vẽ, nét luôn
  đúng chữ thật (FR-002b).
- **Alternatives**: Vẽ tay từng hình (quá nhiều việc); ảnh chụp/ảnh vẽ (khó đồng bộ phong cách).

## R5. Hình minh hoạ cho từ cụ thể

- **Decision**: Hình được tạo bằng công cụ tạo ảnh theo **một bộ hướng dẫn phong cách cố định**:
  tranh thuỷ mặc tối giản, mực đen trên nền giấy ngà, đúng một điểm nhấn đỏ son, không chữ, không
  khung, bố cục vuông. Mỗi hình MUST được người duyệt bằng mắt trước khi đưa vào; hình nào lỗi
  hoặc "mùi AI" (tay sai, chi tiết vô nghĩa, bóng bẩy kiểu 3D) thì tạo lại hoặc bỏ. Xuất WebP 512×512,
  ≤ 40KB/hình, tải lười (lazy load).
- **Rationale**: Khoảng 300–350 từ cụ thể trong HSK 1–3 cần hình (theo Clarifications Q2). Vẽ tay
  không khả thi cho một người. Ép phong cách thuỷ mặc thống nhất + duyệt tay là cách giữ đúng nguyên
  tắc III ("không mùi AI") mà vẫn làm được. Ước tính dung lượng ~12MB, chỉ tải khi xem.
- **Alternatives**: Bộ minh hoạ mã nguồn mở (không có bộ nào phủ đủ từ vựng và đúng phong cách);
  emoji/OpenMoji (bị constitution cấm làm icon và trông chung chung); thuê hoạ sĩ (tốn chi phí, để bản sau
  nếu cần thay thế dần hình quan trọng).
- **Công cụ (đã chốt 2026-11-16)**: Canva — dùng tính năng tạo ảnh bằng AI của Canva với cùng một câu lệnh
  phong cách cho mọi ảnh, xuất PNG vuông rồi chuyển sang WebP. Không dùng nguyên phần tử/ảnh stock có sẵn của
  Canva như một file ảnh rời trên website trừ khi điều khoản giấy phép cho phép; ưu tiên ảnh do AI tạo.
  Lưu ý: ảnh từ Canva AI vẫn là ảnh AI, nên vẫn MUST duyệt "mùi AI" như trên. Số lượt tạo ảnh phụ thuộc gói Canva.
- **Rủi ro**: Nếu sau khi làm thử 20 hình đầu mà chất lượng không đạt, chuyển sang phương án dự phòng:
  hình tách bộ thủ (R4) cho cả từ cụ thể, và chỉ làm hình cho ~100 từ HSK 1 thông dụng nhất.

## R6. Danh sách từ HSK và nội dung tiếng Việt

- **Decision**: Danh sách từ HSK 2.0 cấp 1–3 (~600 từ) lấy từ một bộ dữ liệu mở có pinyin (ví dụ kho
  "complete-hsk-vocabulary" trên GitHub; kiểm tra giấy phép khi lấy). Nghĩa tiếng Việt, câu ví dụ,
  mẹo nhớ: AI soạn nháp theo mẫu cố định → kiểm tra tự động (đủ trường, pinyin có dấu, câu ví dụ chỉ dùng
  từ cùng cấp trở xuống) → người duyệt. Đối chiếu nghĩa với CC-CEDICT (CC BY-SA) khi cần.
- **Rationale**: Không có nguồn mở nào có sẵn nghĩa tiếng Việt + câu ví dụ + mẹo nhớ đủ chất lượng.
  Kiểm tra tự động bắt lỗi thiếu trường và sai định dạng; người duyệt bắt lỗi nghĩa (SC-008).
- **Alternatives**: Dịch máy hàng loạt không duyệt (sai nghĩa, vi phạm constitution V).

## R7. Phát âm

- **Decision**: Web Speech API (giọng `zh-CN` có sẵn trên thiết bị) cho từ và câu. Nếu thiết bị không có
  giọng tiếng Trung: hiện hướng dẫn cài giọng đọc bằng tiếng Việt và vẫn cho học tiếp (Edge Case).
  Riêng chặng Pinyin (thanh mẫu, vận mẫu, 4 thanh điệu ~ 60 âm) dùng **file âm thanh thu sẵn** có giấy phép
  mở hoặc tự thu, vì đây là nơi phát âm phải chuẩn nhất.
- **Rationale**: 600 từ + ~1.200 câu ví dụ mà thu âm hết thì quá tốn; giọng máy hiện đại đọc từ/câu đủ tốt.
  Âm tiết lẻ (mā/má/mǎ/mà) thì giọng máy hay đọc sai thanh → cần file thật.
- **Alternatives**: Dịch vụ chuyển văn bản thành giọng nói trên đám mây (cần khoá API và máy chủ);
  tạo sẵn file mp3 cho toàn bộ bằng công cụ TTS (khả thi ở bản sau, ~30–50MB).
- **Rủi ro**: Giọng đọc khác nhau giữa các máy; SC-004 (≤ 1 giây) cần đo trên Android, iOS, Windows.

## R8. Lưu tiến độ

- **Decision**: Lưu trên trình duyệt bằng localStorage, qua một kho trạng thái nhỏ (Zustand + persist),
  có số phiên bản dữ liệu (`schemaVersion`) và hàm chuyển đổi khi đổi cấu trúc. Xuất/nhập tiến độ là
  một file JSON (FR-027).
- **Rationale**: Tiến độ cho 600 từ chỉ khoảng vài trăm KB, vừa giới hạn localStorage (~5MB).
  Đơn giản hơn IndexedDB rất nhiều (constitution VI).
- **Alternatives**: IndexedDB/Dexie (cần khi dữ liệu lớn hoặc lưu ảnh — chưa cần).

## R9. Thuật toán ôn tập ngắt quãng

- **Decision**: Hệ hộp Leitner có khoảng cố định: hộp 0→1→2→3→4→5→6 = ôn sau 0, 1, 3, 7, 14, 30, 60 ngày.
  "Đã nhớ" lên 1 hộp; "Hơi nhớ" giữ hộp và ôn lại sau 1 ngày; "Chưa nhớ" về hộp 1. Sai trong trò chơi
  = "Chưa nhớ" (FR-024b). Giới hạn 50 thẻ/ngày, ưu tiên thẻ quá hạn lâu nhất (FR-010).
- **Rationale**: Dễ hiểu, dễ kiểm thử, khớp đúng ví dụ khoảng 1 → 3 → 7 → 14 → 30 trong spec (US2).
- **Alternatives**: SM-2 / FSRS (chính xác hơn nhưng khó giải thích, khó kiểm thử; cân nhắc ở bản sau).

## R10. Nhắc nhở bằng thông báo đẩy — PHÁT HIỆN QUAN TRỌNG

- **Phát hiện**: Một website **không có máy chủ** không thể tự gửi thông báo đúng giờ khi người dùng đã
  đóng trình duyệt. Thông báo đẩy (Web Push) bắt buộc có một máy chủ gửi tới dịch vụ đẩy của trình duyệt.
  Các cách "không máy chủ" đều không đáng tin: Periodic Background Sync chỉ có trên Chrome Android/desktop
  với PWA đã cài và không đúng giờ; Notification Triggers đã bị bỏ; iOS không hỗ trợ cả hai.
- **Decision**: Ứng dụng chính vẫn hoàn toàn tĩnh. Riêng tính năng nhắc nhở (US6, ưu tiên P6) dùng
  **một hàm serverless rất nhỏ** (Cloudflare Workers, gói miễn phí) có Cron chạy mỗi 15 phút:
  lưu đăng ký đẩy (push subscription) + lịch nhắc + múi giờ + "ngày gần nhất đạt mục tiêu"; đến giờ thì
  gửi Web Push. Không tài khoản, không email, không tên — chỉ một mã ngẫu nhiên của thiết bị.
  Khi người dùng đạt mục tiêu, app gửi một tín hiệu "đã xong hôm nay" để không bị nhắc (FR-022).
  Dự phòng: nút "Thêm vào lịch điện thoại" tải file `.ics` lặp lại, dùng được trên mọi máy kể cả khi
  không cấp quyền thông báo.
- **Rationale**: Đây là cách duy nhất đáp ứng đúng FR-022a và US6 kịch bản 2–3. Hàm tách biệt hoàn toàn:
  nếu tắt nó, mọi tính năng khác vẫn chạy. Ghi ngoại lệ vào Complexity Tracking (constitution VI).
- **Alternatives**: Chỉ file `.ics` (không cần máy chủ, nhắc đúng giờ, nhưng không bỏ được nhắc khi đã
  học xong và không phải "thông báo đẩy" như spec chốt); chỉ thông báo khi đang mở trang (vô dụng cho nhắc nhở).
- **Quyền riêng tư**: chỉ lưu mã thiết bị ngẫu nhiên, lịch nhắc, múi giờ; xoá khi người dùng tắt nhắc.
  Ghi rõ trong trang "Quyền riêng tư" bằng tiếng Việt (tuân thủ Nghị định 13/2023/NĐ-CP về dữ liệu cá nhân).

## R11. PWA và chạy offline

- **Decision**: vite-plugin-pwa (Workbox) tạo service worker và manifest: lưu sẵn giao diện, dữ liệu từ
  vựng, dữ liệu nét chữ; ảnh minh hoạ lưu khi đã xem. Có trang hướng dẫn "Thêm vào màn hình chính" cho
  iPhone (US6 kịch bản 5).
- **Rationale**: Đáp ứng FR-028 (học khi mất mạng) và điều kiện nhận thông báo trên iOS.

## R12. Kiểm thử

- **Decision**: Vitest cho logic thuần (lịch ôn, mục tiêu tự điều chỉnh, chọn đáp án nhiễu, độ khó, tìm
  kiếm pinyin không dấu, kiểm tra dữ liệu từ vựng). Playwright cho luồng chính ở 3 bề rộng 360/768/1280
  và một lần với reduced motion. Lighthouse (mobile) cho hiệu năng/tiếp cận.
- **Rationale**: Constitution yêu cầu kiểm tra 3 bề rộng + reduced motion trước khi coi là xong; logic
  ôn tập và trò chơi có quy tắc số rõ ràng (FR-019a, FR-024e) nên kiểm thử tự động rất đáng.

## R13. Lưu trữ và đưa lên mạng

- **Decision**: Cloudflare Pages (file tĩnh, HTTPS, miễn phí) + Cloudflare Workers cho R10, cùng một tài khoản.
- **Alternatives**: GitHub Pages (tốt cho phần tĩnh, nhưng hàm nhắc nhở vẫn phải đặt nơi khác); Vercel/Netlify.

## R14. Tìm kiếm pinyin không dấu

- **Decision**: Lúc build, tạo cho mỗi từ các khoá tìm kiếm: chữ Hán, pinyin có dấu, pinyin bỏ dấu và bỏ
  khoảng trắng ("nihao"), nghĩa tiếng Việt bỏ dấu ("xin chao"). Tìm bằng so khớp chuỗi trong bộ nhớ.
- **Rationale**: 600 từ → tìm trong bộ nhớ dưới 1 giây (SC-005), không cần thư viện tìm kiếm.
