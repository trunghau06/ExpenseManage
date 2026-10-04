import ProgressItem from '../ProgressItem/ProgressItem';
import './BudgetProgressCard.css';

export default function BudgetProgressCard({ budgets = [], onOpenModal }) {
  const hasData = budgets.length > 0;

  return (
    <div className="dashboard-card budget-card">
      <div className="budget-card__header">
        <div>
          <h3 className="budget-card__title">Tiến độ ngân sách</h3>
          <p className="budget-card__sub">Giám sát các hạn mức chi tiêu trọng điểm</p>
        </div>

        <button type="button" className="budget-card__action-btn" onClick={onOpenModal}>
          <span>Điều chỉnh hạn mức</span>
          <i className="fa-solid fa-sliders"></i>
        </button>
      </div>

      {hasData ? (
        <div className="budget-card__list">
          {budgets.map((budget) => (
            <ProgressItem
              key={budget.id}
              icon={`fa-solid fa-${budget.icon || 'tag'}`}
              iconColor={budget.color || '#2563eb'}
              title={budget.name}
              badgeText={budget.percent >= 100 ? 'VƯỢT HẠN MỨC' : budget.percent >= 80 ? 'SẮP HẾT' : 'AN TOÀN'}
              badgeType={budget.percent >= 80 ? 'warning' : 'safe'}
              spent={`${budget.spent.toLocaleString('vi-VN')} đ`}
              total={`${budget.limit.toLocaleString('vi-VN')} đ`}
              percent={budget.percent}
              remaining={`${Math.max(budget.limit - budget.spent, 0).toLocaleString('vi-VN')} đ`}
              barColor={budget.color || '#2563eb'}
            />
          ))}
        </div>
      ) : (
        <div className="budget-card__empty">
          <div className="budget-card__empty-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <p className="budget-card__empty-text">Chưa có dữ liệu ngân sách</p>
          <span className="budget-card__empty-sub">Bạn có thể thiết lập hạn mức cho từng danh mục chi tiêu</span>
          <button type="button" className="budget-card__empty-btn" onClick={onOpenModal}>
            <i className="fa-solid fa-plus"></i>
            <span>Thiết lập ngay</span>
          </button>
        </div>
      )}
    </div>
  );
}
