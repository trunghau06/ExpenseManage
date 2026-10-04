import './DeleteConfirmModal.css';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemTitle }) {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="delete-modal-title">Xác nhận xóa giao dịch</h3>
        <p className="delete-modal-desc">
          Bạn có chắc chắn muốn xóa giao dịch <strong>"{itemTitle || 'này'}"</strong>? Thao tác này không thể hoàn tác.
        </p>

        <div className="delete-modal-actions">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Hủy bỏ
          </button>
          <button type="button" className="btn-modal-delete" onClick={onConfirm}>
            Xóa giao dịch
          </button>
        </div>
      </div>
    </div>
  );
}