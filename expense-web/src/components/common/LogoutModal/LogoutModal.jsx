import './LogoutModal.css';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </div>

        <h3 className="modal-title">Đăng xuất tài khoản</h3>
        <p className="modal-desc">
          Bạn có chắc chắn muốn đăng xuất khỏi FinFlow không?
        </p>

        <div className="modal-actions">
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose}>
            Hủy bỏ
          </button>
          <button type="button" className="modal-btn modal-btn--confirm" onClick={onConfirm}>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}