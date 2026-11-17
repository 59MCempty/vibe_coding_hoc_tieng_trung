<!--
Sync Impact Report
- Version change: 1.0.0 → 2.0.0 (MAJOR: định nghĩa lại nguyên tắc I)
- Modified principles:
  I. "Responsive trên mọi thiết bị (Mobile-First)" → "Website trên máy tính trước (Desktop-First)":
     bỏ thiết kế điện thoại trước và kiểm tra 360/768px; chuẩn mới 1280px, dùng được từ 1024px;
     điện thoại/tablet để giai đoạn sau. Lý do: người dùng quyết định ngày 2026-11-17.
- Sửa thêm:
  - Tiêu chuẩn chất lượng: Lighthouse chế độ desktop; trình duyệt trên máy tính (Safari macOS thay
    Safari iOS); bỏ mốc "4G".
  - Nguyên tắc IV: mốc 60fps tính trên máy tính tầm trung thay vì điện thoại tầm trung.
  - Quy trình phát triển: kiểm tra ở 1280px và 1024px thay vì 360/768/1280; thêm luật duyệt bản vẽ
    giao diện trước khi code và chỉ code khi người dùng nói rõ.
- Added sections: không có
- Removed sections: không có
- Tài liệu cần cập nhật theo (chưa sửa ở bước này):
  ⚠ specs/001-hoc-tieng-trung-hsk/spec.md (US/SC nhắc điện thoại, 360/768px, SC-003)
  ⚠ specs/001-hoc-tieng-trung-hsk/plan.md (Constitution Check nguyên tắc I, Lighthouse mobile)
  ⚠ specs/001-hoc-tieng-trung-hsk/design-system.md (cỡ chữ "mobile ≥ 72px", checklist 360/768)
  ⚠ specs/001-hoc-tieng-trung-hsk/contracts/routes.md (thanh điều hướng dưới đáy trên mobile)
  ⚠ specs/001-hoc-tieng-trung-hsk/quickstart.md, tasks.md (T005, T014, T044… kiểm tra 360/768)
  ⚠ US6 (nhắc nhở qua thông báo đẩy trên điện thoại, cài app PWA) — cần xem lại có giữ không
  ✅ Templates của Spec Kit: đọc constitution khi chạy, không cần sửa
- Deferred TODOs: không có
-->

# Học Tiếng Trung Constitution

## Core Principles

### I. Website trên máy tính trước (Desktop-First)

- Bản đầu MUST được thiết kế và làm cho website trên máy tính (desktop). Bề rộng chuẩn để thiết kế
  và kiểm tra là 1280px; mọi màn hình MUST dùng được đầy đủ ở mọi bề rộng máy tính từ 1024px trở lên,
  không có thanh cuộn ngang và không có nội dung bị che hoặc cắt.
- Giao diện riêng cho điện thoại và tablet chưa làm ở bản đầu; để giai đoạn sau, khi người dùng
  quyết định. Bố cục SHOULD không chặn đường mở rộng sau này (không cố định bề rộng tuyệt đối khi
  không cần).
- Mọi thao tác MUST làm được bằng chuột và bàn phím.
- Vùng bấm (nút, thẻ, ô chọn) MUST có kích thước tối thiểu 44×44px.
- Chữ Hán MUST hiển thị đủ lớn để nhìn rõ nét (tối thiểu 24px; chữ chính trên thẻ học lớn hơn nhiều).

Lý do: người dùng (chủ dự án) quyết định ngày 2026-11-17 tập trung làm website trên máy tính trước,
chưa cần điện thoại, để ra bản dùng được sớm và thiết kế dễ duyệt hơn.

### II. Đơn giản cho người mới bắt đầu

- Người dùng lần đầu MUST bắt đầu được bài học đầu tiên trong tối đa 3 lần bấm từ trang chủ,
  không bắt buộc đăng ký tài khoản.
- Mỗi màn hình MUST có một hành động chính rõ ràng; không nhồi nhiều lựa chọn ngang hàng.
- Giao diện, hướng dẫn và thông báo lỗi MUST viết bằng tiếng Việt dễ hiểu, không dùng
  thuật ngữ ngôn ngữ học khi chưa giải thích.
- Nội dung MUST đi từ dễ đến khó (pinyin và thanh điệu → từ vựng cơ bản → câu ngắn).

Lý do: đối tượng chính là người chưa biết gì về tiếng Trung; mỗi bước rối là một lần bỏ học.

### III. Giao diện có bản sắc, không "mùi AI"

- Giao diện MUST có một design system riêng (màu, font, bo góc, bóng, minh hoạ) được chốt
  ở bước plan bằng skill `ui-ux-pro-max`, và MUST được áp dụng nhất quán ở mọi trang.
- MUST NOT dùng bố cục và hình ảnh mặc định kiểu AI-generic: gradient tím–xanh đại trà,
  emoji làm icon, thẻ trắng bo góc giống nhau lặp lại, chữ "Welcome to…" chung chung,
  ảnh stock không liên quan.
- Icon MUST lấy từ một bộ SVG thống nhất; font MUST hỗ trợ đầy đủ tiếng Việt và chữ Hán.
- Giao diện SHOULD có chất riêng gắn với văn hoá Trung Hoa hoặc việc học chữ
  (nét bút, giấy ô chữ, màu sắc có chủ đích), không chỉ là template trang trí.

