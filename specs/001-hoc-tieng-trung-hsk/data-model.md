# Data Model: Website học tiếng Trung HSK

Hai loại dữ liệu:

- **Nội dung** (chỉ đọc, đóng gói cùng website, file JSON trong `public/data/`): Word, ExampleSentence,
  Mnemonic, Lesson, RoadmapStage, BadgeDefinition. Định dạng chi tiết: [contracts/content-schema.md](./contracts/content-schema.md).
- **Tiến độ người học** (đọc/ghi, lưu trên trình duyệt): CardProgress, DailyGoal, Streak, Reminder,
  EarnedBadge, GameSession, WeeklyChallenge, UserSettings. Định dạng lưu: [contracts/storage-schema.md](./contracts/storage-schema.md).

## Nội dung

### Word (Từ vựng)
| Trường | Kiểu | Quy tắc |
|---|---|---|
| id | string | duy nhất, dạng `hsk1-001` |
| hanzi | string | chữ giản thể, 1–4 chữ |
| pinyin | string | có dấu thanh (`nǐ hǎo`), bắt buộc |
| pinyinPlain | string | sinh lúc build: bỏ dấu, bỏ cách (`nihao`) |
| tones | number[] | 0–4, một số cho mỗi âm tiết; số phần tử = số chữ |
| meaningVi | string[] | ≥ 1 nghĩa |
| partOfSpeech | enum | danh, động, tính, phó, lượng, đại, giới, liên, trợ, thán, số |
| hskLevel | 1–6 | bản đầu chỉ có 1–3 |
| topic | string | id chủ đề (chào hỏi, số đếm, gia đình…) |
| kind | `concrete` \| `abstract` | quyết định có ảnh minh hoạ hay hình tách bộ thủ (FR-002b) |
| image | string? | đường dẫn WebP, BẮT BUỘC khi `kind = concrete` |
| examples | ExampleSentence[] | ≥ 2 câu (FR-002) |
| mnemonic | Mnemonic | bắt buộc (FR-002a) |

Hai loại dữ liệu sau **không nằm trong Word** và không soạn tay; script sinh ra file riêng trong
`public/data/generated/` (xem contracts/content-schema.md):

- **ConfusablesMap** (`generated/confusables.json`): `{ "<wordId>": ["<wordId>", …] }` — id các từ dễ nhầm
  (cùng âm khác thanh, gần hình, cùng chủ đề), dùng cho đáp án nhiễu (FR-024c).
- **ComponentsMap** (`generated/components.json`): `{ "<chữ>": { decomposition, groups: number[][] } }` — lấy
  từ trường `decomposition` và `matches` của Make Me a Hanzi; mỗi nhóm là chỉ số các nét thuộc một thành
  phần, dùng để tô màu hình tách bộ thủ. Chữ không có mục → tô một màu.

### ExampleSentence (Câu ví dụ)
| Trường | Kiểu | Quy tắc |
|---|---|---|
| hanzi | string | chỉ dùng từ có cấp ≤ cấp của từ chính (kiểm tra lúc build) |
| pinyin | string | có dấu thanh |
| meaningVi | string | |
| tokens | string[] | câu đã tách từ, dùng cho trò Sắp xếp câu |

### Mnemonic (Mẹo nhớ)
| Trường | Kiểu | Quy tắc |
|---|---|---|
| components | {part: string, meaningVi: string}[] | các thành phần/bộ thủ của từng chữ |
| story | string | câu chuyện liên tưởng tiếng Việt, ≤ 2 câu (~200 ký tự) |

### Lesson (Bài học)
| Trường | Kiểu | Quy tắc |
|---|---|---|
| id | string | `hsk1-l01` |
| stageId | string | thuộc RoadmapStage |
| order | number | thứ tự trong chặng |
| titleVi | string | |
| topic | string | |
| wordIds | string[] | 8–12 từ (khoảng 10, FR-015) |

### RoadmapStage (Chặng lộ trình)
| Trường | Kiểu | Quy tắc |
|---|---|---|
| id | `pinyin` \| `hsk1`…`hsk6` | |
| order | number | pinyin = 0 |
| titleVi, descriptionVi | string | mô tả "bạn đã biết gì" để chọn level (FR-023a) |
| status | `available` \| `coming_soon` | HSK 4–6 = `coming_soon` (FR-017) |
| lessonIds | string[] | rỗng khi `coming_soon` |

### BadgeDefinition (Huy hiệu)
`id`, `titleVi`, `descriptionVi`, `rule` (ví dụ `{type: "words_learned", value: 50}`, `{type: "streak", value: 7}`,
`{type: "stage_complete", stageId: "hsk1"}`, `{type: "weekly_challenge"}`).

## Tiến độ người học

