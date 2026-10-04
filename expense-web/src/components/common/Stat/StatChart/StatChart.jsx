import './StatChart.css';

export default function StatChart({ data = [] }) {
  const hasData = data.some((item) => item.income > 0 || item.expense > 0);
  const maxValue = Math.max(0, ...data.flatMap((item) => [item.income, item.expense]));

  let step = 1000;

  if (maxValue >= 1000000) {
    step = Math.ceil(maxValue / 4 / 100000) * 100000;
  } else if (maxValue >= 100000) {
    step = Math.ceil(maxValue / 4 / 10000) * 10000;
  } else if (maxValue > 0) {
    step = Math.ceil(maxValue / 4 / 1000) * 1000;
  }

  const chartMax = step * 4;
  const axisValues = [chartMax, step * 3, step * 2, step, 0];

  const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

  const formatAxisMoney = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toLocaleString('vi-VN', {
        maximumFractionDigits: 1,
      })} tr`;
    }

    if (value >= 1000) return `${Math.round(value / 1000)}k`;
    return value;
  };

  return (
    <div className="stat-body__chart">
      <div className="stat-body__chart--heading">
        <div className="chart-heading__title">
          <div className="chart-heading__title-row">
            <h3>Dòng tiền theo tháng</h3>
          </div>
          <p>So sánh tổng thu nhập và chi tiêu theo từng tháng</p>
        </div>

        <div className="chart-heading__badge">
          <div className="chart-heading__badge-item">
            <span className="chart-legend-dot chart-legend-dot--income"></span>
            <p>Thu nhập</p>
          </div>
          <div className="chart-heading__badge-item">
            <span className="chart-legend-dot chart-legend-dot--expense"></span>
            <p>Chi tiêu</p>
          </div>
        </div>
      </div>

      {hasData ? (
        <div className="chart-canvas-container">
          <div className="chart-grid-lines">
            {axisValues.map((value) => (
              <div className="chart-grid-row" key={value}>
                <span className="chart-grid-label">{formatAxisMoney(value)}</span>
                <div className="chart-grid-line"></div>
              </div>
            ))}
          </div>

          <div className="chart-bars-group">
            {data.map((item) => {
              const incomeHeight = chartMax > 0 ? (item.income / chartMax) * 100 : 0;
              const expenseHeight = chartMax > 0 ? (item.expense / chartMax) * 100 : 0;

              return (
                <div className="chart-column-item" key={`${item.year}-${item.monthNumber}`}>
                  <div className="chart-bars-wrapper">
                    <div
                      className="chart-bar chart-bar--income"
                      title={`Thu nhập: ${formatMoney(item.income)}`}
                      style={{
                        height: `${item.income > 0 ? Math.max(incomeHeight, 3) : 0}%`,
                      }}
                    ></div>
                    <div
                      className="chart-bar chart-bar--expense"
                      title={`Chi tiêu: ${formatMoney(item.expense)}`}
                      style={{
                        height: `${item.expense > 0 ? Math.max(expenseHeight, 3) : 0}%`,
                      }}
                    ></div>
                  </div>

                  <div className={`chart-month-label ${item.isCurrent ? 'chart-month-label--active' : ''}`}>
                    <span>{item.month}</span>
                    {item.isCurrent && <span className="chart-current-dot"></span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="chart-empty">
          <div className="chart-empty__icon">
            <i className="fa-solid fa-chart-simple"></i>
          </div>
          <p className="chart-empty__text">Chưa có dữ liệu biểu đồ</p>
          <span className="chart-empty__sub">Hãy thêm giao dịch để xem xu hướng</span>
        </div>
      )}
    </div>
  );
}
