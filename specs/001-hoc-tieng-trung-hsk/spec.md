# Feature Specification: Website học tiếng Trung HSK

**Feature Branch**: `001-hoc-tieng-trung-hsk`

**Created**: 2026-11-16

**Status**: Draft

## Clarifications

### Session 2026-11-16

- Q: Phạm vi cấp độ bản đầu? → A: Pinyin + HSK 1–3; HSK 4–6 hiện "sắp có" trên lộ trình.
- Q: Kênh nhắc nhở? → A: Thông báo đẩy trên thiết bị, cài website lên màn hình chính như app.
- Q: Chức năng thú vị? → A: Cả 5 trò (Ghép cặp, Nghe chọn từ, Luyện viết, Sắp xếp câu,
  Đua thời gian), mỗi trò là một mục riêng.
- Q: Khi mở website, trang chủ hiển thị gì? → A: Trang chủ là trang giới thiệu tiếng Trung cho
  người mới; cuộn xuống có phần chọn level theo thang đo, chọn level nào thì được đưa tới trang
  học phù hợp với level đó.
- Q: Từ vựng có cách ghi nhớ và hình liên tưởng ở mức nào? → A: Mọi từ có mẹo nhớ; hình minh hoạ
  chỉ cho từ cụ thể (đồ vật, con vật, hành động, nơi chốn); từ trừu tượng dùng hình tách bộ thủ
  có hiệu ứng ghép chữ.
- Q: Mục tiêu mỗi ngày đặt theo cách nào để vừa sức? → A: Bắt đầu 10 từ mới + thẻ cần ôn hôm nay;
  dựa trên 7 ngày gần nhất, đạt ≥ 6/7 ngày và nhớ tốt thì gợi ý tăng, đạt ≤ 3/7 ngày thì gợi ý
  giảm; người học đồng ý mới đổi; luôn trong khoảng 3–20 từ mới/ngày.
- Q: Trò chơi cần sáng tạo, khó đoán đến mức nào? → A: Đáp án nhiễu dễ nhầm (gần âm, gần hình,
  cùng chủ đề), đổi kiểu hỏi mỗi lượt, không lặp bộ câu hỏi, khó dần khi đúng liên tiếp; thêm sự kiện
  bất ngờ ngẫu nhiên và một thử thách tuần dùng các từ hay sai.
- Q: Trang chủ theo phong cách hình ảnh nào? → A: Trung Hoa hiện đại: giấy xuyến chỉ, mực tàu,
  đỏ son, vàng kim; chữ bút lông tự viết từng nét, mực loang khi cuộn, con dấu đỏ khi hoàn thành;
  bố cục hiện đại, thoáng.

**Input**: User description: "website học tiếng Trung cho người mới từ cơ bản đến nâng cao, học từ vựng HSK bằng flashcard, có pinyin và phát âm, ôn tập lặp lại ngắt quãng, có mục tiêu học mỗi ngày, có lịch nhắc nhở học, thêm nhiều chức năng thú vị để. giới thiệu tiếng trung bắt mắt, lộ trình học bài bản, có riêng 1 trang từ vựng và những câu áp dụng từ vựng đó, dễ học dễ nhớ."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Học từ mới HSK bằng flashcard (Priority: P1)

Người mới vào website, chọn cấp HSK (bắt đầu từ HSK 1) và một bài học. Mỗi thẻ hiện
chữ Hán thật to; người học chạm để lật thẻ và thấy pinyin có dấu thanh, nghĩa tiếng Việt,
mẹo nhớ kèm hình liên tưởng, một câu ví dụ ngắn, và nghe được phát âm. Sau mỗi thẻ, người học tự đánh giá
"Chưa nhớ / Hơi nhớ / Đã nhớ". Hết bài, website hiện màn hình tổng kết có hiệu ứng chúc mừng.

**Why this priority**: Đây là giá trị cốt lõi; chỉ riêng tính năng này đã đủ làm một sản phẩm
dùng được.

**Independent Test**: Mở website lần đầu, vào bài 1 HSK 1, học hết các thẻ, nghe phát âm,
lật thẻ và thấy màn hình tổng kết, không cần đăng ký.

**Acceptance Scenarios**:

1. **Given** người dùng mới ở trang chủ, **When** chọn level HSK 1 ở phần chọn level, **Then** vào
   được thẻ đầu tiên của bài 1 HSK 1 trong tối đa 3 lần bấm.
2. **Given** đang xem mặt trước thẻ, **When** chạm vào thẻ, **Then** thẻ lật có hiệu ứng và hiện
   pinyin, nghĩa tiếng Việt, câu ví dụ.
