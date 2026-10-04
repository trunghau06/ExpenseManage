import './TransactionItem.css';

export default function TransactionItem({
  title,
  category,
  date,
  amount,
  paymentMethod,
  type = 'expense',
  icon,
  iconColor,
  iconBg,
  onClick,
}) {
  return (
    <div className="transaction-item" onClick={onClick}>
      <div
        className="transaction-item__icon"
        style={{
          backgroundColor: iconBg,
          color: iconColor,
        }}
      >
        <i className={icon}></i>
      </div>

      <div className="transaction-item__info">
        <h4 className="transaction-item__title">{title}</h4>
        <div className="transaction-item__sub">
          <span>{category}</span>
          <span className="transaction-item__dot">•</span>
          <span>{date}</span>
        </div>
      </div>

      <div className="transaction-item__details">
        <span
          className={`transaction-item__amount ${
            type === 'income'
              ? 'transaction-item__amount--income'
              : 'transaction-item__amount--expense'
          }`}
        >
          {amount}
        </span>
        <span className="transaction-item__payment">{paymentMethod}</span>
      </div>
    </div>
  );
}