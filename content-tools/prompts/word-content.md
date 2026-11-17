# Mẫu soạn nội dung từ vựng

Dùng file này mỗi khi soạn từ cho một cấp HSK (bằng tay hoặc nhờ AI). Kết quả ghi vào
`web/public/data/words/hsk<N>.json` (mảng các từ) và `web/public/data/lessons/hsk<N>.json` (mảng các bài).
Định dạng chuẩn: `specs/001-hoc-tieng-trung-hsk/contracts/content-schema.md`.

Nội dung do AI soạn **chưa được coi là đúng** cho tới khi có người biết tiếng Trung duyệt và ghi vào
`content-tools/review/hsk<N>.md`.

## Câu lệnh giao cho AI

> Bạn là giáo viên tiếng Trung dạy người Việt mới bắt đầu. Soạn nội dung cho các từ HSK <N> (chuẩn HSK 2.0)
> trong danh sách dưới đây, chữ giản thể. Trả về một mảng JSON, mỗi từ đúng định dạng ở mục "Định dạng một từ".
> Tuân thủ mọi quy tắc ở mục "Quy tắc". Không thêm chữ nào ngoài JSON.
>
> Danh sách từ: …

## Định dạng một từ

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
    "components": [
      { "part": "女", "meaningVi": "người phụ nữ" },
      { "part": "马", "meaningVi": "ngựa (gợi âm mǎ)" }
    ],
    "story": "Người phụ nữ (女) tất tả như ngựa (马) chạy lo cho cả nhà — đó là mẹ (mā)."
  }
}
```

## Quy tắc

### Chữ, pinyin, thanh điệu

- `id`: `hsk<N>-` + 3 chữ số, đánh số liên tục theo thứ tự bài.
- `hanzi`: chữ **giản thể**, 1–4 chữ.
- `pinyin`: có dấu thanh (`ǎ`), không dùng số (`a3`). Các âm tiết của một từ viết liền (`péngyou`),
  các từ trong câu cách nhau một khoảng trắng. Âm tiết bắt đầu bằng a, o, e đứng sau âm tiết khác thì thêm
  dấu `'` (`nǚ'ér`).
- `tones`: một số cho mỗi chữ — 1, 2, 3, 4, và 0 cho thanh nhẹ. Phải khớp dấu trong `pinyin`.
  Chữ 儿 cuốn lưỡi (`nǎr` = 哪儿) tính là một chữ thanh 0.
- Biến điệu của 不 và 一: mục từ đơn ghi thanh gốc (`bù`, `yī`); trong từ ghép và trong câu ví dụ ghi
  **theo cách đọc thật** (`bú shì`, `bú kèqi`, `yí gè`, `yìdiǎnr`). Thanh 3 liền nhau (`nǐ hǎo`) giữ nguyên dấu.
- Kiểm tra từng dấu thanh hai lần. Sai một dấu là sai nghĩa.

### Nghĩa và loại từ

- `meaningVi`: 1–3 nghĩa tiếng Việt ngắn, thông dụng nhất đứng trước. Không giải thích dài.
- `partOfSpeech`: một trong `danh, động, tính, phó, lượng, đại, giới, liên, trợ, thán, số`
  (chọn loại dùng nhiều nhất ở cấp này).
- `topic`: id chủ đề viết thường không dấu, nối bằng gạch ngang (`chao-hoi`, `so-dem`, `gia-dinh`, `an-uong`…).

### Câu ví dụ (ít nhất 2 câu)

- Câu ngắn (3–8 từ), tự nhiên, dùng trong đời thường, có chứa từ đang học.
- **Chỉ dùng từ cùng cấp HSK trở xuống.** Tên riêng và từ ngoài danh sách càng ít càng tốt.
- `tokens`: câu đã tách từ; dấu câu là một token riêng; ghép tất cả token lại phải đúng bằng `hanzi`.
- `pinyin` của câu: viết hoa chữ đầu câu và tên riêng, số âm tiết bằng số chữ Hán.
- `meaningVi`: dịch tự nhiên sang tiếng Việt, không dịch từng chữ.

### Mẹo nhớ

- `components`: tách **từng chữ** của từ thành các thành phần/bộ thủ có thật trong chữ, mỗi phần kèm
  nghĩa tiếng Việt. Nếu một phần chỉ gợi âm đọc thì ghi rõ "gợi âm …". Chữ không tách được (一, 人) thì ghi
  chính chữ đó và mô tả hình dạng.
- `story`: câu chuyện liên tưởng bằng tiếng Việt, **tối đa 2 câu và 200 ký tự**, nối các thành phần với
  nghĩa của từ. Ưu tiên hình ảnh cụ thể, dễ hình dung.
- Mẹo nhớ là để dễ nhớ, không phải nguồn gốc chữ. Nếu câu chuyện khác với nguồn gốc thật thì không viết
  kiểu "chữ này vốn là…".

### Phân loại `kind`

- `concrete`: đồ vật, con vật, thức ăn, nơi chốn, người, hành động nhìn thấy được (猫, 茶, 喝, 医院).
  Bắt buộc có `image: "images/words/<id>.webp"` và file ảnh thật (xem `image-style.md`).
- `abstract`: mọi từ còn lại (hư từ, số, thời gian, cảm xúc, đại từ…). Không có `image`; website tự vẽ hình
  tách bộ thủ từ dữ liệu nét.
- Từ `concrete` chưa có ảnh đạt thì tạm để `abstract` và ghi vào danh sách chờ ảnh trong
  `content-tools/review/`.

### Chia bài (`lessons/hsk<N>.json`)

```json
{ "id": "hsk1-l01", "stageId": "hsk1", "order": 1, "titleVi": "Chào hỏi", "topic": "chao-hoi",
  "wordIds": ["hsk1-001", "hsk1-002"] }
```

- Mỗi bài 8–12 từ (khoảng 10), cùng chủ đề, đi từ dễ đến khó.
- Mỗi từ thuộc đúng một bài. Sau khi thêm bài, ghi id bài vào `lessonIds` của cấp đó trong
  `web/public/data/stages.json`.

## Kiểm tra sau khi soạn

Trong thư mục `web/`:

```
npm run validate:content -- --draft
```

Sửa hết LỖI. Đọc các CẢNH BÁO (từ ngoài danh sách trong câu ví dụ, từ cấp cao hơn). Sau khi đã có ảnh và
dữ liệu nét (`npm run fetch:strokes`), chạy `npm run validate:content` (đầy đủ).
