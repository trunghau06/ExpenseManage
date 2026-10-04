# Cách đọc code FinFlow

Luồng chính của các page được giữ đơn giản:

```text
Page gọi API
→ lưu dữ liệu vào state
→ xử lý phần cần hiển thị
→ truyền props xuống component
→ component render UI
```

Các page chính:

- `Dashboard.jsx`: dữ liệu tổng quan.
- `Transactions.jsx`: danh sách và bộ lọc giao dịch.
- `Stats.jsx`: dữ liệu thống kê theo kỳ.
- `Balance.jsx`: đối soát số dư.

Comment chỉ đặt ở các đoạn chức năng chính. Component con chủ yếu nhận props và hiển thị, tránh nhét thêm logic không cần thiết.