### CardProgress (Tiến độ thẻ) — một bản ghi cho mỗi từ đã gặp
| Trường | Kiểu | Quy tắc |
|---|---|---|
| wordId | string | khoá |
| box | 0–6 | hộp Leitner (research R9) |
| dueDate | `YYYY-MM-DD` | theo giờ địa phương |
| lastRating | `again` \| `hard` \| `good` | Chưa nhớ / Hơi nhớ / Đã nhớ |
| reviewCount, lapseCount | number | |
| wrongInGames7d | {date, count}[] | dùng cho Thử thách tuần |
| addedManually | boolean | thêm từ trang chi tiết (FR-014) |

**Chuyển trạng thái** (khoảng ôn theo hộp: 0, 1, 3, 7, 14, 30, 60 ngày):
```
mới học ──đánh giá──▶ good: box=1 | hard: box=1 | again: box=0 (ôn lại ngay trong buổi)
ôn tập  ──good──▶ box = min(box+1, 6), due = hôm nay + khoảng(box)
        ──hard──▶ box giữ nguyên, due = hôm nay + 1
        ──again─▶ box = 1, due = hôm nay + 1, lapseCount++
trò chơi trả lời sai ─▶ như again
```
Trạng thái hiển thị: `chưa học` (không có bản ghi), `đang học` (box 0–4), `đã thuộc` (box ≥ 5).

### DailyGoal (Mục tiêu hằng ngày)
| Trường | Kiểu | Quy tắc |
|---|---|---|
| newWordsTarget | 3–20 | mặc định 10 (FR-019, FR-019b) |
| today | {date, newLearned, newAvailable, reviewsDone, reviewsDue} | tính lại mỗi ngày mới |
| history | {date, met: boolean}[] | giữ 30 ngày |
| lastSuggestionDate | date? | không gợi ý lại trong 7 ngày (FR-019a) |
| pendingSuggestion | {direction: up\|down, from, to}? | chờ người học đồng ý |

**Quy tắc**: đạt mục tiêu khi `newLearned ≥ min(newWordsTarget, newAvailable)` VÀ
`reviewsDone ≥ min(reviewsDue, dailyReviewCap)`. `newAvailable` = số từ chưa học còn lại trong các cấp
đã có nội dung tại đầu ngày; khi `newAvailable = 0` thì chỉ cần ôn hết thẻ đến hạn (và nếu cũng không có
thẻ đến hạn thì hoàn thành một lượt Luyện tập bất kỳ được tính là đạt).
Gợi ý tăng khi ≥ 6/7 ngày gần nhất đạt và tỉ lệ "good" trong ôn tập ≥ 80%; giảm khi ≤ 3/7 ngày đạt.
Bước thay đổi: +3 hoặc −2, kẹp trong 3–20.

### Streak (Chuỗi ngày học)
`current`, `best`, `lastActiveDate`, `activeDates: date[]`. Một ngày "có học" = đạt mục tiêu ngày đó.
Mở app mà `lastActiveDate` < hôm qua → `current = 0` (US5 kịch bản 6).

### Reminder (Lịch nhắc)
| Trường | Kiểu | Quy tắc |
|---|---|---|
| enabled | boolean | |
| time | `HH:mm` | |
| weekdays | 0–6[] | ≥ 1 ngày |
| timezone | IANA string | ví dụ `Asia/Ho_Chi_Minh` |
| channel | `push` \| `calendar` | `calendar` = đã tải file .ics |
| deviceId | string | mã ngẫu nhiên, chỉ dùng cho hàm nhắc (research R10) |
| permission | `granted` \| `denied` \| `default` | |

### EarnedBadge
`badgeId`, `earnedAt`.

### GameSession (Lượt chơi)
| Trường | Kiểu | Quy tắc |
|---|---|---|
| game | `match` \| `listen` \| `write` \| `order` \| `race` \| `weekly` | |
| scope | {type: lesson\|level\|due, id?} | FR-024a |
| questionIds | string[] | dùng để không lặp bộ câu hỏi lượt liền trước (FR-024d) |
| score, maxCombo | number | |
| wrongWordIds | string[] | |
| events | string[] | sự kiện bất ngờ đã xảy ra (FR-024f) |
| playedAt | datetime | |
Chỉ giữ lượt gần nhất của mỗi trò + `bestScore` theo trò.

### WeeklyChallenge
`weekStart` (thứ Hai), `wordIds` (từ sai nhiều nhất 7 ngày, bù bằng từ mới học — FR-024g), `completed`, `score`.

### UserSettings
`selectedLevel` (FR-023b), `studyDirection` (`hanzi_to_meaning` \| `meaning_to_hanzi`, FR-006),
`dailyReviewCap` (mặc định 50, chỉnh trong khoảng 10–100, FR-010), `soundOn`, `lastLessonPosition` {lessonId, cardIndex} (FR-007),
`hasSeenIntro`.
