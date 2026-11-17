# Contract: Hàm nhắc nhở (Reminder Worker)

Hàm serverless tách biệt (research R10). Website vẫn chạy đầy đủ nếu hàm này không có.
Mọi yêu cầu gửi kèm `deviceId` (UUID ngẫu nhiên do app tạo). Không nhận và không lưu tên, email,
số điện thoại hay nội dung học.

| Phương thức | Đường dẫn | Thân yêu cầu | Kết quả |
|---|---|---|---|
| PUT | `/reminders/:deviceId` | `{ subscription, time: "20:00", weekdays: [1,2,3,4,5], timezone: "Asia/Ho_Chi_Minh", forecast }` | `204` |
| POST | `/reminders/:deviceId/done` | `{ date: "2026-11-16", forecast }` — đã đạt mục tiêu hôm nay | `204` |

`forecast` = `{ dueByDate: { "2026-11-17": 12, "2026-11-18": 15, … }, hasNewWords: true }`: app tự tính số thẻ
sẽ đến hạn cho từng ngày trong **14 ngày tới** (giả sử từ giờ không ôn thêm, đã kẹp theo `dailyReviewCap`),
và còn từ mới để học hay không. App gửi lại `PUT` kèm `forecast` mới mỗi ngày một lần khi người dùng mở app
(nếu đang bật nhắc), để con số luôn mới.
| DELETE | `/reminders/:deviceId` | — | `204`, xoá toàn bộ dữ liệu của thiết bị |

Lỗi: `400` (sai định dạng, thông điệp tiếng Việt), `404` (không có thiết bị), `429` (gọi quá nhiều).

**Cron mỗi 15 phút**: với mỗi thiết bị đến giờ nhắc (theo múi giờ của thiết bị), đúng ngày trong tuần,
và `done.date` ≠ hôm nay → gửi Web Push:

```json
{ "title": "Đến giờ học tiếng Trung rồi!", "body": "Bạn có 12 thẻ cần ôn hôm nay.", "url": "/on-tap" }
```

Nội dung thông báo chọn theo `forecast.dueByDate[hôm nay]` (gọi là N), không tính trên máy chủ:

| Trường hợp | `body` | `url` |
|---|---|---|
| N > 0 | "Bạn có N thẻ cần ôn hôm nay." | `/on-tap` |
| N = 0 và `hasNewWords` | "Hôm nay có từ mới đang chờ bạn." | `/hoc` |
| N = 0 và hết từ mới | "Chơi một lượt luyện tập để giữ chuỗi ngày học nhé." | `/luyen-tap` |
| Không có số cho hôm nay (hơn 14 ngày chưa mở app) | "Lâu rồi chưa gặp bạn. Vào ôn vài thẻ nhé!" | `/hoc` |
Thông báo trễ tối đa 15 phút so với giờ đã đặt (chấp nhận được với nhắc học).
Đăng ký đẩy hết hạn (`410 Gone` từ dịch vụ đẩy) → tự xoá thiết bị.

**Bảo mật**: khoá VAPID lưu trong biến bí mật của Worker, không đưa vào code; CORS chỉ cho tên miền
của website; giới hạn tần suất theo `deviceId`.
