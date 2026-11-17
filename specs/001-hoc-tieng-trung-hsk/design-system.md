# Design System: Mặc Hán — Trung Hoa hiện đại

**Nguồn**: chạy `ui-ux-pro-max` (`--design-system`, `--domain style/color/typography/gsap/ux`) ngày 2026-11-16.
Kết quả `--design-system` tự động trả về Claymorphism + tím chàm + Comic Neue: **không khớp** phong cách
đã chốt trong spec (Clarifications Q5) và Comic Neue không hỗ trợ tốt tiếng Việt, nên không dùng.
Hệ dưới đây ghép từ các kết quả tìm riêng đã kiểm tra: style `e-ink-paper` (nền giấy, mực) +
`anti-polish-raw-aesthetic` (nét tay, texture), cặp font "Chinese Simplified/Traditional" (Noto),
preset GSAP Scroll Reveal, và luật UX Reduced Motion / Excessive Motion.

## Ý tưởng

Một tờ giấy xuyến chỉ trên bàn học thư pháp: nền giấy ngà có thớ nhẹ, chữ mực đen đậm nhạt,
dấu son đỏ để khen thưởng, viền vàng kim cho thành tựu. Hiện đại ở bố cục: thoáng, lưới rõ,
nhiều khoảng trắng, góc bo nhỏ (không bo tròn kiểu đồ chơi).

## Màu (CSS variables)

| Vai trò | Biến | Hex | Ghi chú tương phản |
|---|---|---|---|
| Nền giấy | `--paper` | `#F6EFE1` | nền chính |
| Nền giấy đậm | `--paper-deep` | `#ECE1CB` | khối phụ, thẻ úp |
| Mặt thẻ | `--card` | `#FBF7EE` | |
| Mực | `--ink` | `#1E1B18` | chữ chính, ~15:1 trên `--paper` |
| Mực nhạt | `--ink-soft` | `#5A524A` | chữ phụ, ~6.8:1 |
| Mực loang | `--ink-wash` | `#1E1B18` @ 8–20% | hiệu ứng loang, nền chìm |
| Đỏ son | `--cinnabar` | `#B3261E` | nút chính, con dấu; chữ trắng trên son ~6.6:1 |
| Đỏ son đậm | `--cinnabar-deep` | `#8C1D17` | hover/pressed |
| Vàng kim | `--gold` | `#C9A04A` | CHỈ trang trí: viền, huy hiệu, đường kẻ (không làm màu chữ) |
| Vàng kim chữ | `--gold-text` | `#7A5A12` | khi cần chữ màu vàng, ~5.6:1 |
| Ngọc (đúng) | `--jade` | `#2F6B4F` | phản hồi đúng, ~5.9:1 |
| Viền | `--line` | `#D9CCB3` | |
| Focus | `--ring` | `#B3261E` | outline 2px + offset 2px |

Màu thanh điệu (dùng nhất quán ở pinyin, biểu đồ thanh, trò chơi): thanh 1 `#2F5D8A`,
thanh 2 `#2F6B4F`, thanh 3 `#8A5A12`, thanh 4 `#B3261E`, thanh nhẹ `#5A524A`.
Luôn kèm số/dấu thanh, không chỉ dựa vào màu.

Chế độ tối (tuỳ chọn, sau): "giấy đêm" `#16130F`, mực đảo `#EFE6D4`. Bản đầu chỉ cần sáng.

## Font

| Dùng cho | Font | Lý do |
|---|---|---|
| Chữ Hán trang trí TĨNH (con dấu, tiêu đề lớn, chữ nền chìm) | **Ma Shan Zheng** (Google Fonts) | nét bút lông, giản thể; không dùng cho chữ cần hiệu ứng viết nét (dùng Hanzi Writer) |
| Chữ Hán học (thẻ, trang từ) | **Noto Serif SC** | nét Tống rõ, đúng chuẩn mặt chữ cho người học |
| Tiêu đề tiếng Việt | **Noto Serif** (600–700) | serif có dấu tiếng Việt đầy đủ, hợp chất "thư tịch" |
| Nội dung, nút | **Be Vietnam Pro** (400–600) | sans hiện đại, dấu tiếng Việt đẹp |
| Pinyin | **Be Vietnam Pro** | hiển thị đúng dấu thanh (ǎ, ǚ) |

Cỡ chữ: body 16px / line-height 1.6; chữ Hán trên thẻ 72–120px (mobile ≥ 72px, vượt mức tối thiểu
24px của constitution); pinyin 20–24px. Font chữ Hán tải theo subset (`display=swap`) để không chặn trang.

## Hình khối, khoảng cách, bóng

