import { useNavigate } from 'react-router-dom';
import TransactionItem from '../TransactionItem/TransactionItem';
import './RecentTransactionsCard.css';

export default function RecentTransactionsCard({ data = [] }) {
  const navigate = useNavigate();
  const hasData = Boolean(data && data.length > 0);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__heading">
        <div className="dashboard-card__heading--title">
          <h3>Giao dịch gần đây</h3>
          <p>Danh sách giao dịch mới nhất</p>
        </div>
        <button 
          type="button" 
          className="dashboard-card__heading--viewAll"
          onClick={() => navigate('/transactions')}
        >
          <span>Xem tất cả</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      {hasData 
        ? (
          <div className="transaction-list">
            {data.map(( item ) => (
              <TransactionItem 
                key={item.id}
                title={item.title}
                category={item.category}
                date={item.date}
                amount={item.amount}
                paymentMethod={item.paymentMethod}
                type={item.type}
                icon={item.icon}
                iconColor={item.iconColor}
                iconBg={item.iconBg}
              />
            ))}
          </div>
        ) : (
          <div className="recent-transactions__empty">
            <div className="recent-transactions__empty-icon">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <p className="recent-transactions__empty-text">Chưa có danh sách giao dịch</p>
            <span className="recent-transactions__empty-sub">Chưa có dữ liệu</span>
          </div>
        )}
    </div>
  );
}