Lý do: người dùng muốn một sản phẩm đẹp, bắt mắt và đáng tin, không trông như làm vội bằng AI.

### IV. Hiệu ứng nổi bật nhưng có mục đích

- Hiệu ứng MUST phục vụ việc học hoặc phản hồi thao tác: lật thẻ, đúng/sai, hoàn thành bài,
  chuỗi ngày học, viết nét chữ, chuyển trang.
- Mỗi lượt học SHOULD có ít nhất một khoảnh khắc "thưởng" bằng hiệu ứng (ví dụ khi trả lời
  đúng hoặc hoàn thành bài).
- Animation MUST chỉ dùng `transform` và `opacity` cho chuyển động liên tục, MUST đạt
  khoảng 60fps trên máy tính tầm trung, và tương tác thường ngày MUST xong trong ≤ 400ms.
- MUST tôn trọng `prefers-reduced-motion`: khi bật, hiệu ứng được tắt hoặc giảm còn fade.
- Hiệu ứng MUST NOT chặn thao tác: người dùng luôn bấm tiếp được, không phải chờ animation.

Lý do: hiệu ứng làm việc học vui và gây nghiện tích cực, nhưng hiệu ứng thừa làm chậm và gây rối.

### V. Nội dung tiếng Trung chính xác

- Mỗi mục từ vựng MUST có: chữ Hán (giản thể), pinyin có dấu thanh điệu, nghĩa tiếng Việt.
- Phát âm (file audio hoặc Web Speech API giọng `zh-CN`) MUST có cho mọi mục từ vựng.
- Nội dung học MUST nằm trong file dữ liệu riêng (ví dụ JSON), tách khỏi code giao diện,
  để sửa hoặc thêm bài không cần đụng vào component.
- Danh sách từ SHOULD bám theo cấp độ HSK để người học biết mình đang ở đâu.

Lý do: sai một dấu thanh điệu là sai nghĩa; người mới không tự phát hiện được lỗi.

### VI. Giữ mọi thứ đơn giản (Vibe-Coding Friendly)

- Chọn công nghệ ít thành phần nhất đủ dùng; mỗi thư viện thêm vào MUST có lý do ghi trong plan.
- Phiên bản đầu MUST chạy được không cần backend: tiến độ học lưu trên trình duyệt
  (localStorage hoặc IndexedDB).
- Code MUST chia nhỏ theo component dễ đọc, đặt tên rõ ràng, để người không chuyên vẫn
  nhờ AI sửa được từng phần.
- YAGNI: không xây tính năng "để sau sẽ cần" khi chưa có trong spec.

Lý do: dự án do một người làm bằng vibe coding; sự phức tạp là rủi ro lớn nhất.

## Tiêu chuẩn chất lượng & hiệu năng

- Lighthouse chế độ máy tính (desktop): Performance ≥ 85, Accessibility ≥ 90.
- Tương phản chữ đạt chuẩn WCAG AA (≥ 4.5:1 cho chữ thường).
- Mọi chức năng dùng được bằng bàn phím; có trạng thái focus nhìn thấy được.
- Trang đầu tiên tải xong và tương tác được trong ≤ 3 giây trên mạng gia đình thông thường.
- Hỗ trợ trình duyệt trên máy tính: Chrome, Edge, Firefox, Safari (macOS) bản mới nhất.
- Thông báo lỗi bằng tiếng Việt, nói rõ người dùng cần làm gì tiếp.

## Quy trình phát triển

- Mọi tính năng đi theo chuỗi Spec Kit: `/speckit-specify` → `/speckit-clarify` →
  `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` → `/speckit-implement`.
- Ở bước plan, MUST chạy skill `ui-ux-pro-max` để chốt design system trước khi viết giao diện.
- Trước khi coi một tính năng là xong, MUST tự kiểm tra ở bề rộng 1280px và 1024px, và một lần
  với `prefers-reduced-motion` bật.
- Giao diện mỗi màn hình MUST được người dùng duyệt bằng bản vẽ trước khi viết code, và chỉ
  bắt đầu code khi người dùng nói rõ.
- Mỗi tính năng MUST có tiêu chí chấp nhận đo được trong spec, và được đối chiếu khi xong.

## Governance

- Constitution này đứng trên mọi hướng dẫn khác của dự án; khi spec hoặc plan mâu thuẫn
  với nó, constitution thắng, trừ khi constitution được sửa trước.
- Sửa constitution bằng `/speckit-constitution`, ghi rõ lý do và cập nhật Sync Impact Report.
- Phiên bản theo semantic versioning: MAJOR khi bỏ hoặc định nghĩa lại nguyên tắc,
  MINOR khi thêm nguyên tắc hoặc mở rộng đáng kể, PATCH khi sửa câu chữ.
- `/speckit-plan` và `/speckit-analyze` MUST kiểm tra tuân thủ constitution; mọi ngoại lệ
  (ví dụ thêm backend, thêm thư viện nặng) MUST ghi lý do trong plan.

**Version**: 2.0.0 | **Ratified**: 2026-11-16 | **Last Amended**: 2026-11-17
