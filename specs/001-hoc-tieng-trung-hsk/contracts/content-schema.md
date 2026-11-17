# Contract: File nội dung

Các file nằm trong `public/data/`, được service worker lưu sẵn để dùng offline.
Một script kiểm tra (`npm run validate:content`) MUST chạy trước mỗi lần build và chặn build khi có lỗi.
Khi đang soạn nội dung, chạy `npm run validate:content -- --draft`: bỏ qua quy tắc 5 và 7 (cần file ảnh
và file nét đã sinh), các quy tắc còn lại vẫn áp dụng.

## Danh sách file

| File | Nội dung |
|---|---|
| `stages.json` | RoadmapStage[] |
| `lessons/hsk1.json`, `hsk2.json`, `hsk3.json` | Lesson[] của từng cấp |
| `words/hsk1.json`, `hsk2.json`, `hsk3.json` | Word[] của từng cấp (kèm examples, mnemonic) |
| `pinyin.json` | thanh mẫu, vận mẫu, bài thanh điệu, đường dẫn file âm thanh |
| `badges.json` | BadgeDefinition[] |
| `placement-test.json` | câu hỏi kiểm tra trình độ, mỗi câu gắn cấp |
| `generated/search-index.json` | SINH TỰ ĐỘNG (build-search-index): khoá tìm kiếm cho mỗi từ |
| `generated/confusables.json` | SINH TỰ ĐỘNG (build-confusables): `{ "<wordId>": ["<wordId>", …] }` |
| `generated/components.json` | SINH TỰ ĐỘNG (fetch-strokes): `{ "<chữ>": { "decomposition": "…", "groups": [[0,1,2],[3,4]] } }` |
| `strokes/<chữ>.json` | dữ liệu nét Hanzi Writer cho từng chữ (research R3) |
| `images/words/<wordId>.webp` | ảnh minh hoạ từ cụ thể |
| `audio/pinyin/<âm>.mp3` | âm thanh chặng pinyin |

## Ví dụ một Word

```json
{
  "id": "hsk1-012",
  "hanzi": "妈妈",
  "pinyin": "māma",
  "tones": [1, 0],
  "meaningVi": ["mẹ"],
  "partOfSpeech": "danh",
  "hskLevel": 1,
  "topic": "gia-dinh",
  "kind": "concrete",
  "image": "images/words/hsk1-012.webp",
  "examples": [
    { "hanzi": "我妈妈很好。", "pinyin": "Wǒ māma hěn hǎo.", "meaningVi": "Mẹ tôi rất khoẻ.",
      "tokens": ["我", "妈妈", "很", "好", "。"] },
    { "hanzi": "妈妈，你好！", "pinyin": "Māma, nǐ hǎo!", "meaningVi": "Con chào mẹ!",
      "tokens": ["妈妈", "，", "你好", "！"] }
  ],
  "mnemonic": {
    "components": [ { "part": "女", "meaningVi": "người phụ nữ" }, { "part": "马", "meaningVi": "ngựa (gợi âm mǎ)" } ],
    "story": "Người phụ nữ (女) tất tả như ngựa (马) chạy lo cho cả nhà — đó là mẹ (mā)."
  }
}
```

## Quy tắc kiểm tra (validate:content)

1. Đủ trường bắt buộc theo [data-model.md](../data-model.md); `id` không trùng.
2. `pinyin` có dấu thanh; số âm tiết = số chữ Hán; `tones` khớp dấu trong `pinyin`.
3. `examples.length ≥ 2`; mỗi câu có `hanzi`, `pinyin`, `meaningVi`, `tokens`; ghép `tokens` = `hanzi`.
4. Câu ví dụ chỉ dùng từ có cấp ≤ cấp của từ chính (cảnh báo nếu vi phạm, không chặn).
5. `kind = concrete` → file `image` tồn tại; `kind = abstract` → mọi chữ có file `strokes/`.
6. `mnemonic.components` không rỗng; `story` ≤ 200 ký tự.
7. Mỗi chữ Hán xuất hiện trong từ và câu ví dụ có dữ liệu nét.
8. Mỗi Lesson có 8–12 từ; mọi `wordIds` tồn tại; mỗi từ thuộc đúng một bài.
9. Báo cáo cuối: số từ mỗi cấp, % có ảnh, % có mẹo nhớ (SC-008, SC-010).
