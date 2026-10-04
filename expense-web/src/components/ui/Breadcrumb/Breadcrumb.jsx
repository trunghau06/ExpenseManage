import { Link } from 'react-router-dom';
import './Breadcrumb.css';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="breadcrumb__wrapper">
            {isLast || !item.path ? (
              <span className={`breadcrumb__item ${isLast ? 'breadcrumb__item--active' : ''}`}>
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="breadcrumb__item">
                {item.label}
              </Link>
            )}

            {!isLast && (
              <i className="fa-solid fa-chevron-right breadcrumb__separator" aria-hidden="true" />
            )}
          </span>
        );
      })}
    </nav>
  );
}