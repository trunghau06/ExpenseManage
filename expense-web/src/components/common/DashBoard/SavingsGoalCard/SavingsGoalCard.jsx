import './SavingsGoalCard.css';

export default function SavingsGoalCard({
  data = null,
  accumulatedBalance = 0,
  onOpenModal,
}) {
  const targetAmount = Number(data?.target_amount || 0);
  const currentAmount = Math.max(Number(accumulatedBalance || 0), 0);
  const hasData = Boolean(data && targetAmount > 0);
  const progress = targetAmount > 0
    ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100)
    : 0;

  return (
    <div className="dashboard-card saving-goal-card">
      <div className="saving-goal__header">
        <div className="saving-goal__title">
          <i className="fa-regular fa-flag"></i>
          <h3>{hasData ? data.title : 'Mục tiêu tiết kiệm'}</h3>
        </div>

        {hasData ? (
          <div className="saving-goal__header-actions">
            <span className="saving-goal__percent">{progress}%</span>
            <button type="button" className="saving-goal__edit-btn" onClick={onOpenModal}>
              <i className="fa-solid fa-pen"></i>
            </button>
          </div>
        ) : (
          <button type="button" className="saving-goal__header-btn" onClick={onOpenModal}>
            <i className="fa-solid fa-plus"></i>
            <span>Thiết lập</span>
          </button>
        )}
      </div>

      {hasData ? (
        <>
          <div className="saving-goal__progress-bar">
            <div className="saving-goal__progress-fill" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="saving-goal__footer">
            <span className="saving-goal__present">
              Đã tích lũy: {currentAmount.toLocaleString('vi-VN')} đ
            </span>
            <span className="saving-goal__future">
              Mục tiêu: {targetAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </>
      ) : (
        <div className="saving-goal__empty">
          <div className="saving-goal__empty-icon">
            <i className="fa-solid fa-bullseye"></i>
          </div>
          <p className="saving-goal__empty-text">Chưa có mục tiêu tiết kiệm</p>
          <span className="saving-goal__empty-sub">Chưa có dữ liệu</span>
          <button type="button" className="saving-goal__empty-btn" onClick={onOpenModal}>
            <i className="fa-solid fa-plus"></i>
            Tạo mục tiêu ngay
          </button>
        </div>
      )}
    </div>
  );
}
