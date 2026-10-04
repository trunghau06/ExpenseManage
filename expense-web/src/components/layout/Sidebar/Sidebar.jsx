import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../features/auth/authSlice";
import LogoutModal from "../../common/LogoutModal/LogoutModal";
import CreateTransactionBtn from "../../ui/Button/CreateTransactionBtn/CreateTransactionBtn";

import "./Sidebar.css";

const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) {
    return "";
  }

  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }

  return `http://localhost:5000${avatarUrl}`;
};

export default function Sidebar({ isOpen, onClose, onOpenCreateModal }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const avatarUrl = getAvatarUrl(user?.avatar_url);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);

    dispatch(logout());
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand__logo">
            <i className="fa-solid fa-chart-column"></i>
          </div>

          <span className="sidebar-brand__name">FinFlow</span>

          <button className="sidebar-close-btn" onClick={onClose} type="button">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <CreateTransactionBtn onClick={onOpenCreateModal} />

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-nav__item ${isActive ? "sidebar-nav__item--active" : ""}`
            }
          >
            <i className="fa-solid fa-table-cells-large"></i>

            <span>Tổng quan</span>
          </NavLink>

          <NavLink
            to="/transactions"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-nav__item ${isActive ? "sidebar-nav__item--active" : ""}`
            }
          >
            <i className="fa-regular fa-credit-card"></i>

            <span>Sổ giao dịch</span>
          </NavLink>

          <NavLink
            to="/balance"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-nav__item ${isActive ? "sidebar-nav__item--active" : ""}`
            }
          >
            <i className="fa-solid fa-wallet"></i>

            <span>Số dư</span>
          </NavLink>

          <NavLink
            to="/stats"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-nav__item ${isActive ? "sidebar-nav__item--active" : ""}`
            }
          >
            <i className="fa-solid fa-chart-simple"></i>

            <span>Thống kê & Báo cáo</span>
          </NavLink>

          <NavLink
            to="/settings"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-nav__item ${isActive ? "sidebar-nav__item--active" : ""}`
            }
          >
            <i className="fa-solid fa-gear"></i>

            <span>Cài đặt</span>
          </NavLink>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user-profile">
            <div className="sidebar__avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" />
              ) : (
                <i className="fa-solid fa-user"></i>
              )}
            </div>

            <div className="sidebar__user-details">
              <span className="sidebar__user-name">{user?.name || ""}</span>

              <span className="sidebar__user-email">{user?.email || ""}</span>
            </div>

            <button
              className="sidebar__btn-logout"
              onClick={() => setShowLogoutModal(true)}
              type="button"
              title="Đăng xuất"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
