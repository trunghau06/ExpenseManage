import { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import './SavingsGoalModal.css';

export default function SavingsGoalModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setTitle(initialData?.title || '');
    setTargetAmount(initialData?.target_amount || '');
    setError('');
  }, [isOpen, initialData]);

  // Tạo hoặc cập nhật mục tiêu tiết kiệm.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || Number(targetAmount) <= 0) {
      setError('Vui lòng nhập tên mục tiêu và số tiền hợp lệ.');
      return;
    }

    try {
      await axiosClient.post('/savings-goals', {
        title: title.trim(),
        targetAmount: Number(targetAmount),
      });

      onClose();
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể lưu mục tiêu.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="goal-modal-overlay" onClick={onClose}>
      <div className="goal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="goal-modal__header">
          <div>
            <h3 className="goal-modal__title">Mục tiêu tiết kiệm</h3>
            <p className="goal-modal__sub">Thiết lập số tiền bạn muốn tích lũy</p>
          </div>

          <button type="button" className="goal-modal__close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form className="goal-modal__form" onSubmit={handleSubmit}>
          {error && <div className="goal-modal__alert">{error}</div>}

          <div className="goal-form-group">
            <label className="goal-form-label">Tên mục tiêu</label>
            <input
              type="text"
              className="goal-form-input"
              placeholder="Ví dụ: Tiết kiệm 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="goal-form-group">
            <label className="goal-form-label">Số tiền mục tiêu (đ)</label>
            <input
              type="number"
              min="1"
              className="goal-form-input"
              placeholder="Nhập số tiền mục tiêu"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
          </div>

          <div className="goal-modal__actions">
            <button type="button" className="goal-btn-secondary" onClick={onClose}>Hủy</button>
            <button type="submit" className="goal-btn-primary">Lưu mục tiêu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
