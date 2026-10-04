import './ExpenseLegend.css';

const COLORS = ['#2457c5', '#4674d4', '#6b8fdc', '#8aa7e5', '#b2c5ec'];

export default function ExpenseLegend({ categories = [] }) {
  return (
    <div className="expense-legend">
      <div className="expense-legend__header">
        <span className="col-category">Danh mục</span>
        <span className="col-percent">Tỉ lệ</span>
        <span className="col-amount">Số tiền</span>
      </div>

      <div className="expense-legend__list">
        {categories.map((item, index) => (
          <div className="expense-legend__row" key={item.name}>
            <div className="category-info">
              <span
                className="category-dot"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span className="category-name">{item.name}</span>
            </div>

            <span className="percent-value">{item.percent}%</span>
            <span className="amount-value">{item.amount.toLocaleString('vi-VN')} đ</span>
          </div>
        ))}
      </div>
    </div>
  );
}
