import StatCard from '../../../ui/StatCard/StatCard';
import './DashboardMetrics.css';

export default function DashboardMetrics({ data = null }) {
  const hasData = Boolean(data);

  const formatGrowth = (value) => {
    if (value === null) return 'Mới phát sinh so với tháng trước';

    const growth = Number(value || 0);
    return `${growth > 0 ? '+' : ''}${growth}% so với tháng trước`;
  };

  const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN');

  return (
    <div className="dashboard-metrics">
      <StatCard>
        <div className="stat-card__header">
          <span className="stat-card__label">TỔNG THU NHẬP</span>
          <div className="stat-card__icon stat-card__icon--income">
            <i className="fa-solid fa-arrow-trend-up"></i>
          </div>
        </div>

        <div className="stat-card__amount amount-income">
          {hasData ? (
            <>
              + {formatMoney(data.totalIncome)} <span className="stat-card__currency">đ</span>
            </>
          ) : (
            <span className="stat-card__empty-text">Chưa có dữ liệu</span>
          )}
        </div>

        <div className="stat-card__footer">
          {hasData ? (
            <div className="stat-card__pill stat-card__pill--income">
              <i className="fa-solid fa-arrow-trend-up"></i>
              <span>{formatGrowth(data.incomeGrowth)}</span>
            </div>
          ) : (
            <span className="stat-card__empty-sub">Chưa có dữ liệu</span>
          )}
        </div>
      </StatCard>

      <StatCard>
        <div className="stat-card__header">
          <span className="stat-card__label">TỔNG CHI TIÊU</span>
          <div className="stat-card__icon stat-card__icon--expense">
            <i className="fa-solid fa-arrow-trend-down"></i>
          </div>
        </div>

        <div className="stat-card__amount amount-expense">
          {hasData ? (
            <>
              - {formatMoney(data.totalExpense)} <span className="stat-card__currency">đ</span>
            </>
          ) : (
            <span className="stat-card__empty-text">Chưa có dữ liệu</span>
          )}
        </div>

        <div className="stat-card__footer">
          {hasData ? (
            <>
              <div className="stat-card__pill stat-card__pill--expense">
                <i className="fa-solid fa-arrow-trend-down"></i>
                <span>{formatGrowth(data.expenseGrowth)}</span>
              </div>
              <span className="stat-card__note">
                Hạn mức: {formatMoney(data.budgetLimit)} đ
              </span>
            </>
          ) : (
            <span className="stat-card__empty-sub">Chưa có dữ liệu</span>
          )}
        </div>
      </StatCard>

      <StatCard className="stat-card--primary">
        <div className="stat-card__header">
          <span className="stat-card__label">SỐ DƯ RÒNG</span>
          <div className="stat-card__icon stat-card__icon--primary">
            <i className="fa-solid fa-wallet"></i>
          </div>
        </div>

        <div className="stat-card__amount">
          {hasData ? (
            <>
              {formatMoney(data.balance)} <span className="stat-card__currency">đ</span>
            </>
          ) : (
            <span className="stat-card__empty-text">Chưa có dữ liệu</span>
          )}
        </div>

        <div className="stat-card__footer">
          {hasData ? (
            <>
              <div className="stat-card__pill stat-card__pill--primary">
                <i className="fa-solid fa-calendar-days"></i>
                <span>Số dư tháng đang xem</span>
              </div>
              <span className="stat-card__note">
                Tích lũy toàn bộ: {formatMoney(data.allTimeBalance)} đ
              </span>
            </>
          ) : (
            <span className="stat-card__empty-sub">Cần thêm giao dịch để thống kê</span>
          )}
        </div>
      </StatCard>
    </div>
  );
}
