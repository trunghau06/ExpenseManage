import './StatHero.css';

export default function StatHero({ period, onPeriodChange }) {
  return (
    <div className="stat-body__hero">
      <div className="stat-body__hero--info">
        <h1>Thống kê & Báo cáo</h1>
        <p>Xem thu, chi và tỷ lệ tiết kiệm theo khoảng thời gian</p>
      </div>

      <div className="stat-body__hero--timelines">
        <button
          type="button"
          className={`stat-timeline-btn ${period === '3' ? 'stat-timeline-btn--active' : ''}`}
          onClick={() => onPeriodChange('3')}
        >
          3 tháng
        </button>

        <button
          type="button"
          className={`stat-timeline-btn ${period === '6' ? 'stat-timeline-btn--active' : ''}`}
          onClick={() => onPeriodChange('6')}
        >
          6 tháng
        </button>

        <button
          type="button"
          className={`stat-timeline-btn ${period === 'year' ? 'stat-timeline-btn--active' : ''}`}
          onClick={() => onPeriodChange('year')}
        >
          Năm nay
        </button>
      </div>
    </div>
  );
}