3. **Given** đang xem một thẻ, **When** bấm nút loa, **Then** nghe được phát âm chuẩn của từ.
4. **Given** đã học hết thẻ trong bài, **When** đánh giá thẻ cuối, **Then** thấy màn hình tổng kết
   gồm số từ đã nhớ, chưa nhớ và hiệu ứng chúc mừng.
5. **Given** đang học giữa chừng, **When** đóng trang rồi mở lại, **Then** được hỏi có muốn học tiếp
   từ thẻ đang dở không.

---

### User Story 2 - Ôn tập lặp lại ngắt quãng (Priority: P2)

Những từ đã học được website tự lên lịch ôn: từ chưa nhớ ôn sớm, từ đã nhớ ôn thưa dần.
Mỗi ngày người học thấy số thẻ "cần ôn hôm nay" và ôn bằng flashcard hoặc bài trắc nghiệm nhanh.

**Why this priority**: Không ôn thì quên; ôn ngắt quãng là thứ biến "đã học" thành "nhớ lâu".

**Independent Test**: Học 10 từ, đánh dấu vài từ "Chưa nhớ", đổi ngày hệ thống sang hôm sau,
mở website và thấy đúng các từ đó trong danh sách cần ôn.

**Acceptance Scenarios**:

1. **Given** đã học từ và đánh "Chưa nhớ", **When** sang ngày hôm sau, **Then** từ đó nằm trong
   danh sách cần ôn hôm nay.
2. **Given** một từ được đánh "Đã nhớ" liên tiếp nhiều lần, **When** xem lịch ôn, **Then** khoảng
   cách giữa các lần ôn tăng dần (ví dụ 1 → 3 → 7 → 14 → 30 ngày).
3. **Given** không có thẻ nào đến hạn, **When** vào mục ôn tập, **Then** thấy thông báo đã ôn xong
   và gợi ý học bài mới.

---

### User Story 3 - Trang từ vựng và câu áp dụng (Priority: P3)

Website có một trang từ vựng riêng: danh sách toàn bộ từ, lọc theo cấp HSK và chủ đề, tìm kiếm
bằng chữ Hán, pinyin (gõ có hoặc không dấu) hoặc nghĩa tiếng Việt. Bấm vào một từ mở trang chi tiết
gồm chữ Hán, pinyin, phát âm, nghĩa, loại từ, cách viết (thứ tự nét), và nhiều câu ví dụ áp dụng từ đó,
mỗi câu có pinyin, nghĩa tiếng Việt và phát âm cả câu.

**Why this priority**: Người học cần một chỗ tra lại và thấy từ được dùng trong câu thật thì mới
nhớ và dùng được.

**Independent Test**: Mở trang từ vựng, tìm "ni hao", mở từ 你好, nghe câu ví dụ, và thêm từ vào
danh sách ôn.

**Acceptance Scenarios**:

1. **Given** ở trang từ vựng, **When** gõ "nihao", "nǐ hǎo", "你好" hoặc "xin chào", **Then** từ 你好
   xuất hiện trong kết quả.
2. **Given** ở trang chi tiết một từ, **When** xem phần câu ví dụ, **Then** có ít nhất 2 câu, mỗi câu
   có chữ Hán, pinyin, nghĩa tiếng Việt và nút nghe.
3. **Given** ở trang chi tiết một từ chưa học, **When** bấm "Thêm vào ôn tập", **Then** từ đó vào
   lịch ôn tập.
4. **Given** ở trang chi tiết, **When** bấm xem cách viết, **Then** thấy chữ được viết từng nét
   theo đúng thứ tự.

---

### User Story 4 - Lộ trình học bài bản (Priority: P4)

Người học thấy một lộ trình trực quan từ cơ bản đến nâng cao: bắt đầu bằng pinyin và thanh điệu,
rồi HSK 1, HSK 2… Mỗi chặng chia thành bài nhỏ (khoảng 10 từ/bài) theo chủ đề. Bài sau mở khoá
khi xong bài trước; người học thấy rõ mình đang ở đâu và còn bao nhiêu.

**Why this priority**: Người mới không biết học gì trước; lộ trình cho họ con đường rõ ràng.

**Independent Test**: Mở trang lộ trình, thấy chặng hiện tại được đánh dấu, hoàn thành 1 bài và
thấy bài kế tiếp được mở khoá kèm hiệu ứng.

**Acceptance Scenarios**:

1. **Given** người dùng mới, **When** mở lộ trình, **Then** chặng đầu là "Pinyin & thanh điệu"
   và các bài sau ở trạng thái khoá.
2. **Given** hoàn thành một bài, **When** quay lại lộ trình, **Then** bài đó được đánh dấu xong và
   bài kế tiếp mở khoá có hiệu ứng.
3. **Given** người đã biết cơ bản, **When** chọn "Kiểm tra trình độ", **Then** làm một bài test ngắn
   và được xếp vào chặng phù hợp.

