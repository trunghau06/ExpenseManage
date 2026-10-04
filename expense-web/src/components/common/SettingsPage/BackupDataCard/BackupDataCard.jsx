import './BackupDataCard.css';

export default function BackupDataCard() {
  return (
    <div className="settings-card backup-card">
      <div className="backup-card__left">
        <div className="backup-card__icon">
          <i className="fa-solid fa-download"></i>
        </div>
        <div className="backup-card__info">
          <h3>Sao lưu dữ liệu tài chính</h3>
          <p>Xuất báo cáo chi tiêu dạng Excel (.xlsx) hoặc CSV</p>
        </div>
      </div>

      <button type="button" className="backup-card__btn">
        <i className="fa-solid fa-download"></i>
        <span>Xuất dữ liệu</span>
      </button>
    </div>
  );
}