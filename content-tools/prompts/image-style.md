# Hướng dẫn tạo ảnh minh hoạ bằng Canva

Ảnh dùng cho các từ `concrete` (đồ vật, con vật, thức ăn, nơi chốn, hành động). Mọi ảnh phải cùng một phong
cách để website không có "mùi AI" (constitution III, research R5).

## Trước khi bắt đầu

- **Giấy phép**: trước khi đưa bất kỳ ảnh nào lên website, đọc lại điều khoản giấy phép nội dung của Canva
  cho ảnh do AI tạo và cho phần tử có sẵn (Canva Content License Agreement, AI Product Terms). Việc này
  **chưa làm**. Ghi ngày đọc và kết luận vào `content-tools/review/`.
- Không dùng nguyên ảnh stock hay phần tử có sẵn của Canva làm một file ảnh rời trên website.
- Mỗi ảnh tốn một lượt tạo ảnh trong gói Canva. Làm 20 ảnh đầu, duyệt xong mới làm tiếp.

## Câu lệnh chung (dán nguyên, chỉ đổi phần CHỦ THỂ)

```
Tranh thuỷ mặc tối giản vẽ [CHỦ THỂ]. Mực đen đậm nhạt trên nền giấy ngà trơn màu #F6EFE1.
Chủ thể ở giữa, chiếm khoảng 60% khung hình. Đúng một điểm nhấn nhỏ màu đỏ son.
Nét cọ phóng khoáng, ít chi tiết, nhiều khoảng trống. Phẳng 2D, không đổ bóng, không hiệu ứng 3D.
Không chữ, không con dấu, không khung, không viền. Bố cục vuông.
```

Bản tiếng Anh (dùng khi Canva hiểu tiếng Anh tốt hơn):

```
Minimal Chinese ink wash painting of [SUBJECT]. Black ink in varied tones on plain ivory paper (#F6EFE1).
Subject centered, filling about 60% of the frame. Exactly one small cinnabar-red accent.
Loose brush strokes, few details, lots of empty space. Flat 2D, no shadows, no 3D effect.
No text, no seal stamp, no frame, no border. Square composition.
```

### Với từ chỉ hành động (吃, 喝, 看, 写…)

Thêm vào sau câu lệnh chung, và **nêu rõ đồ vật** đi kèm hành động:

```
Người vẽ giản lược vài nét, không vẽ mặt chi tiết, không trang phục cổ. [Người đó đang làm gì, với đồ vật gì].
```

Ví dụ cho 喝 (uống): "Một người đang uống nước từ một cái cốc thuỷ tinh. Người vẽ giản lược vài nét, không vẽ
mặt chi tiết, không trang phục cổ."

## Bài học từ 3 ảnh mẫu (`content-tools/samples/`)

| Ảnh | Nhận xét | Rút ra |
|---|---|---|
| `mau-01-meo.png` (猫) | Nét mực và điểm đỏ (vòng cổ) đạt, nhưng con mèo nhỏ và nằm lệch góc dưới phải | Luôn ghi "chủ thể ở giữa, chiếm khoảng 60% khung hình" |
| `mau-02-tra.png` (茶) | Ấm và chén rõ, đúng phong cách, nhưng cũng nhỏ và lệch xuống dưới, phần trên trống | Như trên; đồ vật và con vật thì câu lệnh chung là đủ |
| `mau-03-uong-nuoc.png` (喝) | Người bị vẽ thành mỹ nhân cổ trang, mặt chi tiết, nằm lệch góc, không rõ đang uống gì | Từ hành động: thêm "người vẽ giản lược vài nét, không vẽ mặt chi tiết, không trang phục cổ" và nêu rõ đồ vật |

## Duyệt từng ảnh ("mùi AI")

Loại ảnh nếu có một trong các lỗi sau, rồi tạo lại hoặc chuyển từ đó sang `abstract`:

- Bàn tay, ngón tay, khuôn mặt sai hoặc quá chi tiết.
- Chi tiết vô nghĩa, chữ giả, con dấu giả, khung viền.
- Bóng bẩy kiểu 3D, màu loang nhiều hơn một điểm đỏ, nền không phải giấy ngà trơn.
- Nhìn 2 giây không đoán ra từ đang học.
- Chủ thể quá nhỏ, lệch góc, hoặc bị cắt.

Nếu 20 ảnh đầu có quá nhiều ảnh không đạt: dùng phương án dự phòng của research R5 — để các từ đó là
`abstract` (website tự vẽ hình tách bộ thủ), chỉ làm ảnh cho khoảng 100 từ HSK 1 thông dụng nhất.

## Xuất file

1. Trong Canva: xuất **PNG vuông**, cạnh từ 512px trở lên.
2. Đổi kích thước về **512×512** và chuyển sang **WebP, tối đa 40KB** (chất lượng khoảng 70–80; nếu vẫn quá
   40KB thì giảm chất lượng). Có thể dùng trang squoosh.app (chạy ngay trên trình duyệt, không tải ảnh đi đâu).
3. Đặt tên theo id của từ: `web/public/images/words/<wordId>.webp`, ví dụ `hsk1-078.webp`.
4. Trong file từ vựng: đổi `"kind": "abstract"` thành `"kind": "concrete"` và thêm
   `"image": "images/words/<wordId>.webp"`.
5. Chạy `npm run validate:content` trong `web/` — không được có lỗi quy tắc 5.
