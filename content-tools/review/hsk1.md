# Duyệt nội dung HSK 1

**Tình trạng: CHƯA DUYỆT.** Toàn bộ nội dung trong `web/public/data/words/hsk1.json` (150 từ, 300 câu ví dụ,
150 mẹo nhớ) và cách chia 15 bài trong `web/public/data/lessons/hsk1.json` do AI (Claude) soạn ngày 2026-11-17,
**chưa có người biết tiếng Trung kiểm tra**. Theo SC-008 và constitution V, phải có người duyệt trước khi coi là
đúng. Việc T031 trong `tasks.md` vẫn để `[ ]` cho tới khi có người duyệt ghi kết quả vào file này.

Máy chỉ kiểm tra được hình thức (`npm run validate:content`): đủ trường, số âm tiết pinyin bằng số chữ, `tones`
khớp dấu, ghép `tokens` bằng câu, mẹo nhớ ≤ 200 ký tự, mỗi bài 8–12 từ. Máy **không** biết dấu thanh hay nghĩa
có đúng không.

## Cách duyệt

Với mỗi từ, kiểm tra: chữ giản thể, pinyin và dấu thanh, nghĩa tiếng Việt, loại từ, 2 câu ví dụ (chữ, pinyin,
nghĩa, câu có tự nhiên không), mẹo nhớ (thành phần tách có đúng là có trong chữ không). Ghi lỗi vào bảng cuối
file, rồi sửa trong `hsk1.json` và chạy lại `npm run validate:content` trong `web/`.

## Các mục tôi kém chắc chắn nhất (xem trước)

### 1. Danh sách từ

- Danh sách 150 từ được soạn theo trí nhớ về bảng HSK 1 (HSK 2.0), **chưa đối chiếu với bảng chính thức**.
  Cần so lại từng từ. Giấy phép dùng bảng từ HSK cũng chưa kiểm tra.

### 2. Thanh nhẹ và biến điệu (dễ sai nhất)

- Biến điệu của 不 và 一: mục từ đơn ghi thanh gốc (`不 bù`, `一 yī`), còn trong từ ghép và câu ví dụ ghi theo
  cách đọc thật: `不客气 bú kèqi`, `不是 bú shì`, `一个 yí ge`, `一本 yì běn`, `一点儿 yìdiǎnr`, `一年 yì nián`.
  Cần thống nhất: có giữ cách ghi này không.
- Âm tiết thứ hai đọc thanh nhẹ (không dấu): 谢谢 xièxie, 学生 xuésheng, 朋友 péngyou, 东西 dōngxi,
  时候 shíhou, 漂亮 piàoliang, 认识 rènshi, 衣服 yīfu, 先生 xiānsheng, 喜欢 xǐhuan, 名字 míngzi, 什么 shénme,
  怎么 zěnme, 多少 duōshao, 没关系 méi guānxi, 对不起 duìbuqǐ, 不客气 bú kèqi, 个 ge (trong câu).
- Từ một chữ đọc thanh nhẹ: 吗 ma, 呢 ne, 的 de, 了 le.
- 谁: ghi `shéi` (khẩu ngữ), không ghi `shuí`.
- 儿化: 哪儿 `nǎr`, 一点儿 `yìdiǎnr`, 这儿 `zhèr` — chữ 儿 tính là một âm tiết thanh 0.
- Thanh 3 liền nhau giữ nguyên dấu (`nǐ hǎo`), không ghi biến điệu.

### 3. Mẹo nhớ là chuyện liên tưởng, không phải nguồn gốc chữ

Các mẹo dưới đây tôi kém chắc nhất về phần tách thành phần (có thể không đúng với cấu tạo thật của chữ):

- 我 (tách thành 手 + 戈), 是 (日 + 正; thật ra phần dưới gần với 疋), 买 (乛 + 头; chữ phồn thể 買 là 罒 + 贝),
  那 (phần trái ghi là "刀 biến dạng"), 来, 五, 六, 七, 九, 回, 前 ("con thuyền rẽ nước"), 不 ("chim bay lên"),
  几, 了, 能 ("hình con gấu"), 会 (人 + 云), 去 (土 + 厶), 书, 年.