---

### User Story 5 - Mục tiêu hằng ngày và chuỗi ngày học (Priority: P5)

Mục tiêu mỗi ngày tự vừa sức: bắt đầu ở mức Vừa phải (10 từ mới + các thẻ cần ôn hôm nay).
Website theo dõi 7 ngày gần nhất và gợi ý tăng khi người học làm tốt đều, gợi ý giảm khi người học
hay trượt mục tiêu; người học đồng ý thì mới đổi. Trang Hôm nay (`/hoc`) hiện vòng tiến độ của hôm nay, chuỗi
ngày học liên tiếp (streak), và lịch các ngày đã học.

**Why this priority**: Mục tiêu nhỏ và chuỗi ngày học tạo thói quen, giữ người học quay lại.

**Independent Test**: Với mục tiêu mặc định, học đủ 10 từ mới và ôn hết thẻ đến hạn, thấy vòng tiến độ
đầy kèm hiệu ứng và streak tăng 1.

**Acceptance Scenarios**:

1. **Given** người dùng mới, **When** bắt đầu học, **Then** mục tiêu là 10 từ mới + các thẻ cần ôn hôm nay,
   và học 5 từ mới (chưa có thẻ ôn) thì vòng tiến độ hiện 50%.
2. **Given** đạt mục tiêu ít nhất 6 trong 7 ngày gần nhất và nhớ tốt phần lớn thẻ ôn, **When** mở Trang Hôm nay,
   **Then** thấy gợi ý tăng mục tiêu (ví dụ 10 → 13 từ) kèm nút "Đồng ý" và "Giữ nguyên".
3. **Given** chỉ đạt mục tiêu 3 ngày trở xuống trong 7 ngày gần nhất, **When** mở Trang Hôm nay, **Then** thấy
   gợi ý giảm mục tiêu với lời động viên, không trách móc.
4. **Given** mục tiêu đang là 3 hoặc 20 từ, **When** website xét gợi ý, **Then** không gợi ý vượt ra ngoài
   khoảng 3–20 từ mới/ngày.
5. **Given** đạt mục tiêu hôm nay, **When** hoàn thành từ cuối, **Then** có hiệu ứng chúc mừng và
   streak tăng 1.
6. **Given** bỏ lỡ một ngày, **When** mở website hôm sau, **Then** streak về 0 và thấy lời động viên
   bắt đầu lại.

---

### User Story 6 - Lịch nhắc nhở học (Priority: P6)

Người học chọn giờ và các ngày trong tuần muốn được nhắc. Đến giờ, người học nhận được thông báo
nhắc học kèm số thẻ cần ôn hôm nay.

**Why this priority**: Nhắc đúng lúc giúp giữ thói quen, nhưng website vẫn dùng được không cần nó.

**Independent Test**: Đặt nhắc lúc 1 phút sau, cho phép thông báo, và nhận được thông báo đúng giờ.

**Acceptance Scenarios**:

1. **Given** ở cài đặt nhắc nhở, **When** chọn 20:00 các ngày Thứ 2–6 và lưu, **Then** lịch nhắc
   hiện đúng các ngày và giờ đã chọn.
2. **Given** đã đặt lịch nhắc và cho phép thông báo, **When** đến giờ nhắc, **Then** nhận được
   thông báo đẩy trên thiết bị (trình duyệt hoặc website đã cài lên màn hình chính), bấm vào
   thông báo mở thẳng phần ôn tập hôm nay.
5. **Given** người dùng iPhone chưa cài website lên màn hình chính, **When** mở cài đặt nhắc nhở,
   **Then** thấy hướng dẫn từng bước bằng hình cách "Thêm vào màn hình chính" để nhận được nhắc.
3. **Given** đã đạt mục tiêu hôm nay trước giờ nhắc, **When** đến giờ nhắc, **Then** không bị nhắc.
4. **Given** người dùng từ chối quyền thông báo, **When** lưu lịch nhắc, **Then** thấy hướng dẫn
   bằng tiếng Việt cách bật lại quyền.

---

### User Story 7 - Trang chủ giới thiệu và chọn level (Priority: P7)

Trang chủ là trang giới thiệu tiếng Trung cho người mới, theo phong cách **Trung Hoa hiện đại**
(nền giấy xuyến chỉ, mực tàu, đỏ son, vàng kim; bố cục hiện đại, thoáng) và nhiều hiệu ứng: chữ Hán
tự viết từng nét bằng nét mực, mực loang khi cuộn trang, con dấu đỏ đóng khi hoàn thành. Nội dung: tiếng
Trung thú vị thế nào, chữ Hán được ghép từ bộ thủ ra sao, 4 thanh điệu nghe khác nhau thế nào (nghe thử được),
học HSK để làm gì. Cuộn xuống dưới là phần **chọn level**: website hỏi "Bạn đang ở level nào?" và
hiện thang đo gồm Mới bắt đầu (chưa biết gì), HSK 1, HSK 2, HSK 3, cùng HSK 4–6 ở trạng thái
"sắp có", mỗi level có mô tả ngắn để người dùng tự nhận ra mình (ví dụ "biết chào hỏi, đếm số").
Chọn level nào, website đưa người dùng tới Trang level của level đó (`/lo-trinh/<cấp>`). Ai không chắc level của mình thì
chọn "Kiểm tra trình độ".

