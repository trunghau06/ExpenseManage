import './StatCard.css';

export default function StatCard({
  children,
  className = '',
  variant = 'default',
  type = 'income',
  label,
  icon,
  amount,
  pillText,
  note,
}) {
  const isLight = variant === 'light';

  const cardClasses = [
    'stat-card',
    className,
    isLight
      ? `stat-card--light stat-card--light-${type}`
      : type === 'primary'
      ? 'stat-card--primary'
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (children) {
    return <div className={cardClasses}>{children}</div>;
  }

  return (
    <div className={cardClasses}>
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        <div className={`stat-card__icon stat-card__icon--${type}`}>
          <i className={icon} />
        </div>
      </div>

      <div className="stat-card__amount">
        <span>{amount}</span>
        <span className="stat-card__currency">đ</span>
      </div>

      <div className="stat-card__footer">
        {pillText && (
          <span className={`stat-card__pill stat-card__pill--${type}`}>
            {pillText}
          </span>
        )}
        {note && <span className="stat-card__note">{note}</span>}
      </div>
    </div>
  );
}