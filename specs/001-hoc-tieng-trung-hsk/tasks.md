---

description: "Task list for Website học tiếng Trung HSK"
---

# Tasks: Website học tiếng Trung HSK

**Input**: Design documents from `/specs/001-hoc-tieng-trung-hsk/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md),
[contracts/](./contracts/), [design-system.md](./design-system.md), [quickstart.md](./quickstart.md)

**Tests**: Spec không yêu cầu TDD. Plan (R12) và constitution yêu cầu: kiểm thử logic có quy tắc số
(lịch ôn, mục tiêu, trò chơi, tìm kiếm, dữ liệu) bằng Vitest, và kiểm tra mỗi story ở 360/768/1280px +
reduced motion bằng Playwright. Chỉ các test đó được đưa vào; viết test logic trước phần cài đặt tương ứng.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US8)
- Đường dẫn theo plan.md: app chính trong `web/`, hàm nhắc trong `reminder-worker/`, công cụ nội dung trong `content-tools/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Khởi tạo dự án và công cụ

- [X] T001 Tạo cấu trúc thư mục `web/`, `reminder-worker/`, `content-tools/` (prompts/, review/, samples/) đúng như mục Source Code trong specs/001-hoc-tieng-trung-hsk/plan.md
- [X] T002 Khởi tạo Vite + React + TypeScript (strict) trong web/ và cài React Router, Zustand, Tailwind CSS, Lucide React, vite-plugin-pwa; ghi lệnh `dev`, `build`, `preview`, `test`, `test:e2e`, `validate:content` vào web/package.json
- [X] T003 [P] Cấu hình ESLint + Prettier cho TypeScript/React trong web/eslint.config.js và web/.prettierrc
- [X] T004 [P] Cấu hình Vitest (môi trường jsdom) trong web/vitest.config.ts và thư mục web/tests/unit/
- [X] T005 [P] Cấu hình Playwright trong web/playwright.config.ts: 3 kích thước 360×800, 768×1024, 1280×800 và một project `reducedMotion: 'reduce'` chạy trên Chromium; thêm project WebKit (Safari) 360×800 và Firefox 1280×800 để phủ các trình duyệt constitution yêu cầu (Chrome, Safari, Edge, Firefox)
- [X] T006 [P] Tạo web/.gitignore và gốc dự án .gitignore (node_modules, dist, .env, .wrangler)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Nền tảng dùng chung cho mọi story

**⚠️ CRITICAL**: Chưa xong phase này thì chưa làm story nào

### Thiết kế và khung giao diện

- [X] T007 Tạo web/src/styles/tokens.css với toàn bộ biến màu trong design-system.md (`--paper #F6EFE1`, `--paper-deep #ECE1CB`, `--card #FBF7EE`, `--ink #1E1B18`, `--ink-soft #5A524A`, `--cinnabar #B3261E`, `--cinnabar-deep #8C1D17`, `--gold #C9A04A` chỉ dùng trang trí, `--gold-text #7A5A12`, `--jade #2F6B4F`, `--line #D9CCB3`, `--ring #B3261E`), 5 màu thanh điệu, bo góc 6px/10px, thang khoảng cách 4px, và nối vào Tailwind theme trong web/tailwind.config.ts
- [X] T008 Tải font Ma Shan Zheng, Noto Serif SC, Noto Serif, Be Vietnam Pro (Google Fonts, `display=swap`, có subset tiếng Việt) trong web/index.html và khai báo `font-family` trong web/src/styles/tokens.css; đặt body 16px / line-height 1.6
- [X] T009 [P] Thêm texture giấy ≤ 20KB vào web/public/textures/paper.webp và lớp phủ `opacity: .25` trong web/src/styles/global.css
- [X] T010 [P] Viết helper hiệu ứng web/src/lib/motion.ts: hàm `prefersReducedMotion()`, `animateOrSkip()` trả về trạng thái cuối ngay khi reduced motion, quy ước chỉ animate `transform`/`opacity`
- [X] T011 [P] Tạo component UI cơ bản trong web/src/components/ui/: Button.tsx (vùng bấm ≥ 44×44px, focus outline 2px `--ring` offset 2px), Card.tsx (bo 10px, bóng một lớp theo design-system.md), Seal.tsx (con dấu đỏ: scale 1.4→1, rotate −8°→−4°, 350ms `back.out`, fade 150ms khi reduced motion)
- [X] T012 [P] Tạo web/src/components/ui/ProgressRing.tsx (vẽ % bằng stroke-dashoffset, 600ms) và web/src/components/ui/PinyinText.tsx (tô màu theo thanh điệu, luôn giữ dấu thanh, không chỉ dựa vào màu)
- [X] T013 Tạo router và layout trong web/src/app/router.tsx và web/src/app/Layout.tsx: khai báo mọi đường dẫn trong contracts/routes.md (trang tạm "Đang xây dựng" cho route chưa làm), tách code theo trang (lazy import), trang 404 tiếng Việt
- [X] T014 Tạo thanh điều hướng web/src/app/NavBar.tsx: dưới đáy trên mobile với đúng 5 mục "Học, Ôn tập, Từ vựng, Luyện tập, Tôi", trên đầu ở ≥ 768px, ẩn ở trang chủ `/`

### Dữ liệu và lưu trữ