- Câu chuyện cố ý dễ nhớ nên nhiều câu không phải nguồn gốc thật. Người duyệt cần xem có câu nào sai đến mức
  gây hiểu lầm không.

### 4. Loại từ còn tranh cãi

- 上, 下, 里, 前面, 后面: ghi `danh` (thật ra là phương vị từ).
- 在: ghi `động` (cũng là giới từ, phó từ).
- 一点儿: ghi `lượng`. 再见: ghi `động`. 不客气, 没关系, 喂: ghi `thán`. 会, 能, 想: ghi `động` (năng nguyện).

### 5. Câu ví dụ dùng từ không có trong danh sách 150 từ

Máy báo 12 từ trong câu ví dụ không có trong danh sách HSK 1 đã soạn: 他们, 们, 你们, 十二, 国, 天, 汉字, 睡, 见,
车, 这儿, 饭. Phần lớn là từ ghép từ chữ đã học (他 + 们, 十 + 二) hoặc một chữ trong từ đã học (国 trong 中国,
饭 trong 米饭). Người duyệt quyết định giữ hay thay câu khác.

### 6. Nghĩa và câu dịch

- 很 dịch là "rất", nhưng trong câu kiểu 我很好 thì 很 gần như không mang nghĩa "rất". Bản dịch đang ghi "Tôi rất
  khoẻ" — người duyệt xem có nên dịch tự nhiên hơn không.
- 你几岁？ dịch "Cháu mấy tuổi?" (hỏi trẻ con). 先生 có nghĩa "chồng".
- 今天星期四 dịch "Hôm nay thứ Năm" (星期四 = thứ Năm). Cần kiểm tra mọi câu có ngày trong tuần.

## Từ nên có ảnh minh hoạ (T032, chưa làm)

Theo R5, từ cụ thể nên có ảnh Canva phong cách thuỷ mặc. Hiện **chưa tạo ảnh nào** vì mỗi ảnh tốn lượt trong gói
Canva của người dùng và cần người dùng đồng ý. Để bản MVP chạy được, cả 150 từ đang để `kind: "abstract"`
(website tự vẽ hình tách bộ thủ từ dữ liệu nét). Danh sách từ nên có ảnh (43 từ):

| Nhóm | Từ |
|---|---|
| Con vật | 猫 hsk1-149, 狗 hsk1-148 |
| Ăn uống | 茶 hsk1-076, 水 hsk1-077, 杯子 hsk1-080, 苹果 hsk1-079, 水果 hsk1-078, 米饭 hsk1-074, 菜 hsk1-075 |
| Đồ vật | 书 hsk1-088, 桌子 hsk1-101, 椅子 hsk1-102, 电脑 hsk1-103, 电视 hsk1-104, 衣服 hsk1-107, 钱 hsk1-070 |
| Xe cộ | 飞机 hsk1-118, 出租车 hsk1-117 |
| Nơi chốn | 医院 hsk1-109, 商店 hsk1-108, 饭店 hsk1-073, 学校 hsk1-084, 家 hsk1-037 |
| Người | 医生 hsk1-110, 老师 hsk1-081, 学生 hsk1-082, 爸爸 hsk1-031, 妈妈 hsk1-032, 儿子 hsk1-033, 女儿 hsk1-034 |
| Hành động | 吃 hsk1-071, 喝 hsk1-072, 看 hsk1-091, 听 hsk1-093, 写 hsk1-090, 读 hsk1-089, 坐 hsk1-098, 睡觉 hsk1-140, 打电话 hsk1-145, 开 hsk1-138 |
| Thời tiết | 下雨 hsk1-130, 冷 hsk1-125, 热 hsk1-126 |

(Id đã đối chiếu với `hsk1.json` ngày 2026-11-17. Nếu sửa thứ tự từ thì đối chiếu lại trước khi đặt tên ảnh.)

## Kết quả duyệt

| Ngày | Người duyệt | Từ / câu | Lỗi | Đã sửa? |
|---|---|---|---|---|
| | | | | |
