import { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";

import "./AddTransactionModal.css";

export default function AddTransactionModal({ isOpen, onClose, onSuccess }) {
  const [type, setType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [transactionDate, setTransactionDate] = useState("");
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setType("EXPENSE");
    setAmount("");
    setCategoryId("");
    setPaymentMethod("CASH");
    setNote("");
    setError("");

    setTransactionDate(new Date().toISOString().slice(0, 10));

    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/categories");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.categories || [];

        setCategories(data);
      } catch (error) {
        console.error(error);
        setCategories([]);

        setError("Không tải được danh mục.");
      }
    };

    fetchCategories();
  }, [isOpen]);

  const filteredCategories = categories.filter(
    (category) => category.type === type,
  );

  const handleTypeChange = (value) => {
    setType(value);
    setCategoryId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (Number(amount) <= 0 || !categoryId || !transactionDate) {
      setError("Vui lòng nhập đầy đủ các trường bắt buộc.");
      return;
    }

    try {
      setSaving(true);

      await axiosClient.post("/transactions", {
        category_id: categoryId,
        amount: Number(amount),
        type,
        note: note.trim(),
        transaction_date: transactionDate,
        payment_method: paymentMethod,
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Không thể lưu giao dịch.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header__title">
            <div className="modal-header__icon">
              <i className="fa-solid fa-receipt"></i>
            </div>

            <div>
              <h3>Thêm giao dịch mới</h3>
              <p>Ghi chép khoản thu hoặc chi tiêu của bạn</p>
            </div>
          </div>

          <button type="button" className="modal-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <div className="modal-error-msg">{error}</div>}

          <div className="modal-type-tabs">
            <button
              type="button"
              className={`modal-type-tab ${
                type === "EXPENSE" ? "modal-type-tab--active-expense" : ""
              }`}
              onClick={() => handleTypeChange("EXPENSE")}
            >
              <i className="fa-solid fa-arrow-down"></i>
              <span>Khoản Chi</span>
            </button>

            <button
              type="button"
              className={`modal-type-tab ${
                type === "INCOME" ? "modal-type-tab--active-income" : ""
              }`}
              onClick={() => handleTypeChange("INCOME")}
            >
              <i className="fa-solid fa-arrow-up"></i>
              <span>Khoản Thu</span>
            </button>
          </div>

          <div className="modal-field">
            <label className="modal-field__label">Số tiền (VNĐ) *</label>

            <div className="modal-field__input-box">
              <i className="fa-solid fa-coins modal-field__icon"></i>

              <input
                type="number"
                min="1"
                placeholder="Nhập số tiền"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-field__label">Danh mục *</label>

            <div className="modal-field__input-box">
              <i className="fa-solid fa-folder modal-field__icon"></i>

              <select
                className="modal-field__select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">-- Chọn danh mục --</option>

                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-field__label">
              Phương thức thanh toán *
            </label>

            <div className="modal-field__input-box">
              <i className="fa-solid fa-wallet modal-field__icon"></i>

              <select
                className="modal-field__select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="CASH">Tiền mặt</option>

                <option value="BANK_TRANSFER">Chuyển khoản</option>
              </select>
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-field__label">Ngày giao dịch *</label>

            <div className="modal-field__input-box">
              <i className="fa-regular fa-calendar-days modal-field__icon"></i>

              <input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-field__label">Ghi chú thêm</label>

            <div className="modal-field__input-box">
              <i className="fa-regular fa-pen-to-square modal-field__icon"></i>

              <input
                type="text"
                placeholder="Nhập ghi chú"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn--secondary"
              onClick={onClose}
              disabled={saving}
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              className="modal-btn modal-btn--primary"
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Lưu giao dịch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
