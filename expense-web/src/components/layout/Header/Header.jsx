import { useState } from "react";
import { useSelector } from "react-redux";
import "./Header.css";

const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) {
    return "";
  }

  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }

  return `http://localhost:5000${avatarUrl}`;
};

export default function Header({ onToggleMenu }) {
  const user = useSelector((state) => state.auth.user);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const avatarUrl = getAvatarUrl(user?.avatar_url);

  return (
    <header className="header">
      {showMobileSearch ? (
        <div className="header__mobile-search-bar">
          <i className="fa-solid fa-magnifying-glass header__search-icon"></i>

          <input
            type="text"
            className="header__search-input header__search-input--mobile"
            placeholder="Tìm kiếm giao dịch, danh mục..."
            autoFocus
          />

          <button
            className="header__search-close-btn"
            type="button"
            onClick={() => setShowMobileSearch(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      ) : (
        <>
          <div className="header__left">
            <button
              className="header__toggle-btn"
              title="Menu"
              type="button"
              onClick={onToggleMenu}
            >
              <i className="fa-solid fa-bars"></i>
            </button>

            <div className="header__mobile-brand">
              <div className="header__mobile-logo">
                <i className="fa-solid fa-chart-column"></i>
              </div>

              <span className="header__mobile-name">FinFlow</span>
            </div>
          </div>

          <div className="header__right">
            <div className="header__search">
              <i className="fa-solid fa-magnifying-glass header__search-icon"></i>

              <input
                type="text"
                className="header__search-input"
                placeholder="Tìm kiếm giao dịch, danh mục..."
              />
            </div>

            <button
              className="header__action-btn header__action-btn--mobile-search"
              title="Tìm kiếm"
              type="button"
              onClick={() => setShowMobileSearch(true)}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            <button
              className="header__action-btn"
              title="Thông báo"
              type="button"
            >
              <i className="fa-regular fa-bell"></i>

              <span className="header__badge-dot"></span>
            </button>

            <div className="header__user">
              <div className="header__avatar">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" />
                ) : (
                  <i className="fa-solid fa-user"></i>
                )}
              </div>

              <span className="header__username">{user?.name || ""}</span>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
