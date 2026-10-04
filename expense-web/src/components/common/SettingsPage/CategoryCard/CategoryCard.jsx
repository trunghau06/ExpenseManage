import { useEffect, useState } from "react";

import axiosClient from "../../../../api/axiosClient";

import "./CategoryCard.css";

const iconOptions = [
  {
    value: "utensils",
    label: "Ăn uống",
  },
  {
    value: "car",
    label: "Di chuyển",
  },
  {
    value: "house",
    label: "Nhà ở",
  },
  {
    value: "cart-shopping",
    label: "Mua sắm",
  },
  {
    value: "gamepad",
    label: "Giải trí",
  },
  {
    value: "graduation-cap",
    label: "Học tập",
  },
  {
    value: "heart-pulse",
    label: "Sức khỏe",
  },
  {
    value: "briefcase",
    label: "Công việc",
  },
  {
    value: "money-bill-wave",
    label: "Thu nhập",
  },
  {
    value: "gift",
    label: "Quà tặng",
  },
  {
    value: "tag",
    label: "Khác",
  },
];

export default function CategoryCard() {
  const [categories, setCategories] = useState([]);
  const [activeType, setActiveType] = useState("EXPENSE");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("utensils");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/categories");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.categories || [];

      setCategories(data);
    } catch (error) {
      console.error(error);
      setMessage("Không thể tải danh mục");

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  const filteredCategories = categories.filter(
    (category) => category.type === activeType,
  );

  const expenseCount = categories.filter(
    (category) => category.type === "EXPENSE",
  ).length;

  const incomeCount = categories.filter(
    (category) => category.type === "INCOME",
  ).length;

  const openForm = () => {
    setName("");

    setIcon(activeType === "EXPENSE" ? "utensils" : "money-bill-wave");

    setShowForm(true);
    setMessage("");
  };

  const closeForm = () => {
    setShowForm(false);
    setName("");
    setMessage("");
  };

  const changeType = (type) => {
    setActiveType(type);
    setShowForm(false);
    setName("");
    setMessage("");
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const categoryName = name.trim();

    if (!categoryName) {
      setMessage("Vui lòng nhập tên danh mục");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      await axiosClient.post("/categories", {
        name: categoryName,
        type: activeType,
        icon,
      });
      await fetchCategories();
      setName("");
      setShowForm(false);
      setMessage("Đã thêm danh mục");

      setMessageType("success");
    } catch (error) {
      console.error(error);

      setMessage(error.response?.data?.message || "Không thể thêm danh mục");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const accepted = window.confirm(
      `Bạn có muốn xóa danh mục "${category.name}" không?`,
    );

    if (!accepted) {
      return;
    }

    try {
      setDeletingId(category.id);
      setMessage("");
      await axiosClient.delete(`/categories/${category.id}`);
      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );

      setMessage("Đã xóa danh mục");

      setMessageType("success");
    } catch (error) {
      console.error(error);

      setMessage(error.response?.data?.message || "Không thể xóa danh mục");

      setMessageType("error");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="settings-card category-card">
      <div className="category-card__header">
        <div className="category-card__header-left">
          <div className="category-card__icon-badge">
            <i className="fa-solid fa-folder"></i>
          </div>

          <div className="category-card__header-title">
            <h3>Quản lý danh mục</h3>

            <p>Quản lý các danh mục thu và chi</p>
          </div>
        </div>

        <button
          type="button"
          className="category-btn category-btn--primary"
          onClick={openForm}
        >
          <i className="fa-solid fa-plus"></i>

          <span>Thêm danh mục</span>
        </button>
      </div>

      <div className="category-card__tabs">
        <button
          type="button"
          className={`category-tab ${
            activeType === "EXPENSE" ? "category-tab--active" : ""
          }`}
          onClick={() => changeType("EXPENSE")}
        >
          <i className="fa-solid fa-arrow-down"></i>

          <span>Chi tiêu</span>

          <span className="category-tab__count">{expenseCount}</span>
        </button>

        <button
          type="button"
          className={`category-tab ${
            activeType === "INCOME" ? "category-tab--active" : ""
          }`}
          onClick={() => changeType("INCOME")}
        >
          <i className="fa-solid fa-arrow-up"></i>

          <span>Thu nhập</span>

          <span className="category-tab__count">{incomeCount}</span>
        </button>
      </div>

      {showForm && (
        <form className="category-add-box" onSubmit={handleAddCategory}>
          <div className="category-add-box__header">
            <div className="category-add-box__title">
              <i className="fa-solid fa-folder-plus"></i>

              <span>Thêm danh mục mới</span>
            </div>

            <button
              type="button"
              className="category-add-box__close-btn"
              onClick={closeForm}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="category-add-box__inputs">
            <div className="category-input-group">
              <label>Tên danh mục</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên danh mục"
                autoFocus
              />
            </div>

            <div className="category-input-group">
              <label>Icon</label>

              <div className="category-icon-select">
                <i className={`fa-solid fa-${icon}`}></i>

                <select value={icon} onChange={(e) => setIcon(e.target.value)}>
                  {iconOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="category-add-box__actions">
            <button
              type="button"
              className="category-btn-text"
              onClick={closeForm}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="category-btn category-btn--primary"
              disabled={saving}
            >
              <i className="fa-solid fa-plus"></i>

              <span>{saving ? "Đang thêm..." : "Thêm danh mục"}</span>
            </button>
          </div>
        </form>
      )}

      {message && (
        <div className={`category-message category-message--${messageType}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="category-empty">
          <div className="category-empty__icon">
            <i className="fa-solid fa-spinner fa-spin"></i>
          </div>

          <p className="category-empty__text">Đang tải danh mục...</p>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="category-list">
          {filteredCategories.map((category) => (
            <div className="category-item" key={category.id}>
              <div className="category-item__left">
                <div className="category-item__icon">
                  <i className={`fa-solid fa-${category.icon || "tag"}`}></i>
                </div>

                <div className="category-item__info">
                  <strong>{category.name}</strong>

                  <span>
                    {category.type === "EXPENSE"
                      ? "Danh mục chi tiêu"
                      : "Danh mục thu nhập"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="category-item__delete"
                disabled={deletingId === category.id}
                onClick={() => handleDelete(category)}
              >
                <i
                  className={
                    deletingId === category.id
                      ? "fa-solid fa-spinner fa-spin"
                      : "fa-regular fa-trash-can"
                  }
                ></i>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="category-empty">
          <div className="category-empty__icon">
            <i className="fa-regular fa-folder-open"></i>
          </div>

          <p className="category-empty__text">
            {activeType === "EXPENSE"
              ? "Chưa có danh mục chi tiêu"
              : "Chưa có danh mục thu nhập"}
          </p>

          <span className="category-empty__sub">
            Thêm danh mục để sử dụng khi tạo giao dịch
          </span>
        </div>
      )}
    </div>
  );
}
