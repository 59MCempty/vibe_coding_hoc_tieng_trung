<!--
Sync Impact Report
- Version change: (template, chưa có) → 1.0.0
- Modified principles: không có (lần đầu điền template)
- Added principles:
  I. Responsive trên mọi thiết bị (Mobile-First)
  II. Đơn giản cho người mới bắt đầu
  III. Giao diện có bản sắc, không "mùi AI"
  IV. Hiệu ứng nổi bật nhưng có mục đích
  V. Nội dung tiếng Trung chính xác
  VI. Giữ mọi thứ đơn giản (Vibe-Coding Friendly)
- Added sections: Tiêu chuẩn chất lượng & hiệu năng; Quy trình phát triển; Governance
- Removed sections: không có
- Templates: plan/spec/tasks templates đọc constitution khi chạy, không cần sửa ở bước này
- Deferred TODOs: không có
-->

# Học Tiếng Trung Constitution

## Core Principles

### I. Responsive trên mọi thiết bị (Mobile-First)

- Mọi màn hình MUST được thiết kế cho điện thoại trước, rồi mở rộng lên tablet và desktop.
- Mọi tính năng MUST dùng được đầy đủ ở các bề rộng 360px, 768px và 1280px trở lên,
  không có thanh cuộn ngang và không có nội dung bị che hoặc cắt.
- Vùng bấm (nút, thẻ, ô chọn) MUST có kích thước tối thiểu 44×44px.
- Chữ Hán MUST hiển thị đủ lớn để nhìn rõ nét trên điện thoại (tối thiểu 24px ở thẻ học).

Lý do: người học chủ yếu học trên điện thoại, trong lúc rảnh, bằng một tay.

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
  khoảng 60fps trên điện thoại tầm trung, và tương tác thường ngày MUST xong trong ≤ 400ms.
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

- Lighthouse trên mobile: Performance ≥ 85, Accessibility ≥ 90.
- Tương phản chữ đạt chuẩn WCAG AA (≥ 4.5:1 cho chữ thường).
- Mọi chức năng dùng được bằng bàn phím; có trạng thái focus nhìn thấy được.
- Trang đầu tiên tải xong và tương tác được trong ≤ 3 giây trên mạng 4G.
- Hỗ trợ trình duyệt: Chrome, Safari (iOS), Edge, Firefox bản mới nhất.
- Thông báo lỗi bằng tiếng Việt, nói rõ người dùng cần làm gì tiếp.

## Quy trình phát triển

- Mọi tính năng đi theo chuỗi Spec Kit: `/speckit-specify` → `/speckit-clarify` →
  `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` → `/speckit-implement`.
- Ở bước plan, MUST chạy skill `ui-ux-pro-max` để chốt design system trước khi viết giao diện.
- Trước khi coi một tính năng là xong, MUST tự kiểm tra trên 3 bề rộng (360px, 768px,
  1280px) và một lần với `prefers-reduced-motion` bật.
- Mỗi tính năng MUST có tiêu chí chấp nhận đo được trong spec, và được đối chiếu khi xong.

## Governance

- Constitution này đứng trên mọi hướng dẫn khác của dự án; khi spec hoặc plan mâu thuẫn
  với nó, constitution thắng, trừ khi constitution được sửa trước.
- Sửa constitution bằng `/speckit-constitution`, ghi rõ lý do và cập nhật Sync Impact Report.
- Phiên bản theo semantic versioning: MAJOR khi bỏ hoặc định nghĩa lại nguyên tắc,
  MINOR khi thêm nguyên tắc hoặc mở rộng đáng kể, PATCH khi sửa câu chữ.
- `/speckit-plan` và `/speckit-analyze` MUST kiểm tra tuân thủ constitution; mọi ngoại lệ
  (ví dụ thêm backend, thêm thư viện nặng) MUST ghi lý do trong plan.

**Version**: 1.0.0 | **Ratified**: 2026-11-16 | **Last Amended**: 2026-11-16
