# Tóm tắt dự án: Website học tiếng Trung HSK

Cập nhật: 2026-11-17

## Dự án làm gì

Website học tiếng Trung cho người Việt mới bắt đầu, dùng tốt trên điện thoại, tablet và máy tính.
Bản đầu gồm chặng Pinyin và HSK 1–3 (khoảng 600 từ). HSK 4–6 hiện "sắp có" trên lộ trình.

Các tính năng chính:

1. **Flashcard HSK**: chữ Hán, pinyin, phát âm, mẹo nhớ, hình liên tưởng, câu ví dụ.
2. **Ôn tập ngắt quãng**: từ chưa nhớ ôn sớm, từ đã nhớ ôn thưa dần (1 → 3 → 7 → 14 → 30 → 60 ngày).
3. **Trang từ vựng**: tìm bằng chữ Hán, pinyin có hoặc không dấu, nghĩa tiếng Việt. Có thứ tự nét viết.
4. **Lộ trình học**: Pinyin → HSK 1 → HSK 2 → HSK 3, bài mở khoá lần lượt, có bài kiểm tra trình độ.
5. **Mục tiêu mỗi ngày**: bắt đầu 10 từ mới cộng thẻ cần ôn, website gợi ý tăng hoặc giảm theo sức học.
6. **Nhắc nhở học**: thông báo trên điện thoại, cài website như một app.
7. **Trang chủ**: giới thiệu tiếng Trung, phong cách Trung Hoa hiện đại, cuối trang chọn level.
8. **5 trò luyện tập**: Ghép cặp, Nghe chọn từ, Luyện viết, Sắp xếp câu, Đua thời gian, và Thử thách tuần.

## Quy trình đã làm (Spec Kit)

| Bước | Lệnh | Kết quả |
|---|---|---|
| 1 | `/speckit-constitution` | 6 nguyên tắc dự án: `.specify/memory/constitution.md` |
| 2 | `/speckit-specify` | Bản mô tả tính năng: `specs/001-hoc-tieng-trung-hsk/spec.md` |
| 3 | `/speckit-clarify` | Làm rõ 5 câu hỏi (trang chủ, mẹo nhớ, mục tiêu, trò chơi, phong cách) |
| 4 | `/speckit-plan` | Kế hoạch kỹ thuật, thiết kế, dữ liệu, các trang |
| 5 | `/speckit-tasks` | 118 việc chia theo 8 tính năng: `tasks.md` |
| 6 | `/speckit-analyze` | Soát chéo 3 vòng, đã sửa 1 lỗi nghiêm trọng và 17 lỗi khác |
| 7 | `/speckit-implement` | **Đang làm**: mới xong phần khởi tạo dự án |

## Tài liệu nằm ở đâu

Tất cả trong `specs/001-hoc-tieng-trung-hsk/`:

- `spec.md`: website làm gì, cho ai, đo thành công thế nào
- `plan.md`: công nghệ và cấu trúc thư mục
- `design-system.md`: màu, font, hiệu ứng, bố cục trang chủ
- `research.md`: 14 quyết định kỹ thuật kèm lý do
- `data-model.md`: các loại dữ liệu và quy tắc
- `tasks.md`: danh sách 118 việc
- `quickstart.md`: cách chạy và kiểm tra
- `contracts/`: danh sách trang, định dạng nội dung, cách lưu tiến độ, hàm nhắc nhở

## Các quyết định đã chốt

- **Công nghệ**: Vite + React + TypeScript + Tailwind. Website tĩnh, tiến độ lưu trên trình duyệt, không cần tài khoản.
- **Thiết kế**: nền giấy ngà `#F6EFE1`, mực `#1E1B18`, đỏ son `#B3261E`, vàng kim chỉ để trang trí.
- **Nét chữ**: thư viện Hanzi Writer, dữ liệu từ dự án Make Me a Hanzi.
- **Nhắc nhở**: một hàm nhỏ trên Cloudflare Workers để gửi thông báo đúng giờ. Đây là ngoại lệ duy nhất so với nguyên tắc "không có máy chủ". File lịch `.ics` là phương án dự phòng.
- **Ảnh minh hoạ**: tạo bằng Canva theo phong cách thuỷ mặc, duyệt từng ảnh. Đã có 3 ảnh mẫu trong `content-tools/samples/`.

## Tình trạng code

Thư mục `web/` mới ở bước khởi tạo (Phase 1, việc T001–T006):

- Đã tạo khung Vite + React + TypeScript và cài thư viện.
- Đã cấu hình Tailwind, Vitest (kiểm thử logic), Playwright (kiểm thử 3 bề rộng màn hình và 3 trình duyệt), Prettier.
- **Chưa có** giao diện, dữ liệu từ vựng hay tính năng nào. Mở website lúc này chỉ thấy trang mẫu của Vite.

Việc tiếp theo: Phase 2 (nền tảng chung, T007–T029), rồi Phase 3 (flashcard HSK 1, T030–T044) để có bản MVP.

## Cách chạy thử

```bash
cd web
npm install
npm run dev
```

## Việc còn treo

- **Người duyệt tiếng Trung**: cần người biết tiếng kiểm tra nghĩa và thanh điệu của 600 từ.
- **Ba nguồn chưa chốt giấy phép**: âm thanh Pinyin, danh sách từ HSK, điều khoản ảnh AI của Canva.
- **8 lỗi nhỏ trong tài liệu** từ vòng soát cuối, chưa sửa (không cản việc code).
- **Ba thư mục thừa** trong `.claude/skills/` (`spec-kit`, `ui-ux-pro-max-skill`, `.claude`): là bản copy nguyên repo, không phải skill. File `.gitignore` đã loại chúng khỏi git.
- **Hai tiêu chí không đo được** nếu không có công cụ thống kê: tỉ lệ quay lại hôm sau, tỉ lệ nhớ sau 7 ngày.
