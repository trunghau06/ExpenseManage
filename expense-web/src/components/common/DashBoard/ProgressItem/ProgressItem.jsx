import './ProgressItem.css';

export default function ProgressItem({
  icon,
  iconColor,
  title,
  badgeText,
  badgeType = 'safe',
  spent,
  total,
  percent,
  remaining,
  barColor,
}) {
  return (
    <div className="budget-item">
      <div className="budget-item__top">
        <div className="budget-item__title-group">
          <i className={icon} style={{ color: iconColor }}></i>
          <h4 className="budget-item__title">{title}</h4>
          <span className={`budget-item__badge budget-item__badge--${badgeType}`}>
            {badgeText}
          </span>
        </div>

        <div className="budget-item__amount">
          <strong>{spent}</strong> / {total}
        </div>
      </div>

      <div className="budget-item__bar-wrapper">
        <div
          className="budget-item__bar-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: barColor || iconColor,
          }}
        />
      </div>

      <div className="budget-item__bottom">
        <span>Đã dùng {percent}% hạn mức</span>
        <span>Còn lại {remaining}</span>
      </div>
    </div>
  );
}