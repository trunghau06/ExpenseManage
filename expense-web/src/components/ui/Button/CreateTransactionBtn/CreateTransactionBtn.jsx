import './CreateTransactionBtn.css';

export default function CreateTransactionBtn({ onClick }) {
  return (
    <button className="sidebar-btn__create" onClick={onClick} type="button">
      <i className="fa-regular fa-plus"></i>
      <span>Thêm giao dịch</span>
    </button>
  );
}