export default function TopExpenseItem({
  rank,
  icon,
  iconBg,
  iconColor,
  title,
  amount,
  percent,
  barColor,
}) {
  return (
    <div className="top-expense-item">
      <div className="top-expense-item__header">
        <div className="top-expense-item__left">
          <span className="top-expense-item__rank">{rank}</span>
          <div
            className="top-expense-item__icon"
            style={{ backgroundColor: iconBg, color: iconColor }}
          >
            <i className={icon}></i>
          </div>
          <span className="top-expense-item__title">{title}</span>
        </div>

        <div className="top-expense-item__right">
          <span className="top-expense-item__amount">{amount}</span>
          <span className="top-expense-item__percent">({percent}%)</span>
        </div>
      </div>

      <div className="top-expense-item__track">
        <div
          className="top-expense-item__bar"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        ></div>
      </div>
    </div>
  );
}