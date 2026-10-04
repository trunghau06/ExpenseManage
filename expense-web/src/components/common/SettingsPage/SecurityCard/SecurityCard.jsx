import './SecurityCard.css';

export default function SecurityCard() {
  return (
    <div className="settings-card security-card">
      <div className="settings-card__heading">
        <div className="security-card__icon-header">
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <div className="settings-card__heading--title">
          <h3>Bảo mật & Đăng xuất</h3>
          <p>Mật khẩu và phiên đăng nhập hiện hành</p>
        </div>
      </div>

      <form className="security-card__form">
        <div className="security-field">
          <label className="security-field__label">Mật khẩu hiện tại</label>
          <div className="security-field__input-box">
            <i className="fa-solid fa-lock security-field__icon"></i>
            <input type="password" placeholder="Nhập mật khẩu hiện tại" />
            <button type="button" className="security-field__toggle-btn">
              <i className="fa-regular fa-eye-slash"></i>
            </button>
          </div>
        </div>

        <div className="security-field">
          <label className="security-field__label">Mật khẩu mới</label>
          <div className="security-field__input-box">
            <i className="fa-solid fa-key security-field__icon"></i>
            <input type="password" placeholder="Nhập mật khẩu mới" />
            <button type="button" className="security-field__toggle-btn">
              <i className="fa-regular fa-eye-slash"></i>
            </button>
          </div>
        </div>

        <button type="button" className="security-card__update-btn">
          <span>Cập nhật mật khẩu</span>
        </button>

        <div className="security-card__logout-group">
          <button type="button" className="security-card__logout-btn">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Đăng xuất tài khoản</span>
          </button>
          <p className="security-card__logout-note">Bạn sẽ tự nối xử lý đổi mật khẩu và đăng xuất tại đây</p>
        </div>
      </form>
    </div>
  );
}
