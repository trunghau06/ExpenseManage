import './StatMetrics.css';

export default function StatMetrics({ data = null }) {
  const hasData = Boolean(data);

  const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

  const formatGrowth = (value) => {
    if (value === null) {
      return `Mới phát sinh ${data?.comparisonLabel || ''}`;
    }

    const growth = Number(value || 0);
    return `${growth > 0 ? '+' : ''}${growth}% ${data?.comparisonLabel || ''}`;
  };

  const savingRateText = data?.canCalculateSavingRate
    ? `${data.savingRate}%`
    : '--';

  return (
    <div className="stat-metrics">
      <div className="stat-metric-card">
        <div className="stat-metric-card__icon">
          <i className="fa-solid fa-arrow-trend-up"></i>
        </div>

        <div className="stat-metric-card__content">
          <span className="stat-metric-card__title">THU NHẬP TRUNG BÌNH</span>
          <span className="stat-metric-card__value">
            {hasData ? formatMoney(data.avgIncome) : '--'}
          </span>
          <span className="stat-metric-card__status">
            {hasData ? formatGrowth(data.incomeGrowth) : 'Chưa có dữ liệu'}
          </span>
        </div>
      </div>

      <div className="stat-metric-card">
        <div className="stat-metric-card__icon">
          <i className="fa-solid fa-arrow-trend-down"></i>
        </div>

        <div className="stat-metric-card__content">
          <span className="stat-metric-card__title">CHI TIÊU TRUNG BÌNH</span>
          <span className="stat-metric-card__value">
            {hasData ? formatMoney(data.avgExpense) : '--'}
          </span>
          <span className="stat-metric-card__status">
            {hasData ? formatGrowth(data.expenseGrowth) : 'Chưa có dữ liệu'}
          </span>
        </div>
      </div>

      <div className="stat-metric-card">
        <div className="stat-metric-card__icon">
          <i className="fa-solid fa-piggy-bank"></i>
        </div>

        <div className="stat-metric-card__content">
          <span className="stat-metric-card__title">TỶ LỆ TIẾT KIỆM</span>
          <span className="stat-metric-card__value">
            {hasData ? savingRateText : '--'}
          </span>
          <span className="stat-metric-card__status">
            {hasData ? data.periodLabel : 'Chưa có dữ liệu'}
          </span>
        </div>
      </div>
    </div>
  );
}
