import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";

import "./BudgetModal.css";

export default function BudgetModal({
  isOpen,
  onClose,
  onSuccess,
  month,
  year,
}) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError]   = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setCategoryId("");
    setAmount("");
    setError("");

    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/categories");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.categories || [];

        setCategories(data.filter((category) => category.type === "EXPENSE"));
      } catch (error) {
        console.error(error);
        setCategories([]);

        setError("Không tải được danh mục.");
      }
    };

    fetchCategories();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!categoryId || Number(amount) <= 0) {
      setError("Vui lòng chọn danh mục và nhập hạn mức hợp lệ.");
      return;
    }

    try {
      setSaving(true);

      await axiosClient.post("/budgets", {
        category_id: categoryId,
        amount: Number(amount),
        month,
        year,
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Không thể lưu hạn mức.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="budget-modal-overlay" onClick={onClose}>
      <div className="budget-modal" onClick={(e) => e.stopPropagation()}>
        <div className="budget-modal__header">
          <div>
            <h3 className="budget-modal__title">Thiết lập hạn mức</h3>

            <p className="budget-modal__sub">
              Đặt ngân sách cho từng danh mục chi tiêu
            </p>
          </div>

          <button
            type="button"
            className="budget-modal__close"
            onClick={onClose}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {error && <div className="budget-modal__alert">{error}</div>}

        <form className="budget-modal__form" onSubmit={handleSubmit}>
          <div className="budget-form-group">
            <label className="budget-form-label">Danh mục</label>

            <select
              className="budget-form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- Chọn danh mục --</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="budget-form-group">
            <label className="budget-form-label">Hạn mức (đ)</label>

            <input
              type="number"
              min="1"
              className="budget-form-input"
              placeholder="Nhập hạn mức"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="budget-modal__actions">
            <button
              type="button"
              className="budget-btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="budget-btn-primary"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu hạn mức"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
