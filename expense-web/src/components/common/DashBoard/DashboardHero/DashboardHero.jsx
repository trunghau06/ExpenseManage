import { useNavigate } from 'react-router-dom';
import './DashboardHero.css';

export default function DashboardHero({ user, activeTab, onTabChange }) {
  const navigate = useNavigate();
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const previousDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = previousDate.getMonth() + 1;
  const previousYear = previousDate.getFullYear();
  const selectedMonth = activeTab === 0 ? currentMonth : previousMonth;

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const updateTime = `Cập nhật lúc ${hours}:${minutes} hôm nay`;

  return (
    <div className="dashboard-body__hero">
      <div className="dashboard-body__hero--info">
        <div className="hero-tag">
          <div className="hero-tag__badge">BÁO CÁO THÁNG</div>
          <div className="hero-tag__time">{updateTime}</div>
        </div>

        <div className="hero-title">Xin chào, {user || 'User'}</div>
        <p className="hero-subtitle">Tổng quan thu chi tháng {selectedMonth} của bạn</p>
      </div>

      <div className="dashboard-body__hero--timelines">
        <div className="hero-timelines-group">
          <button
            type="button"
            className={`hero-timelines-action ${activeTab === 0 ? 'hero-timelines-action--active' : ''}`}
            onClick={() => onTabChange(0)}
          >
            Tháng {currentMonth}/{currentYear}
          </button>

          <button
            type="button"
            className={`hero-timelines-action ${activeTab === 1 ? 'hero-timelines-action--active' : ''}`}
            onClick={() => onTabChange(1)}
          >
            Tháng {previousMonth}/{previousYear}
          </button>
        </div>

        <button type="button" className="hero-btn-primary" onClick={() => navigate('/transactions')}>
          <span>Xem Tất Cả</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