**Why this priority**: Tạo ấn tượng đầu tiên, và đưa mỗi người vào đúng chỗ ngay từ đầu, không bắt
người đã biết phải học lại từ đầu.

**Independent Test**: Mở trang chủ, cuộn hết trang, nghe thử 4 thanh điệu, chọn "HSK 2" và được đưa
tới Trang level HSK 2.

**Acceptance Scenarios**:

1. **Given** người dùng mở website, **When** trang chủ tải xong, **Then** thấy trang giới thiệu có hiệu
   ứng khi cuộn và một nút dẫn xuống phần chọn level luôn dễ thấy.
2. **Given** ở phần thanh điệu, **When** bấm từng thanh của "ma", **Then** nghe được 4 âm khác nhau
   kèm hình minh hoạ đường lên xuống của thanh.
3. **Given** ở phần chọn level, **When** chọn "Mới bắt đầu", **Then** được đưa tới chặng
   "Pinyin & thanh điệu".
4. **Given** ở phần chọn level, **When** chọn HSK 1, 2 hoặc 3, **Then** được đưa tới Trang level của cấp
   đó, bài đầu tiên của cấp mở sẵn, các cấp thấp hơn vẫn vào học được nếu muốn.
5. **Given** ở phần chọn level, **When** chọn một level "sắp có" (HSK 4–6), **Then** thấy thông báo
   level đang được soạn và gợi ý học HSK 3.
6. **Given** ở phần chọn level, **When** chọn "Kiểm tra trình độ", **Then** làm bài test ngắn và được
   đưa tới level phù hợp với kết quả.
7. **Given** người dùng đã có tiến độ học, **When** mở trang chủ, **Then** vẫn thấy trang giới thiệu,
   kèm nút "Học tiếp" nổi bật ở đầu trang đưa thẳng tới bài đang học.
8. **Given** đã chọn level trước đó, **When** đổi sang level khác, **Then** tiến độ của các level vẫn được giữ.

---

### User Story 8 - Chức năng thú vị giúp nhớ lâu (Priority: P8)

Ngoài flashcard, người học có mục "Luyện tập" gồm 5 trò, mỗi trò là một mục riêng, chọn và chơi độc lập,
dùng chính các từ đã học, có điểm, hiệu ứng và huy hiệu:

1. **Ghép cặp**: nối chữ Hán với nghĩa tiếng Việt (hoặc với pinyin).
2. **Nghe chọn từ**: nghe phát âm rồi chọn đúng chữ Hán trong 4 đáp án.
3. **Luyện viết**: viết chữ Hán theo đúng thứ tự nét bằng ngón tay hoặc chuột, có gợi ý nét khi viết sai.
4. **Sắp xếp câu**: kéo thả các từ để ghép thành câu đúng, dựa trên câu ví dụ của từ đã học.
5. **Đua thời gian**: trả lời nhanh nhiều câu nhất có thể trong 60 giây, lưu điểm cao nhất.

Các trò được thiết kế để người chơi không đoán mò được: đáp án sai dễ nhầm với đáp án đúng, kiểu hỏi
đổi liên tục, câu hỏi khó dần, và thỉnh thoảng có sự kiện bất ngờ. Mỗi tuần có một **Thử thách tuần**
dùng chính các từ người chơi hay sai.

**Why this priority**: Làm việc học vui và đa dạng, nhưng chỉ có giá trị khi đã có từ để chơi.

**Independent Test**: Học xong 1 bài, chơi 1 trò dùng từ của bài đó, thấy điểm và nhận huy hiệu đầu tiên.

**Acceptance Scenarios**:

1. **Given** đã học ít nhất 1 bài, **When** mở mục trò chơi, **Then** chơi được bằng các từ đã học.
2. **Given** chơi xong một lượt, **When** xem kết quả, **Then** thấy điểm, từ trả lời sai và nút ôn lại
   các từ sai.
3. **Given** đạt một mốc (ví dụ học 50 từ, streak 7 ngày), **When** mốc đạt được, **Then** nhận huy hiệu
   kèm hiệu ứng.
4. **Given** ở trò Luyện viết, **When** viết sai thứ tự nét, **Then** nét sai không được nhận và nét
   đúng được gợi ý nhấp nháy.
