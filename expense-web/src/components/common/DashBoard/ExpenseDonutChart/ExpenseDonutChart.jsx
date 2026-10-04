import './ExpenseDonutChart.css';

const COLORS = ['#2457c5', '#4674d4', '#6b8fdc', '#8aa7e5', '#b2c5ec'];

export default function ExpenseDonutChart({ categories = [] }) {
  const topCategory = categories[0];
  let currentPercent = 0;

  // Tạo các phần màu của biểu đồ từ phần trăm từng danh mục.
  const gradientParts = categories.map((item, index) => {
    const start = currentPercent;
    const end = currentPercent + item.percent;
    currentPercent = end;
    return `${COLORS[index % COLORS.length]} ${start}% ${end}%`;
  });

  const background = gradientParts.length > 0
    ? `conic-gradient(${gradientParts.join(', ')})`
    : 'var(--border)';

  return (
    <div className="donut-chart">
      <div className="donut-chart__circle" style={{ background }}>
        <div className="donut-chart__center">
          <span className="donut-chart__label">LỚN NHẤT</span>
          <span className="donut-chart__percentage">{topCategory?.percent || 0}%</span>
          <span className="donut-chart__category">{topCategory?.name || 'Chưa có'}</span>
        </div>
      </div>
    </div>
  );
}
