import './TransactionsHero.css';

export default function TransactionsHero({ onOpenModal, onExport }) {
  return (
    <div className="transactions-body-hero">
      <div className="transactions-body__hero--heading">
        <div className="transactions-hero__title">
          <h1>Sổ giao dịch</h1>
          <p>Xem, lọc và xuất các khoản thu chi đã ghi nhận</p>
        </div>

        <div className="transactions-hero__actions">
          <button type="button" className="transactions-hero__export-btn" onClick={onExport}>
            <i className="fa-solid fa-download"></i>
            <span>Xuất CSV</span>
          </button>

          <button type="button" className="transactions-hero__primary-btn" onClick={onOpenModal}>
            <i className="fa-solid fa-circle-plus"></i>
            <span>Thêm giao dịch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