5. **Given** ở trò Sắp xếp câu, **When** xếp đúng thứ tự, **Then** nghe được cả câu và thấy nghĩa tiếng Việt.
6. **Given** ở trò Đua thời gian, **When** hết 60 giây, **Then** thấy điểm lượt này, điểm cao nhất và
   hiệu ứng nếu phá kỷ lục.
7. **Given** câu hỏi nghe hoặc nhìn chữ 妈 (mā), **When** xem 4 đáp án, **Then** các đáp án sai gồm từ
   dễ nhầm như 马 (mǎ) hoặc 吗 (ma), không phải từ khác hẳn về âm và hình.
8. **Given** chơi cùng một trò hai lượt liên tiếp, **When** so sánh hai lượt, **Then** bộ câu hỏi,
   thứ tự và kiểu hỏi không giống nhau.
9. **Given** trả lời đúng liên tiếp 5 câu, **When** sang câu kế tiếp, **Then** câu hỏi khó hơn
   (ví dụ đáp án nhiễu gần hơn, hoặc phải nghe thay vì nhìn).
10. **Given** đang trong một lượt chơi, **When** gặp sự kiện bất ngờ (nhân đôi điểm, câu thưởng,
    đảo chiều hỏi, từ bí ẩn), **Then** sự kiện được báo bằng một dải băng nổi bật hiện cùng lúc với câu
    hỏi (hiệu ứng ≤ 400ms), người chơi trả lời được ngay, không phải chờ hiệu ứng.
11. **Given** đã có từ hay trả lời sai trong tuần, **When** mở mục Luyện tập, **Then** thấy Thử thách tuần
    dùng các từ đó, chơi xong nhận huy hiệu tuần.

---

### Edge Cases

- Thiết bị hoặc trình duyệt không phát được âm thanh: nút loa báo rõ bằng tiếng Việt, việc học
  vẫn tiếp tục được.
- Thiết bị không có font chữ Hán: chữ Hán vẫn hiển thị đúng, không ra ô vuông.
- Người dùng xoá dữ liệu trình duyệt hoặc đổi máy: tiến độ mất; website cần cảnh báo trước điều này
  và cho phép xuất/nhập tiến độ ra file.
- Người dùng bỏ học nhiều ngày, số thẻ cần ôn dồn lên hàng trăm: chỉ hiện tối đa một lượng hợp lý
  mỗi ngày (ví dụ 50 thẻ), phần còn lại dời sang ngày sau.
- Tìm kiếm không ra kết quả: gợi ý cách gõ khác (pinyin không dấu, nghĩa tiếng Việt).
- Đổi múi giờ hoặc học qua nửa đêm: "một ngày" tính theo giờ địa phương của thiết bị.
- Người dùng bật chế độ giảm chuyển động: hiệu ứng tắt hoặc chỉ còn mờ dần, mọi chức năng vẫn dùng được.
- Mạng chập chờn hoặc mất mạng giữa bài: bài đang học vẫn tiếp tục được.

## Requirements *(mandatory)*

### Functional Requirements

**Học bằng flashcard**

- **FR-001**: Website MUST cho người dùng học không cần đăng ký tài khoản.
- **FR-002**: Mỗi từ vựng MUST có chữ Hán giản thể, pinyin có dấu thanh, nghĩa tiếng Việt, loại từ,
  cấp HSK, chủ đề, phát âm, ít nhất 2 câu ví dụ và một mẹo nhớ.
- **FR-002a**: Mẹo nhớ MUST gồm phần tách chữ Hán thành bộ thủ/thành phần (kèm nghĩa từng phần) và
  một câu chuyện liên tưởng ngắn bằng tiếng Việt (tối đa khoảng 2 câu).
- **FR-002b**: Từ cụ thể (đồ vật, con vật, hành động, nơi chốn) MUST có hình minh hoạ liên tưởng.
  Từ trừu tượng MUST có hình tách bộ thủ, với hiệu ứng các thành phần ghép lại thành chữ.
- **FR-002c**: Mẹo nhớ và hình liên tưởng MUST hiện ở mặt sau flashcard và ở trang chi tiết từ.
- **FR-003**: Thẻ flashcard MUST lật được bằng chạm, bấm chuột hoặc phím cách, có hiệu ứng lật.
- **FR-004**: Người dùng MUST nghe được phát âm của từ và của từng câu ví dụ.
- **FR-005**: Người dùng MUST tự đánh giá mỗi thẻ theo 3 mức: Chưa nhớ / Hơi nhớ / Đã nhớ.
- **FR-006**: Người dùng MUST chọn được chế độ học: nhìn chữ Hán đoán nghĩa, hoặc nhìn nghĩa đoán chữ Hán.
- **FR-007**: Website MUST lưu tiến độ trong bài để học tiếp được sau khi đóng trang.

