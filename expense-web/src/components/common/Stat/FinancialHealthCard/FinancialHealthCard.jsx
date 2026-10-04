import './FinancialHealthCard.css';

export default function FinancialHealthCard({ data = null, onExport }) {
  const totalIncome = Number(data?.totalIncome || 0);
  const totalExpense = Number(data?.totalExpense || 0);
  const balance = Number(data?.balance || 0);
  const hasData = totalIncome > 0 || totalExpense > 0;
  const canCalculate = Boolean(data?.canCalculateSavingRate);
  const savingRate = canCalculate ? Number(data?.savingRate || 0) : null;
  const score = savingRate === null ? null : Math.max(0, Math.min(savingRate, 100));

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = score === null
    ? circumference
    : circumference - (score / 100) * circumference;

  let status = 'Chưa thể tính';
  let message = 'Không có thu nhập trong kỳ để tính tỷ lệ tiết kiệm.';

  if (canCalculate && balance < 0) {
    status = 'Chi vượt thu nhập';
    message = 'Chi tiêu đang cao hơn thu nhập trong khoảng thời gian này.';
  } else if (score !== null && score >= 20) {
    status = 'Tốt';
    message = 'Bạn đang giữ lại được một phần thu nhập tốt sau khi trừ chi tiêu.';
  } else if (score !== null && score >= 10) {
    status = 'Ổn';
    message = 'Bạn có phần thu nhập còn lại sau chi tiêu và vẫn có thể cải thiện thêm.';
  } else if (score !== null && score > 0) {
    status = 'Cần cải thiện';
    message = 'Bạn vẫn còn tiền sau chi tiêu nhưng tỷ lệ tiết kiệm hiện khá thấp.';
  } else if (score === 0 && canCalculate) {
    status = 'Chưa có tiết kiệm';
    message = 'Thu nhập trong kỳ chưa tạo ra phần tiền còn lại sau chi tiêu.';
  }

  return (
    <div className="health-card">
      <div className="health-card__header">
        <h3>Đánh giá sức khỏe tài chính</h3>
        <span className="health-card__badge">
          <i className="fa-solid fa-shield"></i>
        </span>
      </div>

      {hasData ? (
        <div className="health-gauge-box">
          <div className="health-gauge">
            <svg className="health-gauge__svg" viewBox="0 0 180 180">
              <circle className="health-gauge__bg" cx="90" cy="90" r={radius}></circle>
              <circle
                className="health-gauge__progress"
                cx="90"
                cy="90"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              ></circle>
            </svg>

            <div className="health-gauge__content">
              <span className="health-gauge__score">
                {score === null ? '--' : `${score}%`}
              </span>
              <span className="health-gauge__scale">
                {score === null ? 'CHƯA THỂ TÍNH' : 'TIẾT KIỆM'}
              </span>
              <span className="health-gauge__rank">{status}</span>
            </div>
          </div>

          <p className="health-gauge__desc">{message}</p>
          <p className="health-gauge__period">{data?.periodLabel}</p>
        </div>
      ) : (
        <div className="health-card__empty">
          <div className="health-card__empty-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <p className="health-card__empty-text">Chưa có dữ liệu phân tích</p>
          <span className="health-card__empty-sub">
            Hãy thêm giao dịch để xem đánh giá tài chính theo kỳ.
          </span>
        </div>
      )}

      <button type="button" className="health-export-btn" onClick={onExport}>
        <i className="fa-regular fa-file-lines"></i>
        <span>In / Lưu báo cáo PDF</span>
      </button>
    </div>
  );
}
