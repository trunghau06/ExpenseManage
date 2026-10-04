# FinFlow - bản hoàn chỉnh 4 phần chính

Bản này giữ cấu trúc project cũ và làm lại các phần đã học theo hướng dễ đọc, ít logic vòng vèo và ít comment.

## Đã hoàn thiện

- Dashboard: tổng thu, tổng chi, số dư tháng đang xem, số dư tích lũy, giao dịch gần đây, cơ cấu chi tiêu, ngân sách và mục tiêu tiết kiệm.
- Sổ giao dịch: thêm/xóa giao dịch, lọc theo tất cả các tháng có dữ liệu, danh mục, phương thức và loại giao dịch, xuất CSV.
- Thống kê & Báo cáo: 3 tháng / 6 tháng / Năm nay dùng cùng một kỳ cho metrics, biểu đồ, top chi tiêu và đánh giá tỷ lệ tiết kiệm.
- Số dư: xem số dư toàn bộ, nhập số dư thực tế và lưu lịch sử điều chỉnh khi có chênh lệch.
- Animation: các khối chạy nhẹ từ dưới lên khi vào trang hoặc cuộn tới nội dung.
- Màu sắc: tập trung xanh - trắng - xám; chỉ giữ xanh lá/đỏ ở các giá trị thu/chi cần phân biệt.
- Font: dùng Segoe UI / Arial, không phụ thuộc font tải ngoài.

`Settings` được giữ nguyên phần chức năng, chưa làm lại theo yêu cầu.

## File giao diện chung

- `expense-web/src/styles/colors.css`: màu dùng chung.
- `expense-web/src/styles/fonts.css`: font và cỡ chữ dùng chung.
- `expense-web/src/index.css`: reset cơ bản và animation dùng chung.

## Chạy backend

Tạo `server/.env` từ `server/.env.example` hoặc copy `.env` của project cũ.

```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Bản này chỉ cần `DATABASE_URL`, không cần `DIRECT_URL`.

## Chạy web

```bash
cd expense-web
npm install
npm run dev
```

Nếu token cũ báo 403, xóa `token` và `user` trong Local Storage rồi đăng nhập lại.

## Cách tính số dư

```text
Số dư từ giao dịch = Tổng thu toàn bộ - Tổng chi toàn bộ
Số dư tích lũy = Số dư từ giao dịch + Tổng điều chỉnh
Tiến độ mục tiêu = Số dư tích lũy / Số tiền mục tiêu
```

Mục tiêu tiết kiệm không reset khi sang tháng mới. Dashboard vẫn có thể đổi tháng để xem riêng số dư của tháng đó, còn tiến độ mục tiêu dùng số dư tích lũy toàn bộ.