**Ôn tập lặp lại ngắt quãng**

- **FR-008**: Website MUST tự lên lịch ôn cho từng từ dựa trên đánh giá của người dùng; khoảng cách
  tăng khi nhớ tốt và rút ngắn khi quên.
- **FR-009**: Website MUST hiện số thẻ cần ôn hôm nay ở Trang Hôm nay (`/hoc`) và cạnh nút "Học tiếp"
  ở trang chủ.
- **FR-010**: Số thẻ ôn mỗi ngày MUST có giới hạn tối đa (mặc định 50, người dùng chỉnh được trong
  khoảng 10–100).

**Trang từ vựng**

- **FR-011**: Website MUST có trang danh sách từ vựng lọc được theo cấp HSK, chủ đề và trạng thái
  (chưa học / đang học / đã thuộc).
- **FR-012**: Tìm kiếm MUST nhận chữ Hán, pinyin có dấu, pinyin không dấu và nghĩa tiếng Việt.
- **FR-013**: Trang chi tiết từ MUST hiện thứ tự nét viết của từng chữ Hán dưới dạng hoạt ảnh.
- **FR-014**: Người dùng MUST thêm được một từ vào lịch ôn từ trang chi tiết.

**Lộ trình**

- **FR-015**: Website MUST có lộ trình gồm chặng "Pinyin & thanh điệu" rồi các cấp HSK theo thứ tự,
  mỗi cấp chia thành bài nhỏ khoảng 10 từ theo chủ đề.
- **FR-016**: Trong một cấp, bài học MUST mở khoá tuần tự. Người dùng MUST vào thẳng được bài đầu của
  bất kỳ cấp đã có nội dung nào bằng cách chọn level ở trang chủ (FR-023a) hoặc qua bài kiểm tra trình độ.
- **FR-017**: Bản đầu MUST có đủ nội dung cho chặng Pinyin và HSK 1, HSK 2, HSK 3 (khoảng 600 từ).
  Lộ trình MUST hiện tiếp HSK 4–6 ở trạng thái "sắp có" để người học thấy đường lên nâng cao.
- **FR-018**: Chặng pinyin MUST dạy được thanh mẫu, vận mẫu và 4 thanh điệu, có nghe và luyện phân biệt.

**Mục tiêu, streak, nhắc nhở**

- **FR-019**: Mục tiêu hằng ngày MUST gồm số từ mới (mặc định 10) cộng toàn bộ thẻ cần ôn hôm nay
  (trong giới hạn FR-010).
- **FR-019a**: Website MUST xét lại mục tiêu dựa trên 7 ngày gần nhất: đạt ≥ 6/7 ngày và nhớ tốt
  thì gợi ý tăng; đạt ≤ 3/7 ngày thì gợi ý giảm. Mỗi lần gợi ý thay đổi khoảng 2–3 từ, và không
  gợi ý lại trong 7 ngày sau đó.
- **FR-019b**: Mục tiêu MUST chỉ thay đổi khi người học đồng ý, và MUST luôn nằm trong khoảng
  3–20 từ mới/ngày. Người học MUST tự chỉnh được trong khoảng này bất cứ lúc nào.
- **FR-019c**: Khi số từ mới còn lại ít hơn mục tiêu, mục tiêu từ mới của ngày MUST tự giảm bằng số từ
  còn lại; khi đã học hết từ mới, ôn hết thẻ đến hạn (theo giới hạn FR-010) MUST được tính là đạt mục
  tiêu, để chuỗi ngày học không bị đứt oan.
- **FR-020**: Website MUST hiện tiến độ mục tiêu hôm nay, chuỗi ngày học liên tiếp và lịch các ngày đã học.
- **FR-021**: Người dùng MUST đặt được lịch nhắc theo giờ và các ngày trong tuần, bật/tắt bất cứ lúc nào.
- **FR-022**: Website MUST NOT gửi nhắc nhở khi người dùng đã đạt mục tiêu ngày hôm đó.
- **FR-022a**: Nhắc nhở MUST gửi bằng thông báo đẩy trên thiết bị, không cần tài khoản, email hay Zalo.
  Website MUST cài được lên màn hình chính điện thoại như một app và MUST hướng dẫn cách cài.

**Giới thiệu và chức năng thú vị**

- **FR-023**: Trang chủ MUST là trang giới thiệu tiếng Trung cho người mới, có phần nghe thử 4 thanh
  điệu và giải thích bộ thủ bằng hình minh hoạ động (các hiệu ứng của trang chủ quy định ở FR-023d).
- **FR-023a**: Cuối trang chủ MUST có phần chọn level gồm: Mới bắt đầu, HSK 1, HSK 2, HSK 3, HSK 4–6
  ("sắp có") và "Kiểm tra trình độ"; mỗi level có mô tả ngắn về những gì người học ở level đó đã biết.
