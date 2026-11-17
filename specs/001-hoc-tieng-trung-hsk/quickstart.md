# Quickstart: Chạy và kiểm tra website

Hướng dẫn chạy thử và các kịch bản chứng minh tính năng hoạt động. Lệnh cụ thể sẽ có sau bước
implement; các tên lệnh dưới đây là quy ước sẽ được tạo trong `package.json`.

## Chuẩn bị

- Node.js bản LTS (≥ 20) và npm. Kiểm tra: `node -v`.
- Trình duyệt Chrome hoặc Edge; thêm một điện thoại thật (Android hoặc iPhone) để thử PWA và thông báo.

## Lệnh

| Lệnh | Làm gì |
|---|---|
| `npm install` | cài thư viện |
| `npm run validate:content` | kiểm tra dữ liệu từ vựng ([contracts/content-schema.md](./contracts/content-schema.md)) |
| `npm run dev` | chạy thử tại `http://localhost:5173` |
| `npm test` | chạy kiểm thử logic (lịch ôn, mục tiêu, trò chơi, tìm kiếm) |
| `npm run test:e2e` | chạy kiểm thử trình duyệt ở 360 / 768 / 1280px và chế độ giảm chuyển động |
| `npm run build && npm run preview` | build bản thật và xem thử (cần để thử PWA/offline) |

## Kịch bản kiểm tra (theo thứ tự ưu tiên)

1. **Flashcard (US1)**: mở `/`, cuộn xuống chọn HSK 1 → vào thẻ đầu trong ≤ 3 lần bấm. Lật thẻ thấy
   pinyin, nghĩa, mẹo nhớ, hình, câu ví dụ; bấm loa nghe được. Học hết bài → màn tổng kết + con dấu đỏ.
   Đóng tab giữa bài, mở lại → được hỏi học tiếp.
2. **Ôn tập (US2)**: học 10 từ, đánh 3 từ "Chưa nhớ". Trong DevTools đổi giờ hệ thống (hoặc dùng nút
   "giả lập ngày mai" chỉ có ở chế độ dev) → `/on-tap` có đúng 3 từ đó.
3. **Từ vựng (US3)**: `/tu-vung`, gõ `nihao`, `nǐ hǎo`, `你好`, `xin chao` → đều ra 你好. Mở chi tiết → xem
   nét viết, ≥ 2 câu ví dụ có nút nghe, bấm "Thêm vào ôn tập".
4. **Lộ trình (US4)**: `/lo-trinh` → Pinyin là chặng đầu, HSK 4–6 ghi "sắp có". Xong một bài → bài sau mở khoá.
5. **Mục tiêu (US5)**: mặc định 10 từ; học 5 từ → vòng 50%. Dùng dữ liệu mẫu "7 ngày đạt 6" → thấy gợi ý tăng.
6. **Nhắc nhở (US6)**: trên điện thoại, cài website lên màn hình chính, `/toi` → bật nhắc 1 phút sau, cho
   phép thông báo → nhận thông báo trong ≤ 15 phút (giới hạn của Cron). Thử từ chối quyền → thấy hướng dẫn.
   Thử nút "Thêm vào lịch điện thoại" → file `.ics` mở được trong ứng dụng Lịch.
7. **Trang chủ (US7)**: chữ bút lông tự viết, mực loang khi cuộn, nghe 4 thanh của "ma", chọn từng level
   đưa đúng trang; HSK 4–6 báo "đang soạn".
8. **Trò chơi (US8)**: chơi đủ 5 trò; đáp án nhiễu của 妈 có 马/吗; chơi 2 lượt liên tiếp không trùng
   câu hỏi; gặp ít nhất 1 sự kiện bất ngờ mỗi lượt; Thử thách tuần có các từ hay sai.

## Kiểm tra chung trước khi coi là xong (constitution)

- Mỗi màn hình ở 360 / 768 / 1280px: không cuộn ngang, nút ≥ 44px.
- Bật "Giảm chuyển động" của hệ điều hành → hiệu ứng tắt hoặc chỉ mờ dần, mọi chức năng vẫn dùng được.
- Tắt mạng sau khi đã mở website một lần → học tiếp được bài đang học.
- Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 90; trang chủ hiện phần đầu trong ≤ 2 giây.