- [X] T015 Khai báo kiểu nội dung trong web/src/types/content.ts theo data-model.md: Word (id dạng `hsk1-001`, `tones` 0–4 mỗi âm tiết, `kind: 'concrete' | 'abstract'`, `image` BẮT BUỘC khi `kind = concrete`, `examples` ≥ 2), kiểu cho hai file sinh tự động `ConfusablesMap` và `ComponentsMap`, ExampleSentence (`tokens`), Mnemonic (`components` không rỗng, `story` ≤ 200 ký tự), Lesson (8–12 từ), RoadmapStage (`status: 'available' | 'coming_soon'`), BadgeDefinition
- [X] T016 Khai báo kiểu tiến độ trong web/src/types/progress.ts theo data-model.md: CardProgress (`box` 0–6, `lastRating: 'again' | 'hard' | 'good'`), DailyGoal (`newWordsTarget` 3–20, mặc định 10), Streak, Reminder (`weekdays` ≥ 1 ngày, `channel: 'push' | 'calendar'`), EarnedBadge, GameSession, WeeklyChallenge, UserSettings (`dailyReviewCap` mặc định 50)
- [X] T017 Viết web/src/lib/date.ts: ngày dạng `YYYY-MM-DD` theo giờ địa phương thiết bị, cộng ngày, đầu tuần (thứ Hai), so sánh ngày
- [X] T018 Viết kho trạng thái web/src/store/index.ts bằng Zustand + persist: một khoá localStorage `hoc-tieng-trung:v1`, `schemaVersion: 1`, đủ các nhánh `settings, cards, goal, streak, reminder, badges, games, weekly` theo contracts/storage-schema.md
- [X] T019 Viết web/src/store/migrate.ts: chạy chuyển đổi tuần tự khi `schemaVersion` tăng; khi JSON hỏng thì lưu bản sao vào `hoc-tieng-trung:backup-<ngày>`, khởi tạo mới và trả về cờ để giao diện báo lỗi tiếng Việt kèm nút tải bản sao
- [X] T020 [P] Viết web/src/lib/content.ts: tải `public/data/*.json` theo cấp, cache trong bộ nhớ, hàm `getWord`, `getLesson`, `getStage`, `getWordsByLevel`, `getConfusables(wordId)` và `getComponents(chữ)` đọc từ web/public/data/generated/
- [X] T021 [P] Viết web/src/lib/speech.ts: phát âm bằng Web Speech API giọng `zh-CN`, phát file mp3 khi có `audioSrc`, phát hiện không có giọng tiếng Trung và trả về lỗi để hiện hướng dẫn tiếng Việt (không chặn việc học)

### Công cụ nội dung