- Bo góc: 6px (nút, ô), 10px (thẻ). Không bo 16–24px kiểu đồ chơi.
- Khoảng cách theo thang 4px: 4, 8, 12, 16, 24, 32, 48, 64.
- Bóng: một lớp mềm `0 1px 0 #fff8 inset, 0 6px 18px -8px #1E1B1833`. Không double-shadow.
- Texture giấy: một ảnh noise nhỏ (≤ 20KB) phủ `opacity: .25`, tắt trên máy yếu nếu cần.
- Viền "nét cọ": SVG path hơi run tay cho divider và khung thẻ nổi bật.
- Icon: Lucide (SVG, nét 1.75px), không emoji.

## Hiệu ứng (motion)

Nguyên tắc: hiệu ứng nói lên ý nghĩa (constitution IV), tối đa 1–2 hiệu ứng chính mỗi màn (luật UX
"Excessive Motion"), chỉ animate `transform`/`opacity` (trừ nét vẽ SVG dùng `stroke-dashoffset`).

| Hiệu ứng | Nơi dùng | Thời lượng | Cách làm |
|---|---|---|---|
| Chữ tự viết từng nét | Hero trang chủ, trang chi tiết từ | 1.2–2.5s, bỏ qua được, không chặn bấm | **Hanzi Writer** (animateCharacter) với nét màu mực `--ink`, thêm SVG filter (feTurbulence + feDisplacementMap nhẹ) cho mép nét như mực thấm giấy. Không animate font Ma Shan Zheng (font không có dữ liệu nét) |
| Mực loang khi cuộn | Đầu mỗi section trang chủ | 600–900ms | mask SVG radial + scale, GSAP ScrollTrigger (preset Scroll Reveal Standard) |
| Con dấu đỏ đóng xuống | Chọn level, hoàn thành bài, đạt mục tiêu | 350ms | scale 1.4→1 + rotate −8°→−4° + rung nhẹ, `back.out` |
| Lật thẻ | Flashcard | 400ms | rotateY 3D, `power2.out` |
| Đúng / sai | Trò chơi, ôn tập | 200–300ms | đúng: viền ngọc + nhịp nhẹ; sai: lắc ngang 6px |
| Sự kiện bất ngờ | Trò chơi | ≤ 400ms, hiện CÙNG LÚC với câu hỏi | dải băng giấy đỏ nhỏ trượt vào phía trên câu hỏi; người chơi trả lời được ngay (constitution IV) |
| Mở khoá bài | Lộ trình | 500ms | ổ khoá mờ dần + dấu son |
| Vòng mục tiêu | Trang Hôm nay (`/hoc`) | 600ms, không chặn bấm | stroke-dashoffset theo % |

Reduced motion: mọi hiệu ứng trên thay bằng fade 150ms hoặc hiện ngay trạng thái cuối; chữ tự viết
hiện sẵn đủ nét. Hiệu ứng không bao giờ chặn bấm tiếp.

## Bố cục trang chủ (theo spec US7)

1. **Hero**: chữ 中文 tự viết từng nét (Hanzi Writer, nét mực có mép thấm giấy) trên nền giấy, câu mở đầu, nút "Chọn level của bạn" (cuộn xuống)
   và nút "Học tiếp" nếu đã có tiến độ.
2. **Chữ Hán là tranh vẽ**: 3 ví dụ bộ thủ ghép thành chữ (日+月=明…) có hiệu ứng ghép.
3. **Bốn thanh điệu**: 4 thẻ mā/má/mǎ/mà, bấm nghe, đường thanh điệu vẽ ra.
4. **Học HSK để làm gì**: 3 lợi ích, minh hoạ mực.
5. **Lộ trình**: dải cuộn ngang/ dọc từ Pinyin → HSK 6.
6. **Chọn level**: thang đo 5 nấc (Mới bắt đầu, HSK 1, HSK 2, HSK 3, HSK 4–6 "sắp có") + "Kiểm tra trình độ"; chọn → con dấu đóng → chuyển trang.

Không dùng: testimonials carousel (pattern mặc định của tool) — chưa có người dùng thật, và hiển
thị đánh giá giả là sai sự thật.

## Checklist trước khi giao

- [ ] Không emoji làm icon; icon Lucide SVG
- [ ] Tương phản chữ ≥ 4.5:1 (vàng kim không dùng làm chữ)
- [ ] Focus thấy rõ, đủ thao tác bằng bàn phím
- [ ] `prefers-reduced-motion` được tôn trọng ở mọi hiệu ứng
- [ ] Responsive 360 / 768 / 1280px, không cuộn ngang
- [ ] Vùng bấm ≥ 44×44px
- [ ] Font tiếng Việt và chữ Hán không bị ô vuông