- **FR-023b**: Chọn một level MUST đưa người dùng tới Trang level của level đó; level đã chọn MUST được
  ghi nhớ và đổi được bất cứ lúc nào.
- **FR-023c**: Khi người dùng đã có tiến độ, trang chủ MUST hiện nút "Học tiếp" ở đầu trang.
- **FR-023d**: Toàn website MUST theo phong cách Trung Hoa hiện đại: nền giấy xuyến chỉ, màu mực tàu,
  đỏ son và vàng kim làm màu nhấn, bố cục hiện đại và thoáng. Trang chủ MUST có ít nhất các hiệu ứng:
  chữ Hán tự viết từng nét bằng nét mực ở phần đầu trang (mặt chữ chuẩn để người học thấy đúng thứ tự
  nét; chữ kiểu bút lông thư pháp chỉ dùng cho phần trang trí đứng yên), mực loang khi cuộn tới từng phần, và con dấu đỏ
  đóng xuống khi người dùng chọn level hoặc hoàn thành bài.
- **FR-024**: Website MUST có mục "Luyện tập" gồm 5 trò, mỗi trò một mục riêng: Ghép cặp, Nghe chọn từ,
  Luyện viết, Sắp xếp câu, Đua thời gian. Mỗi trò dùng từ đã học, có điểm và danh sách từ sai để ôn lại.
- **FR-024a**: Người dùng MUST chọn được phạm vi từ cho mỗi lượt chơi (một bài, một cấp HSK, hoặc các từ
  đang cần ôn).
- **FR-024b**: Kết quả trò chơi MUST cập nhật vào lịch ôn tập: từ trả lời sai được ôn sớm hơn.
- **FR-024c**: Đáp án sai MUST được chọn ưu tiên từ các từ dễ nhầm với đáp án đúng: cùng âm khác thanh,
  mặt chữ gần giống, hoặc cùng chủ đề; chỉ dùng từ ngẫu nhiên khi không đủ từ dễ nhầm.
- **FR-024d**: Mỗi lượt chơi MUST trộn kiểu hỏi (chữ → nghĩa, nghĩa → chữ, nghe → chữ) và MUST NOT dùng
  lại đúng bộ câu hỏi của lượt liền trước cùng trò.
- **FR-024e**: Độ khó MUST tăng sau mỗi 5 câu đúng liên tiếp và giảm một bậc sau 2 câu sai liên tiếp.
- **FR-024f**: Mỗi lượt chơi MUST có 1–2 sự kiện bất ngờ ngẫu nhiên chọn từ: nhân đôi điểm, câu thưởng,
  đảo chiều hỏi, từ bí ẩn (chữ hiện dần từng phần).
- **FR-024g**: Website MUST tạo Thử thách tuần mỗi thứ Hai từ các từ người chơi sai nhiều nhất trong
  7 ngày qua; nếu chưa đủ từ sai thì dùng các từ mới học gần đây.
- **FR-025**: Website MUST trao huy hiệu khi người dùng đạt các mốc (số từ đã học, streak, hoàn thành cấp).

**Chung**

- **FR-026**: Toàn bộ giao diện và thông báo MUST bằng tiếng Việt. Trên giao diện dùng "chuỗi ngày học"
  (từ "streak" trong tài liệu này chỉ là tên gọi nội bộ); từ "level" được giữ vì người dùng quen gọi.
- **FR-027**: Người dùng MUST xuất được tiến độ học ra file và nhập lại trên thiết bị khác.
- **FR-028**: Bài đang học MUST tiếp tục được khi mất mạng.
- **FR-029**: Người dùng MUST có thể đặt lại toàn bộ tiến độ, có bước xác nhận trước khi xoá.

### Key Entities *(include if feature involves data)*

- **Từ vựng (Word)**: chữ Hán, pinyin, nghĩa tiếng Việt, loại từ, cấp HSK, chủ đề, phát âm,
  danh sách câu ví dụ, mẹo nhớ, loại từ cụ thể/trừu tượng.
- **Mẹo nhớ (Mnemonic)**: các thành phần/bộ thủ của chữ và nghĩa từng phần, câu chuyện liên tưởng
  tiếng Việt, hình minh hoạ (với từ cụ thể) hoặc hình tách bộ thủ (với từ trừu tượng); thuộc về một từ.
- **Câu ví dụ (Example Sentence)**: câu chữ Hán, pinyin, nghĩa tiếng Việt, phát âm; thuộc về một từ.
- **Bài học (Lesson)**: tên, chủ đề, cấp, danh sách khoảng 10 từ, thứ tự trong lộ trình.
- **Chặng lộ trình (Roadmap Stage)**: Pinyin hoặc một cấp HSK; gồm nhiều bài học.
- **Tiến độ thẻ (Card Progress)**: trạng thái học của người dùng với một từ: mức nhớ, số lần ôn,
  ngày ôn kế tiếp.