- [X] T022 Viết script kiểm tra web/scripts/validate-content.ts đủ 9 quy tắc trong contracts/content-schema.md (đủ trường, id không trùng; pinyin có dấu và số âm tiết = số chữ, `tones` khớp dấu; `examples.length ≥ 2` và ghép `tokens` = `hanzi`; cảnh báo câu dùng từ cấp cao hơn; `concrete` có file ảnh, mọi chữ có file nét; mnemonic hợp lệ; mỗi bài 8–12 từ và mỗi từ thuộc đúng một bài; báo cáo % có ảnh và mẹo nhớ); có hai chế độ: `--draft` bỏ qua các quy tắc cần file đã sinh (file ảnh, file nét) để kiểm tra nội dung đang soạn, và chế độ đầy đủ (mặc định) chạy trước `build`
- [X] T023 [P] Viết web/tests/unit/validate-content.test.ts với dữ liệu mẫu đúng và sai cho từng quy tắc của T022
- [X] T024 [P] Viết script web/scripts/build-search-index.ts tạo `pinyinPlain` (bỏ dấu, bỏ khoảng trắng: `nǐ hǎo` → `nihao`) và nghĩa tiếng Việt bỏ dấu (`xin chào` → `xin chao`) cho mọi từ, ghi ra web/public/data/generated/search-index.json
- [X] T025 [P] Viết script web/scripts/build-confusables.ts sinh `confusables` cho mỗi từ: cùng âm khác thanh, chữ có thành phần chung (từ dữ liệu decomposition Make Me a Hanzi), cùng chủ đề; ghi ra web/public/data/generated/confusables.json dạng `{ "<wordId>": ["<wordId>", …] }` (file sinh tự động, không sửa tay, không ghi vào words/*.json)
- [X] T026 [P] Viết web/scripts/fetch-strokes.ts: lấy dữ liệu nét từ hanzi-writer-data cho mọi chữ Hán xuất hiện trong từ và câu ví dụ, lưu vào web/public/strokes/<chữ>.json; đồng thời tải file từ điển của Make Me a Hanzi (dictionary.txt), lấy trường `decomposition` và `matches` (nét nào thuộc thành phần nào) để sinh web/public/data/generated/components.json dạng `{ "<chữ>": { "decomposition": "…", "groups": [[0,1,2],[3,4]] } }` (mỗi nhóm là chỉ số các nét thuộc một thành phần), chữ thiếu dữ liệu thì không có mục; ghi nguồn và giấy phép (Arphic Public License / LGPL) vào web/public/data/credits.json
- [X] T027 Viết mẫu soạn nội dung content-tools/prompts/word-content.md: định dạng JSON đúng contracts/content-schema.md, nghĩa tiếng Việt, 2 câu ví dụ chỉ dùng từ cùng cấp trở xuống, mẹo nhớ (tách thành phần + câu chuyện ≤ 2 câu), phân loại `concrete`/`abstract`
- [X] T028 Viết hướng dẫn ảnh Canva content-tools/prompts/image-style.md: câu lệnh chung (thuỷ mặc tối giản, mực đen trên giấy ngà, một điểm nhấn đỏ son, không chữ, không khung, phẳng 2D, vuông) + bài học từ 3 ảnh mẫu trong content-tools/samples/: thêm "chủ thể ở giữa, chiếm khoảng 60% khung hình"; với từ hành động thêm "người vẽ giản lược vài nét, không vẽ mặt chi tiết, không trang phục cổ" và nêu rõ đồ vật; quy trình xuất PNG 512×512 → WebP ≤ 40KB; kiểm tra lại điều khoản giấy phép nội dung Canva trước khi đưa lên web
- [X] T029 Tạo web/public/data/stages.json: 7 chặng `pinyin, hsk1…hsk6`, `hsk4–hsk6` có `status: "coming_soon"` và `lessonIds` rỗng, mỗi chặng có `descriptionVi` "bạn đã biết gì" dùng cho phần chọn level

**Checkpoint**: Nền tảng xong — có thể bắt đầu các story

---

## Phase 3: User Story 1 - Học từ mới HSK bằng flashcard (Priority: P1) 🎯 MVP

**Goal**: Người mới học được bài HSK 1 bằng flashcard có pinyin, phát âm, mẹo nhớ, hình, câu ví dụ, và màn tổng kết.

**Independent Test**: Mở `/lo-trinh/hsk1` → bài 1 → học hết thẻ, nghe phát âm, lật thẻ, thấy màn tổng kết; đóng tab giữa bài, mở lại được hỏi học tiếp. Không cần đăng ký.

### Nội dung cho US1

- [ ] T030 [US1] Soạn nội dung HSK 1 (khoảng 150 từ) theo content-tools/prompts/word-content.md vào web/public/data/words/hsk1.json và chia bài 8–12 từ theo chủ đề vào web/public/data/lessons/hsk1.json; chạy `validate:content -- --draft` không lỗi (kiểm tra đầy đủ chạy ở T033, sau khi có ảnh và file nét)
- [ ] T031 [US1] Người duyệt kiểm tra nghĩa, pinyin, câu ví dụ, mẹo nhớ của HSK 1 và ghi kết quả vào content-tools/review/hsk1.md (SC-008)
- [ ] T032 [P] [US1] Tạo ảnh Canva cho các từ `concrete` của HSK 1 theo content-tools/prompts/image-style.md: làm 20 ảnh đầu, duyệt "mùi AI", đạt mới làm tiếp; lưu web/public/images/words/<wordId>.webp (≤ 40KB). Nếu 20 ảnh đầu không đạt, chuyển các từ đó sang `abstract` (hình tách bộ thủ) theo research R5
- [ ] T033 [US1] Chạy web/scripts/fetch-strokes.ts cho HSK 1 và web/scripts/build-search-index.ts, build-confusables.ts; sau khi T032 xong, chạy `validate:content` chế độ đầy đủ không lỗi (từ `concrete` nào chưa có ảnh đạt thì đổi sang `abstract` trước khi chạy)

### Logic cho US1

- [ ] T034 [P] [US1] Viết test web/tests/unit/lesson-session.test.ts: thứ tự thẻ, chấm 3 mức, thẻ "Chưa nhớ" quay lại cuối buổi, lưu/khôi phục vị trí `lastLessonPosition`
- [ ] T035 [US1] Viết web/src/features/flashcard/lessonSession.ts: tạo buổi học từ Lesson, ghi đánh giá vào CardProgress theo quy tắc "mới học" trong data-model.md (`good` → box=1, `hard` → box=1, `again` → box=0 và ôn lại ngay trong buổi), lưu `lastLessonPosition` sau mỗi thẻ (FR-007)

### Giao diện cho US1

- [ ] T036 [P] [US1] Tạo web/src/features/flashcard/FlashCard.tsx: mặt trước chữ Hán Noto Serif SC ≥ 72px trên mobile; mặt sau pinyin (PinyinText), nghĩa, mẹo nhớ, hình liên tưởng, 1 câu ví dụ có nút nghe; lật bằng chạm/chuột/phím cách, rotateY 400ms `power2.out` (fade khi reduced motion) (FR-003, FR-002c)
- [ ] T037 [P] [US1] Tạo web/src/components/ui/MnemonicView.tsx: hiện các thành phần + nghĩa từng phần + câu chuyện; với `concrete` hiện ảnh (lazy load, giữ chỗ để không xô lệch bố cục), với `abstract` hiện hình tách bộ thủ (T038)
- [ ] T038 [P] [US1] Tạo web/src/components/ui/RadicalSplit.tsx: vẽ SVG chữ Hán từ dữ liệu nét, tô màu khác nhau cho từng thành phần theo `groups` trong web/public/data/generated/components.json (chữ không có mục trong file đó thì tô một màu và vẫn hiện danh sách thành phần bằng chữ), hiệu ứng các thành phần trượt vào ghép thành chữ (hiện sẵn khi reduced motion) (FR-002b)
- [ ] T039 [P] [US1] Tạo web/src/components/ui/SpeakButton.tsx dùng web/src/lib/speech.ts, phát trong ≤ 1 giây, báo lỗi tiếng Việt khi máy không có giọng tiếng Trung (SC-004)
- [ ] T040 [US1] Tạo trang web/src/pages/LessonPage.tsx (`/bai/:lessonId`): thanh tiến độ trong bài, 3 nút "Chưa nhớ / Hơi nhớ / Đã nhớ" (FR-005), chuyển hướng học "chữ → nghĩa" hoặc "nghĩa → chữ" (FR-006)
- [ ] T041 [US1] Tạo web/src/features/flashcard/LessonSummary.tsx: số từ đã nhớ/chưa nhớ, con dấu đỏ (Seal) và hiệu ứng chúc mừng, nút học bài tiếp / ôn lại từ chưa nhớ
- [ ] T042 [US1] Thêm hộp thoại "Học tiếp từ thẻ đang dở?" khi mở lại bài còn dở trong web/src/pages/LessonPage.tsx
- [ ] T043 [US1] Tạo trang web/src/pages/StagePage.tsx (`/lo-trinh/:stageId`) bản đơn giản: danh sách bài của cấp, bấm vào bài thì mở `/bai/:lessonId` (lộ trình đầy đủ ở US4); đồng thời cho `/` tạm chuyển hướng tới `/lo-trinh/hsk1` trong web/src/app/router.tsx để bản MVP mở ra là học được ngay (bỏ chuyển hướng này ở T094)
- [ ] T044 [US1] Viết e2e web/tests/e2e/us1-flashcard.spec.ts theo kịch bản 1 trong quickstart.md, chạy ở mọi project Playwright; đếm số lần bấm từ `/lo-trinh/hsk1` tới thẻ đầu tiên và khẳng định ≤ 2 (để tổng từ trang chủ ≤ 3 theo constitution II)

**Checkpoint**: US1 chạy độc lập — đây là MVP

---

## Phase 4: User Story 2 - Ôn tập lặp lại ngắt quãng (Priority: P2)

**Goal**: Từ đã học được tự lên lịch ôn theo hộp Leitner, mỗi ngày có danh sách cần ôn.

**Independent Test**: Học 10 từ, đánh 3 từ "Chưa nhớ", giả lập sang ngày mai → `/on-tap` có đúng 3 từ đó.

- [ ] T045 [P] [US2] Viết test web/tests/unit/review-schedule.test.ts: khoảng ôn theo hộp "0, 1, 3, 7, 14, 30, 60 ngày"; `good` → `box = min(box+1, 6)`; `hard` → giữ hộp, ôn sau 1 ngày; `again` → `box = 1`, ôn sau 1 ngày, `lapseCount++`; giới hạn theo `dailyReviewCap` (mặc định 50, khoảng 10–100) ưu tiên thẻ quá hạn lâu nhất; trạng thái hiển thị `đang học` (box 0–4) / `đã thuộc` (box ≥ 5)
- [ ] T046 [US2] Viết web/src/features/review/schedule.ts đúng các quy tắc của T045 và hàm `getDueCards(today, cap)` (FR-008, FR-010)
- [ ] T047 [US2] Tạo trang web/src/pages/ReviewPage.tsx (`/on-tap`): ôn bằng FlashCard hoặc trắc nghiệm nhanh 4 đáp án; khi không còn thẻ đến hạn hiện "Bạn đã ôn xong" + gợi ý học bài mới
- [ ] T048 [US2] Tạo thẻ "Cần ôn hôm nay: N thẻ" web/src/features/review/DueCount.tsx để dùng ở trang `/hoc` và nút "Học tiếp" (FR-009)
- [ ] T049 [US2] Thêm nút "Giả lập ngày mai" chỉ hiện ở chế độ dev trong web/src/app/DevTools.tsx để kiểm thử lịch ôn
- [ ] T050 [US2] Viết e2e web/tests/e2e/us2-review.spec.ts theo kịch bản 2 trong quickstart.md

**Checkpoint**: US1 + US2 chạy độc lập

---

## Phase 5: User Story 3 - Trang từ vựng và câu áp dụng (Priority: P3)

**Goal**: Trang danh sách từ có lọc/tìm kiếm, trang chi tiết có nét viết, mẹo nhớ, nhiều câu ví dụ, thêm vào ôn tập.

**Independent Test**: `/tu-vung`, gõ "ni hao" → mở 你好 → nghe câu ví dụ → "Thêm vào ôn tập".

- [ ] T051 [P] [US3] Viết test web/tests/unit/search.test.ts: `nihao`, `nǐ hǎo`, `ni hao`, `你好`, `xin chao`, `xin chào` đều trả về 你好; không có kết quả thì trả về gợi ý cách gõ khác; tìm trong < 1 giây với 600 từ
- [ ] T052 [US3] Viết web/src/features/vocabulary/search.ts dùng web/public/data/generated/search-index.json (FR-012)
- [ ] T053 [US3] Tạo trang web/src/pages/VocabularyPage.tsx (`/tu-vung`): ô tìm kiếm hiện kết quả ngay khi gõ, lọc theo cấp HSK, chủ đề, trạng thái "chưa học / đang học / đã thuộc" (FR-011), danh sách ảo hoá nếu cần để cuộn mượt
- [ ] T054 [P] [US3] Tạo web/src/components/ui/HanziStroke.tsx bọc Hanzi Writer: hoạt ảnh thứ tự nét, nút xem lại, tải dữ liệu từ web/public/strokes/, hiện đủ nét ngay khi reduced motion (FR-013)
- [ ] T055 [US3] Tạo trang web/src/pages/WordDetailPage.tsx (`/tu-vung/:wordId`): chữ, pinyin, phát âm, nghĩa, loại từ, HanziStroke, MnemonicView, mọi câu ví dụ (chữ Hán, pinyin, nghĩa, nút nghe cả câu), nút "Thêm vào ôn tập" tạo CardProgress `addedManually: true` (FR-014)
- [ ] T056 [US3] Viết e2e web/tests/e2e/us3-vocabulary.spec.ts theo kịch bản 3 trong quickstart.md

**Checkpoint**: US1–US3 chạy độc lập

---

## Phase 6: User Story 4 - Lộ trình học bài bản (Priority: P4)

**Goal**: Lộ trình trực quan Pinyin → HSK 1–3 (HSK 4–6 "sắp có"), mở khoá tuần tự, kiểm tra trình độ.

**Independent Test**: `/lo-trinh` → Pinyin là chặng đầu; xong một bài → bài sau mở khoá có hiệu ứng.

### Nội dung cho US4

- [ ] T057 [P] [US4] Soạn nội dung chặng Pinyin (thanh mẫu, vận mẫu, 4 thanh điệu + bài luyện phân biệt) vào web/public/data/pinyin.json; thu hoặc lấy file âm thanh có giấy phép mở cho ~60 âm vào web/public/audio/pinyin/ và ghi nguồn vào web/public/data/credits.json (research R7)
- [ ] T058 [P] [US4] Soạn và duyệt nội dung HSK 2 (khoảng 150 từ) vào web/public/data/words/hsk2.json và web/public/data/lessons/hsk2.json, ảnh Canva cho từ `concrete`, chạy fetch-strokes/build-search-index/build-confusables, ghi duyệt vào content-tools/review/hsk2.md
- [ ] T059 [P] [US4] Soạn và duyệt nội dung HSK 3 (khoảng 300 từ) vào web/public/data/words/hsk3.json và web/public/data/lessons/hsk3.json, ảnh Canva cho từ `concrete`, chạy các script, ghi duyệt vào content-tools/review/hsk3.md
- [ ] T060 [P] [US4] Soạn bài kiểm tra trình độ web/public/data/placement-test.json: mỗi câu gắn cấp, đủ câu cho Pinyin, HSK 1, 2, 3

### Logic và giao diện cho US4

- [ ] T061 [P] [US4] Viết test web/tests/unit/unlock.test.ts: trong một cấp, bài mở khoá tuần tự; bài đầu của mọi cấp `available` vào được khi chọn level hoặc qua kiểm tra trình độ (FR-016); `coming_soon` không vào được
- [ ] T062 [US4] Viết web/src/features/roadmap/unlock.ts theo T061 và web/src/features/roadmap/placement.ts (chấm bài test → cấp đề xuất)
- [ ] T063 [US4] Tạo trang web/src/pages/RoadmapPage.tsx (`/lo-trinh`): các chặng theo thứ tự, chặng hiện tại được đánh dấu, HSK 4–6 nhãn "sắp có", hiệu ứng ổ khoá mờ dần + dấu son khi mở bài (500ms)
- [ ] T064 [US4] Nâng cấp web/src/pages/StagePage.tsx: trạng thái khoá/xong của từng bài, tiến độ của cấp
- [ ] T065 [US4] Tạo trang web/src/pages/PinyinPage.tsx (`/pinyin`): học thanh mẫu, vận mẫu, 4 thanh điệu (nghe file thật, vẽ đường thanh), bài luyện phân biệt thanh (FR-018)
- [ ] T066 [US4] Tạo trang web/src/pages/PlacementTestPage.tsx (`/kiem-tra-trinh-do`): làm bài, xem kết quả, đi tới `/lo-trinh/<cấp>` phù hợp và lưu `selectedLevel`
- [ ] T067 [US4] Viết e2e web/tests/e2e/us4-roadmap.spec.ts theo kịch bản 4 trong quickstart.md

**Checkpoint**: US1–US4 chạy độc lập

---

## Phase 7: User Story 5 - Mục tiêu hằng ngày và chuỗi ngày học (Priority: P5)

**Goal**: Mục tiêu tự vừa sức (bắt đầu 10 từ + thẻ ôn), vòng tiến độ, streak, lịch ngày đã học, gợi ý tăng/giảm.

**Independent Test**: Mục tiêu mặc định, học đủ 10 từ + ôn hết → vòng đầy, hiệu ứng, streak +1.

- [ ] T068 [P] [US5] Viết test web/tests/unit/goals.test.ts: đạt mục tiêu khi `newLearned ≥ min(newWordsTarget, newAvailable)` VÀ `reviewsDone ≥ min(reviewsDue, dailyReviewCap)`; khi `newAvailable = 0` chỉ cần ôn hết thẻ đến hạn, và nếu cũng không có thẻ đến hạn thì hoàn thành một lượt Luyện tập là đạt (FR-019c); gợi ý tăng khi "≥ 6/7 ngày gần nhất đạt và tỉ lệ good trong ôn tập ≥ 80%"; gợi ý giảm khi "≤ 3/7 ngày đạt"; bước "+3 hoặc −2, kẹp trong 3–20"; không gợi ý lại trong 7 ngày; chỉ đổi khi người dùng đồng ý
- [ ] T069 [P] [US5] Viết test web/tests/unit/streak.test.ts: ngày có học = đạt mục tiêu; mở app khi `lastActiveDate` < hôm qua thì `current = 0`; giữ `best`; tính ngày theo giờ địa phương
- [ ] T070 [US5] Viết web/src/features/goals/dailyGoal.ts và web/src/features/goals/streak.ts theo T068, T069 (FR-019, FR-019a, FR-019b, FR-020)
- [ ] T071 [US5] Nối việc học thẻ mới, ôn tập và kết quả trò chơi vào tiến độ mục tiêu hôm nay trong web/src/store/index.ts
- [ ] T072 [US5] Tạo Trang Hôm nay web/src/pages/TodayPage.tsx (`/hoc`): ProgressRing mục tiêu, ngọn lửa chuỗi ngày học, DueCount, bài tiếp theo, hộp gợi ý tăng/giảm có nút "Đồng ý" / "Giữ nguyên" và lời động viên không trách móc; hiệu ứng chúc mừng + con dấu khi đạt mục tiêu
- [ ] T073 [P] [US5] Tạo web/src/features/goals/StudyCalendar.tsx: lịch các ngày đã học (30 ngày)
- [ ] T074 [US5] Tạo phần cài đặt học trong trang web/src/pages/ProfilePage.tsx (`/toi`): chỉnh mục tiêu từ mới "trong khoảng 3–20" và chỉnh giới hạn thẻ ôn mỗi ngày `dailyReviewCap` "mặc định 50, chỉnh trong khoảng 10–100" (FR-010, FR-019b)
- [ ] T075 [US5] Viết e2e web/tests/e2e/us5-goals.spec.ts theo kịch bản 5 trong quickstart.md (dùng dữ liệu mẫu "7 ngày đạt 6")

**Checkpoint**: US1–US5 chạy độc lập

---

## Phase 8: User Story 6 - Lịch nhắc nhở học (Priority: P6)

**Goal**: Đặt giờ + ngày nhắc, nhận thông báo đẩy kể cả khi đã đóng app, không nhắc khi đã đạt mục tiêu; dự phòng file `.ics`.

**Independent Test**: Trên điện thoại đã cài app, đặt nhắc 1 phút sau, cho phép thông báo → nhận thông báo trong ≤ 15 phút.

### PWA

- [ ] T076 [US6] Cấu hình vite-plugin-pwa trong web/vite.config.ts ở chế độ `injectManifest` với file service worker riêng web/src/sw/sw.ts (để T083 thêm được xử lý `push` và `notificationclick`): manifest tiếng Việt (tên, màu `--paper`/`--cinnabar`, icon 192/512), lưu sẵn giao diện + web/public/data/ + web/public/strokes/, ảnh lưu khi đã xem, và lưu font Google (fonts.googleapis.com, fonts.gstatic.com) theo chiến lược CacheFirst để chữ Hán và tiếng Việt vẫn đúng mặt chữ khi mất mạng (FR-028)
- [ ] T077 [P] [US6] Tạo trang web/src/pages/InstallGuidePage.tsx (`/cai-dat-app`): hướng dẫn từng bước có hình "Thêm vào màn hình chính" cho iPhone (Safari) và Android (Chrome)

### Hàm nhắc (reminder-worker)

- [ ] T078 [US6] Khởi tạo Cloudflare Worker trong reminder-worker/ (wrangler.toml có KV namespace và Cron `*/15 * * * *`), khoá VAPID lưu bằng secret, không đưa vào code
- [ ] T079 [US6] Viết reminder-worker/src/index.ts theo contracts/reminder-api.md: `PUT /reminders/:deviceId`, `POST /reminders/:deviceId/done`, `DELETE /reminders/:deviceId`; lỗi `400` (thông điệp tiếng Việt), `404`, `429`; CORS chỉ cho tên miền website; giới hạn tần suất theo `deviceId`
- [ ] T080 [US6] Viết Cron trong reminder-worker/src/cron.ts: đến giờ theo múi giờ thiết bị, đúng ngày trong tuần, `done.date` ≠ hôm nay → gửi Web Push với `title: "Đến giờ học tiếng Trung rồi!"`, còn `body` và `url` chọn theo đúng bảng 4 trường hợp trong contracts/reminder-api.md dựa trên `forecast.dueByDate[hôm nay]` (N > 0; N = 0 còn từ mới; N = 0 hết từ mới; không có số cho hôm nay); nhận `410 Gone` → xoá thiết bị
- [ ] T081 [P] [US6] Viết test reminder-worker/tests/reminder.test.ts: chọn đúng thiết bị đến giờ theo múi giờ, bỏ qua khi đã đạt mục tiêu, chọn đúng `body`/`url` cho cả 4 trường hợp của `forecast`, xoá khi `410`

### Phía app

- [ ] T082 [US6] Viết web/src/features/reminders/push.ts: tạo `deviceId` ngẫu nhiên, xin quyền thông báo, đăng ký đẩy, gọi PUT/DELETE, gửi `done` khi đạt mục tiêu (nối vào T070); viết hàm `buildForecast()` tính số thẻ đến hạn cho từng ngày trong 14 ngày tới (kẹp theo `dailyReviewCap`) và `hasNewWords`, gửi kèm trong PUT và `done`, và gửi lại PUT mỗi ngày một lần khi mở app nếu đang bật nhắc; thêm test web/tests/unit/forecast.test.ts
- [ ] T083 [US6] Viết web/src/sw/notification.ts và nạp vào web/src/sw/sw.ts: nhận sự kiện `push` để hiện thông báo, và `notificationclick` để mở đúng `url` đi kèm thông báo
- [ ] T084 [P] [US6] Viết web/src/features/reminders/ics.ts: tạo file `.ics` lặp theo giờ + ngày trong tuần để "Thêm vào lịch điện thoại"
- [ ] T085 [US6] Tạo phần nhắc nhở trong web/src/pages/ProfilePage.tsx: chọn giờ, các ngày (≥ 1 ngày), bật/tắt (FR-021); khi bị từ chối quyền hiện hướng dẫn tiếng Việt cách bật lại; khi iPhone chưa cài app thì dẫn tới `/cai-dat-app`; nút tải `.ics`
- [ ] T086 [US6] Viết trang web/src/pages/AboutPage.tsx (`/gioi-thieu`): nguồn dữ liệu và giấy phép (từ credits.json), quyền riêng tư bằng tiếng Việt: chỉ lưu mã thiết bị ngẫu nhiên, lịch nhắc, múi giờ; xoá khi tắt nhắc (Nghị định 13/2023/NĐ-CP)
- [ ] T087 [US6] Kiểm thử tay theo kịch bản 6 trong quickstart.md trên Android và iPhone thật, ghi kết quả vào content-tools/review/us6-reminder.md

**Checkpoint**: US1–US6 chạy độc lập

---

## Phase 9: User Story 7 - Trang chủ giới thiệu và chọn level (Priority: P7)

**Goal**: Trang chủ phong cách Trung Hoa hiện đại nhiều hiệu ứng, cuối trang chọn level đưa tới đúng Trang level.

**Independent Test**: Mở `/`, cuộn hết, nghe 4 thanh của "ma", chọn HSK 2 → tới `/lo-trinh/hsk2`.

- [ ] T088 [US7] Cài GSAP + ScrollTrigger (chỉ tải ở trang chủ) và viết web/src/features/home/useScrollInk.ts: mực loang khi cuộn tới từng section (mask SVG radial + scale, 600–900ms), tối đa 1–2 hiệu ứng chính mỗi màn, tắt khi reduced motion
- [ ] T089 [P] [US7] Tạo web/src/features/home/Hero.tsx: chữ 中文 tự viết từng nét bằng Hanzi Writer (dùng HanziStroke của T054), nét màu `--ink` có SVG filter mép mực thấm giấy theo design-system.md, 1.2–2.5s, bỏ qua được và không chặn bấm (không animate font Ma Shan Zheng); câu mở đầu; nút "Chọn level của bạn" cuộn xuống; nút "Học tiếp" nổi bật kèm số thẻ cần ôn hôm nay khi đã có tiến độ (FR-023c, FR-009)
- [ ] T090 [P] [US7] Tạo web/src/features/home/RadicalStory.tsx: 3 ví dụ bộ thủ ghép thành chữ (ví dụ 日+月=明) dùng RadicalSplit
- [ ] T091 [P] [US7] Tạo web/src/features/home/ToneDemo.tsx: 4 thẻ mā/má/mǎ/mà, bấm nghe file thật, vẽ đường thanh điệu
- [ ] T092 [P] [US7] Tạo web/src/features/home/WhyHsk.tsx (3 lợi ích, minh hoạ mực) và web/src/features/home/RoadmapStrip.tsx (dải Pinyin → HSK 6)
- [ ] T093 [US7] Tạo web/src/features/home/LevelPicker.tsx: câu hỏi "Bạn đang ở level nào?", 5 nấc (Mới bắt đầu, HSK 1, HSK 2, HSK 3, HSK 4–6 "sắp có") + nút "Kiểm tra trình độ", mỗi nấc có mô tả từ `descriptionVi`; chọn → con dấu đỏ đóng xuống → lưu `selectedLevel` → chuyển trang (Mới bắt đầu → `/pinyin`, HSK n → `/lo-trinh/hsk<n>`, sắp có → thông báo + gợi ý HSK 3) (FR-023a, FR-023b)
- [ ] T094 [US7] Ghép trang web/src/pages/HomePage.tsx (`/`) theo thứ tự 6 phần trong design-system.md và bỏ chuyển hướng tạm `/` → `/lo-trinh/hsk1` của T043 trong web/src/app/router.tsx; không có thanh điều hướng dưới đáy; không có phần đánh giá người dùng
- [ ] T095 [US7] Đo trang chủ bằng Lighthouse mobile: phần đầu trang hiện ≤ 2 giây, cuộn mượt (SC-011); ghi số đo vào content-tools/review/home-performance.md
- [ ] T096 [US7] Viết e2e web/tests/e2e/us7-home.spec.ts theo kịch bản 7 trong quickstart.md, gồm kiểm tra mọi nấc level dẫn đúng trang, và đếm số lần bấm từ `/` (bấm "Chọn level của bạn" → HSK 1 → Bài 1) tới thẻ đầu tiên khẳng định ≤ 3 (constitution II, SC-001)

**Checkpoint**: US1–US7 chạy độc lập

---

## Phase 10: User Story 8 - Chức năng thú vị giúp nhớ lâu (Priority: P8)

**Goal**: Mục "Luyện tập" có 5 trò riêng + Thử thách tuần, khó đoán, có điểm, sự kiện bất ngờ, huy hiệu.

**Independent Test**: Học xong 1 bài, chơi 1 trò bằng từ của bài đó, thấy điểm và nhận huy hiệu đầu tiên.

### Engine chung

- [ ] T097 [P] [US8] Viết test web/tests/unit/game-engine.test.ts: đáp án nhiễu ưu tiên từ `getConfusables(wordId)` (cùng âm khác thanh, gần hình, cùng chủ đề), chỉ dùng ngẫu nhiên khi thiếu; 妈 có 马 hoặc 吗 trong đáp án nhiễu; trộn kiểu hỏi "chữ → nghĩa, nghĩa → chữ, nghe → chữ"; không trùng bộ câu hỏi lượt liền trước; độ khó "tăng sau mỗi 5 câu đúng liên tiếp và giảm một bậc sau 2 câu sai liên tiếp"; mỗi lượt có "1–2 sự kiện bất ngờ" chọn từ nhân đôi điểm, câu thưởng, đảo chiều hỏi, từ bí ẩn
- [ ] T098 [US8] Viết web/src/features/games/engine/ (distractors.ts, questionMix.ts, difficulty.ts, surpriseEvents.ts, scope.ts) theo T097 (FR-024a, FR-024c–f)
- [ ] T099 [US8] Nối kết quả trò chơi vào lịch ôn: trả lời sai = `again` (FR-024b), ghi `wrongInGames7d` trong web/src/features/games/engine/recordResult.ts
- [ ] T100 [P] [US8] Tạo web/src/features/games/GameShell.tsx: chọn phạm vi (một bài / một cấp / từ cần ôn), điểm, combo, hiệu ứng đúng (viền ngọc) / sai (lắc ngang 6px), dải băng sự kiện bất ngờ (giấy đỏ trượt vào phía trên câu hỏi, ≤ 400ms, hiện CÙNG LÚC với câu hỏi, người chơi trả lời được ngay — constitution IV), màn kết quả có danh sách từ sai và nút ôn lại

### 5 trò + Thử thách tuần

- [ ] T101 [P] [US8] Trò Ghép cặp web/src/features/games/match/MatchGame.tsx: nối chữ Hán với nghĩa hoặc pinyin
- [ ] T102 [P] [US8] Trò Nghe chọn từ web/src/features/games/listen/ListenGame.tsx: nghe rồi chọn đúng chữ trong 4 đáp án
- [ ] T103 [P] [US8] Trò Luyện viết web/src/features/games/write/WriteGame.tsx: Hanzi Writer chế độ quiz, nét sai không được nhận, nét đúng nhấp nháy gợi ý
- [ ] T104 [P] [US8] Trò Sắp xếp câu web/src/features/games/order/OrderGame.tsx: kéo thả `tokens` của câu ví dụ, có nút chạm để chọn thay cho kéo (không bắt buộc kéo), xếp đúng thì nghe cả câu và thấy nghĩa
- [ ] T105 [P] [US8] Trò Đua thời gian web/src/features/games/race/RaceGame.tsx: 60 giây, lưu `bestScore`, hiệu ứng khi phá kỷ lục
- [ ] T106 [US8] Thử thách tuần web/src/features/games/weekly/weekly.ts + WeeklyGame.tsx: tạo mỗi thứ Hai từ các từ sai nhiều nhất 7 ngày qua, bù bằng từ mới học gần đây (FR-024g); xong nhận huy hiệu tuần

### Huy hiệu và trang

- [ ] T107 [P] [US8] Soạn web/public/data/badges.json (học 50 từ, streak 7 ngày, hoàn thành từng cấp, thử thách tuần…) và viết web/src/features/goals/badges.ts xét điều kiện + hiệu ứng nhận huy hiệu (FR-025)
- [ ] T108 [US8] Tạo trang web/src/pages/PracticePage.tsx (`/luyen-tap`): 5 trò mỗi trò một mục riêng + Thử thách tuần; trang web/src/pages/GamePage.tsx (`/luyen-tap/:game`); thông báo khi chưa học bài nào
- [ ] T109 [US8] Thêm danh sách huy hiệu vào web/src/pages/ProfilePage.tsx
- [ ] T110 [US8] Viết e2e web/tests/e2e/us8-games.spec.ts theo kịch bản 8 trong quickstart.md

**Checkpoint**: Cả 8 story chạy độc lập

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Hoàn thiện chung

- [ ] T111 Xuất/nhập tiến độ trong web/src/pages/ProfilePage.tsx theo contracts/storage-schema.md: tên file `tien-do-hoc-tieng-trung-YYYY-MM-DD.json`, bỏ `reminder.deviceId`, kiểm tra `app` + `schemaVersion`, hỏi "Thay thế" hay "Huỷ" (FR-027); cảnh báo xoá dữ liệu trình duyệt sẽ mất tiến độ
- [ ] T112 Đặt lại toàn bộ tiến độ với xác nhận hai bước trong web/src/pages/ProfilePage.tsx (FR-029)
- [ ] T113 [P] Rà soát tiếp cận toàn site: tương phản ≥ 4.5:1 (vàng kim không làm màu chữ), focus thấy rõ, đủ thao tác bằng bàn phím, nhãn cho nút chỉ có icon; rà toàn bộ chữ trên giao diện, thông báo lỗi và thông báo đẩy là tiếng Việt, không lọt từ tiếng Anh như "streak" (dùng "chuỗi ngày học"), "level" được giữ vì người dùng quen gọi (FR-026); ghi kết quả vào content-tools/review/accessibility.md
- [ ] T114 [P] Rà soát "không mùi AI" theo design-system.md: không emoji làm icon, không gradient tím–xanh, không thẻ trắng lặp lại; đối chiếu checklist cuối design-system.md
- [ ] T115 Tối ưu hiệu năng: tách code theo trang, GSAP/Hanzi Writer chỉ tải ở trang cần, ảnh WebP lazy load giữ chỗ; Lighthouse mobile Performance ≥ 85, Accessibility ≥ 90 trên mọi trang chính
- [ ] T116 [P] Kiểm tra mất mạng: mở site một lần, tắt mạng, học tiếp bài đang học (FR-028)
- [ ] T117 Cấu hình triển khai Cloudflare Pages cho web/ và Workers cho reminder-worker/; ghi hướng dẫn vào README.md ở gốc dự án
- [ ] T118 Chạy toàn bộ quickstart.md (8 kịch bản + kiểm tra chung) và ghi kết quả vào content-tools/review/quickstart-run.md; đo thời gian từ lúc bấm nút loa tới khi bắt đầu phát âm trên Android (Chrome), iPhone (Safari) và Windows (Edge), mỗi máy 10 từ, khẳng định ≤ 1 giây (SC-004), và ghi máy nào thiếu giọng đọc tiếng Trung

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: không phụ thuộc
- **Foundational (Phase 2)**: sau Setup — chặn mọi story
- **US1–US8 (Phase 3–10)**: sau Foundational; nên làm theo thứ tự ưu tiên P1 → P8 vì làm một mình
- **Polish (Phase 11)**: sau các story muốn phát hành

### User Story Dependencies

- **US1 (P1)**: chỉ cần Foundational. Cần nội dung HSK 1 (T030–T033)
- **US2 (P2)**: dùng CardProgress do US1 ghi; kiểm thử độc lập được bằng dữ liệu mẫu
- **US3 (P3)**: chỉ cần Foundational + nội dung HSK 1; dùng MnemonicView/SpeakButton của US1
- **US4 (P4)**: nâng cấp StagePage của US1; nội dung HSK 2, 3, Pinyin làm trong phase này
- **US5 (P5)**: đọc dữ liệu học/ôn của US1, US2
- **US6 (P6)**: gửi `done` khi đạt mục tiêu → cần US5 cho phần "không nhắc khi đã xong"; phần còn lại độc lập
- **US7 (P7)**: LevelPicker dẫn tới trang của US4 (`/pinyin`, `/lo-trinh/:stageId`); dùng RadicalSplit của US1, HanziStroke của US3 (Hero) và DueCount của US2 (nút "Học tiếp")
- **US8 (P8)**: cần từ đã học (US1) và lịch ôn (US2); huy hiệu streak cần US5

### Within Each User Story

- Test logic (Vitest) viết trước file logic tương ứng
- Nội dung → logic → giao diện → e2e
- Story xong mới sang story kế

### Parallel Opportunities

- Setup: T003, T004, T005, T006
- Foundational: T009–T012, T020–T021, T023–T026 chạy song song sau khi có T007, T015–T018
- US1: T032 (ảnh Canva) và phần chạy script của T033 song song với T034–T039; riêng bước kiểm tra đầy đủ cuối T033 phải chờ T032 xong
- US4: soạn nội dung T057–T060 song song nhau và với T061
- US8: 5 trò T101–T105 song song sau khi có engine T098 và GameShell T100
- Soạn nội dung HSK 2, HSK 3 (T058, T059) có thể bắt đầu sớm ngay sau T027–T028, song song với US1–US3

---

## Parallel Example: User Story 1

```bash
# Song song sau khi có nội dung HSK 1 (T030):
Task: "Tạo ảnh Canva cho từ concrete HSK 1 vào web/public/images/words/"        # T032
Task: "Chạy fetch-strokes, build-search-index, build-confusables cho HSK 1"       # T033 (bước kiểm tra đầy đủ chờ T032)
Task: "Viết test web/tests/unit/lesson-session.test.ts"                            # T034

# Song song các component giao diện:
Task: "Tạo web/src/features/flashcard/FlashCard.tsx"       # T036
Task: "Tạo web/src/components/ui/MnemonicView.tsx"         # T037
Task: "Tạo web/src/components/ui/RadicalSplit.tsx"         # T038
Task: "Tạo web/src/components/ui/SpeakButton.tsx"          # T039
```

## Parallel Example: User Story 8

```bash
# Sau khi có engine (T098) và GameShell (T100):
Task: "Trò Ghép cặp web/src/features/games/match/MatchGame.tsx"       # T101
Task: "Trò Nghe chọn từ web/src/features/games/listen/ListenGame.tsx" # T102
Task: "Trò Luyện viết web/src/features/games/write/WriteGame.tsx"     # T103
Task: "Trò Sắp xếp câu web/src/features/games/order/OrderGame.tsx"    # T104
Task: "Trò Đua thời gian web/src/features/games/race/RaceGame.tsx"    # T105
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup → Phase 2 Foundational
2. Phase 3 US1 (nội dung HSK 1 + flashcard)
3. **DỪNG và KIỂM TRA**: chạy kịch bản 1 của quickstart.md ở 360/768/1280 + reduced motion
4. Đưa lên Cloudflare Pages để thử trên điện thoại

### Incremental Delivery

1. Setup + Foundational → nền tảng
2. US1 → MVP flashcard
3. US2 ôn tập → US3 từ vựng → US4 lộ trình + HSK 2–3 → US5 mục tiêu
4. US6 nhắc nhở (cần tài khoản Cloudflare) → US7 trang chủ → US8 trò chơi
5. Polish → phát hành bản đầu

Lưu ý thứ tự: trang chủ (US7) là ưu tiên P7 theo spec nhưng là thứ người dùng thấy đầu tiên. Nếu muốn
có trang chủ đẹp sớm để giới thiệu, có thể làm US7 ngay sau US4 (US7 cần trang `/lo-trinh/:stageId` của US4).

### Nội dung là phần việc lớn nhất

~600 từ × (nghĩa + 2 câu + mẹo nhớ) + ~300–350 ảnh Canva + duyệt tay. Nên chạy song song với code:
bắt đầu soạn HSK 2–3 ngay khi xong T027–T028.

---

## Notes

- [P] = khác file, không phụ thuộc task chưa xong
- [USn] = task thuộc user story n
- Mỗi story kiểm tra độc lập được tại checkpoint của nó
- Commit sau mỗi task hoặc nhóm task
- Tránh: task mơ hồ, hai task cùng sửa một file chạy song song, phụ thuộc chéo phá vỡ tính độc lập
