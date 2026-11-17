# Contract: Lưu tiến độ và file xuất/nhập

## Lưu trên trình duyệt

Một khoá localStorage duy nhất: `hoc-tieng-trung:v1`, giá trị là JSON:

```json
{
  "schemaVersion": 1,
  "settings":   { "...": "UserSettings" },
  "cards":      { "<wordId>": { "...": "CardProgress" } },
  "goal":       { "...": "DailyGoal" },
  "streak":     { "...": "Streak" },
  "reminder":   { "...": "Reminder" },
  "badges":     [ { "badgeId": "...", "earnedAt": "..." } ],
  "games":      { "<game>": { "last": "GameSession", "bestScore": 0 } },
  "weekly":     { "...": "WeeklyChallenge" }
}
```

- Khi `schemaVersion` tăng, app MUST chạy hàm chuyển đổi tuần tự (v1→v2→…) trước khi đọc.
- Nếu đọc lỗi (JSON hỏng): giữ bản sao vào `hoc-tieng-trung:backup-<ngày>`, khởi tạo mới, và báo người
  dùng bằng tiếng Việt kèm nút tải bản sao.
- Ngày tính theo giờ địa phương của thiết bị (Edge Case "học qua nửa đêm").

## File xuất/nhập (FR-027)

- Tên file: `tien-do-hoc-tieng-trung-YYYY-MM-DD.json`.
- Nội dung: đúng object ở trên + `"exportedAt"` + `"app": "hoc-tieng-trung"`. Không có `reminder.deviceId`
  (máy mới tự tạo mã mới).
- Nhập: kiểm tra `app` và `schemaVersion`; nếu máy hiện tại đã có tiến độ, hỏi "Thay thế" hay "Huỷ"
  (không gộp ở bản đầu). Đặt lại tiến độ (FR-029) yêu cầu xác nhận hai bước.