- **Mục tiêu hằng ngày (Daily Goal)**: số từ mới/ngày (3–20), tiến độ hôm nay (từ mới và thẻ ôn),
  lịch sử đạt/không đạt 7 ngày gần nhất, ngày gợi ý thay đổi gần nhất.
- **Chuỗi ngày học (Streak)**: số ngày liên tiếp, ngày học gần nhất, lịch các ngày đã học.
- **Lịch nhắc (Reminder)**: giờ, các ngày trong tuần, bật/tắt, kênh nhắc.
- **Huy hiệu (Badge)**: tên, điều kiện đạt, ngày đạt.
- **Lượt chơi (Game Session)**: loại trò, phạm vi từ, điểm, các từ trả lời sai, thời điểm chơi;
  điểm cao nhất được lưu theo từng trò.
- **Thử thách tuần (Weekly Challenge)**: tuần áp dụng, danh sách từ (lấy từ các từ hay sai), trạng thái
  hoàn thành, huy hiệu tuần.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng mới bắt đầu thẻ học đầu tiên trong vòng 30 giây kể từ khi mở website.
- **SC-002**: 90% người thử nghiệm lần đầu hoàn thành bài học đầu tiên mà không cần hỏi ai.
- **SC-003**: Mọi màn hình dùng được đầy đủ trên điện thoại, tablet và máy tính, không phải
  phóng to hay cuộn ngang.
- **SC-004**: Phát âm bắt đầu trong vòng 1 giây sau khi bấm nút loa.
- **SC-005**: Kết quả tìm kiếm từ vựng hiện ngay khi gõ, dưới 1 giây.
- **SC-006**: Sau 7 ngày dùng đều, người học nhớ đúng ít nhất 80% số từ đã học khi làm bài kiểm tra.
- **SC-007**: Ít nhất 40% người dùng mới quay lại học vào ngày hôm sau.
- **SC-008**: 100% từ vựng và câu ví dụ có đủ chữ Hán, pinyin có dấu và nghĩa tiếng Việt, không có lỗi
  thanh điệu khi đối chiếu với nguồn chuẩn HSK; 100% phát được âm trên thiết bị có giọng đọc tiếng Trung,
  và thiết bị không có giọng đọc thì hiện hướng dẫn cài bằng tiếng Việt.
- **SC-009**: Người dùng đánh giá giao diện "đẹp, bắt mắt" ở mức ≥ 4/5 trong khảo sát thử nghiệm, và
  ít nhất 70% người thử nhận ra phong cách "Trung Hoa" khi được hỏi trang gợi cho họ cảm giác gì.
- **SC-010**: 100% từ có mẹo nhớ; 100% từ cụ thể có hình minh hoạ và 100% từ trừu tượng có hình tách bộ thủ.
- **SC-011**: Trang chủ hiện nội dung đầu trang trong vòng 2 giây trên điện thoại tầm trung, và hiệu ứng
  khi cuộn chạy mượt, không giật.

## Assumptions

- Người dùng chính là người Việt chưa biết hoặc mới biết chút tiếng Trung, học chủ yếu trên điện thoại.
- Thuật ngữ: **Trang chủ** = trang giới thiệu `/`; **Trang Hôm nay** = `/hoc` (mục tiêu, chuỗi ngày, thẻ
  cần ôn); **Trang level** = `/lo-trinh/<cấp>` (danh sách bài của một cấp).
- Dùng chữ giản thể và danh sách từ theo chuẩn HSK; nghĩa tiếng Việt do dự án biên soạn và kiểm tra.
- Bản đầu không có tài khoản và không có máy chủ: tiến độ lưu trên thiết bị, chuyển máy bằng xuất/nhập
  file (theo nguyên tắc VI của constitution).
- Phát âm dùng giọng đọc tiếng Trung có sẵn trên thiết bị, hoặc file âm thanh cho các từ cần chuẩn hơn.
- Thứ tự nét chữ lấy từ nguồn dữ liệu nét chữ Hán mở, được phép dùng.
- Không thu phí; không có quảng cáo trong bản đầu.
- Bản đầu dùng danh sách HSK 1–3 theo chuẩn HSK 2.0 (khoảng 600 từ); HSK 4–6 thêm ở các bản sau.
- Thông báo nhắc trên iPhone chỉ hoạt động khi website đã được thêm vào màn hình chính.
- Không có tính năng xã hội (bạn bè, bảng xếp hạng chung) và không có luyện nói chấm điểm phát âm
  trong bản đầu.
