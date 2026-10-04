import TopExpenseItem from './TopExpenseItem';
import './TopExpensesCard.css';

export default function TopExpensesCard({ data = null }) {
  const hasData = Boolean(data?.items?.length);

  return (
    <div className="top-expenses-card">
      <div className="top-expenses-card__heading">
        <div className="top-expenses-card__heading--title">
          <div className="top-expenses-card__heading--title-row">
            <h3>Top 5 danh mục chi tiêu nhiều nhất</h3>
            {hasData && <span className="top-expenses-badge">{data.period}</span>}
          </div>
          <p>Thống kê tỷ trọng các nhóm chi tiêu lớn nhất</p>
        </div>
      </div>

      {hasData ? (
        <>
          <div className="top-expenses-list">
            {data.items.map((item) => (
              <TopExpenseItem key={item.id} {...item} />
            ))}
          </div>

          <div className="top-expenses-card__footer">
            <p>
              Top 5 chiếm <strong>{data.topSharePercent}%</strong> tổng chi tiêu.
              Phần còn lại: <strong>{data.otherAmount}</strong>
            </p>
          </div>
        </>
      ) : (
        <div className="top-expenses-empty">
          <div className="top-expenses-empty__icon">
            <i className="fa-solid fa-ranking-star"></i>
          </div>
          <p className="top-expenses-empty__text">Chưa có dữ liệu danh mục chi tiêu</p>
          <span className="top-expenses-empty__sub">Chưa có dữ liệu</span>
        </div>
      )}
    </div>
  );
}
