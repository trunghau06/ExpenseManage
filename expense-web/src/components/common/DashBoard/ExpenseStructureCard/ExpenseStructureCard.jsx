import ExpenseDonutChart from '../ExpenseDonutChart/ExpenseDonutChart';
import ExpenseLegend from '../ExpenseLegend/ExpenseLegend';
import './ExpenseStructureCard.css';

export default function ExpenseStructureCard({ data = null }) {
  const hasData = Boolean(data && data.categories?.length > 0);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__heading">
        <div className="dashboard-card__heading--title">
          <h3>Cơ cấu chi tiêu</h3>
          <p>Phân bố các danh mục chính trong tháng</p>
        </div>

        {hasData && (
          <span className="dashboard-card__heading--total">
            {data.totalExpense.toLocaleString('vi-VN')} đ
          </span>
        )}
      </div>

      {hasData ? (
        <div className="dashboard-card__breakdown">
          <div className="dashboard-card__chart-wrapper">
            <ExpenseDonutChart categories={data.categories} />
          </div>

          <div className="dashboard-card__legend-wrapper">
            <ExpenseLegend categories={data.categories} />
          </div>
        </div>
      ) : (
        <div className="dashboard-card__empty">
          <div className="dashboard-card__empty-icon">
            <i className="fa-solid fa-chart-pie"></i>
          </div>
          <p className="dashboard-card__empty-text">Chưa có dữ liệu chi tiêu</p>
          <span className="dashboard-card__empty-sub">Chưa có dữ liệu</span>
        </div>
      )}
    </div>
  );
}
