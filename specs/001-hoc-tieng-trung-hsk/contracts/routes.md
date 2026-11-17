# UI Contract: Các trang (routes)

Mọi trang dùng được ở 360 / 768 / 1280px. Thanh điều hướng: dưới đáy trên mobile (≤ 5 mục:
Học, Ôn tập, Từ vựng, Luyện tập, Tôi), trên đầu trên desktop. Trang chủ không có thanh dưới đáy.

| Đường dẫn | Trang | User story / FR |
|---|---|---|
| `/` | Trang chủ giới thiệu + chọn level, nút "Học tiếp" nếu có tiến độ | US7, FR-023–023d |
| `/kiem-tra-trinh-do` | Bài test xếp level | US4 kịch bản 3, US7 kịch bản 6 |
| `/hoc` | **Trang Hôm nay**: vòng mục tiêu, chuỗi ngày học, thẻ cần ôn, bài tiếp theo | US5, FR-009, FR-020 |
| `/lo-trinh` | Lộ trình các chặng | US4, FR-015–017 |
| `/lo-trinh/:stageId` | **Trang level**: danh sách bài của một cấp | FR-023b |
| `/bai/:lessonId` | Học bài bằng flashcard + màn tổng kết | US1, FR-003–007 |
| `/pinyin` | Chặng Pinyin & thanh điệu | FR-018 |
| `/on-tap` | Ôn tập thẻ đến hạn | US2, FR-008–010 |
| `/tu-vung` | Danh sách + lọc + tìm kiếm | US3, FR-011–012 |
| `/tu-vung/:wordId` | Chi tiết từ: nét viết, mẹo nhớ, hình, câu ví dụ, thêm vào ôn | US3, FR-013–014, FR-002c |
| `/luyen-tap` | Danh sách 5 trò + Thử thách tuần | US8, FR-024 |
| `/luyen-tap/:game` | Một trò (`ghep-cap`, `nghe-chon`, `luyen-viet`, `sap-xep-cau`, `dua-thoi-gian`, `thu-thach-tuan`) | FR-024a–g |
| `/toi` | Mục tiêu, nhắc nhở, huy hiệu, xuất/nhập/đặt lại tiến độ | US5, US6, FR-019b, FR-021, FR-025, FR-027, FR-029 |
| `/cai-dat-app` | Hướng dẫn thêm vào màn hình chính (iPhone/Android) | US6 kịch bản 5 |
| `/gioi-thieu` | Nguồn dữ liệu, giấy phép, quyền riêng tư | research R3, R10 |
| `*` | Trang không tìm thấy (tiếng Việt, nút về trang chủ) | |

Đường dẫn bằng tiếng Việt không dấu để dễ đọc và dễ chia sẻ. Mọi trang có deep link (mở thẳng được).
