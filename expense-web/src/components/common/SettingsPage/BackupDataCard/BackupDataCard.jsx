
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axiosClient from '../../../../api/axiosClient';
import './BackupDataCard.css';

export default function BackupDataCard() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [modalOpen, setModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!modalOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !exporting) {
        setModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modalOpen, exporting]);

  const downloadCSV = (transactions) => {
    const headers = [
      'Ngày',
      'Loại giao dịch',
      'Danh mục',
      'Số tiền',
      'Phương thức thanh toán',
      'Ghi chú'
    ];

    const rows = transactions.map((item) => [
      item.date ?? item.transaction_date ?? '',
      item.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu',
      item.category?.name ?? item.category_name ?? '',
      item.amount ?? 0,
      item.payment_method ?? '',
      item.note ?? ''
    ]);

    const escapeCSV = (value) => {
      const text = String(value ?? '');
      return `"${text.replace(/"/g, '""')}"`;
    };

    const title = `BÁO CÁO GIAO DỊCH THÁNG ${month}/${year}`;
    const csvString = [
      [title],
      [],
      headers,
      ...rows
    ]
      .map((row) => row.map(escapeCSV).join(','))
      .join('\r\n');

    const blob = new Blob(
      ['\uFEFF', csvString],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `ExpenseManage_${year}_${String(month).padStart(2, '0')}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleExport = async () => {
    if (exporting || year < 2000 || year > 2100) return;

    try {
      setExporting(true);
      const response = await axiosClient.get('/transactions', {
        params: { month, year }
      });

      const payload = response.data;
      const transactions = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.transactions)
          ? payload.transactions
          : Array.isArray(payload?.data)
            ? payload.data
            : null;

      if (!transactions) {
        throw new Error('Cấu trúc dữ liệu giao dịch không hợp lệ.');
      }

      if (transactions.length === 0) {
        window.alert(`Không có giao dịch trong tháng ${month}/${year}.`);
        return;
      }

      downloadCSV(transactions);
      setModalOpen(false);
    } catch (error) {
      console.error('Lỗi xuất CSV:', error);
      window.alert('Không thể xuất dữ liệu. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="settings-card backup-card">
        <div className="backup-card__left">
          <div className="backup-card__icon">
            <i className="fa-solid fa-download"></i>
          </div>

          <div className="backup-card__info">
            <h3>Sao lưu dữ liệu tài chính</h3>
            <p>Xuất giao dịch theo tháng dưới dạng CSV</p>
          </div>
        </div>

        <button
          type="button"
          className="backup-card__btn"
          onClick={() => setModalOpen(true)}
        >
          <i className="fa-solid fa-download"></i>
          <span>Xuất dữ liệu</span>
        </button>
      </div>

      {modalOpen && createPortal(
        <div
          className="backup-modal__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !exporting) {
              setModalOpen(false);
            }
          }}
        >
          <div
            className="backup-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="backup-modal-title"
          >
            <div className="backup-modal__header">
              <div className="backup-modal__heading">
                <div className="backup-modal__icon">
                  <i className="fa-solid fa-file-csv"></i>
                </div>
                <div>
                  <h2 id="backup-modal-title">Xuất dữ liệu tài chính</h2>
                  <p>Chọn thời gian để xuất báo cáo giao dịch</p>
                </div>
              </div>

              <button
                type="button"
                className="backup-modal__close"
                onClick={() => setModalOpen(false)}
                disabled={exporting}
                aria-label="Đóng"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="backup-modal__body">
              <div className="backup-modal__fields">
                <div className="backup-modal__field">
                  <label htmlFor="backup-month">Tháng</label>
                  <select
                    id="backup-month"
                    value={month}
                    onChange={(event) => setMonth(Number(event.target.value))}
                    disabled={exporting}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Tháng {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="backup-modal__field">
                  <label htmlFor="backup-year">Năm</label>
                  <input
                    id="backup-year"
                    type="number"
                    min="2000"
                    max="2100"
                    value={year}
                    onChange={(event) => setYear(Number(event.target.value))}
                    disabled={exporting}
                  />
                </div>
              </div>

              <div className="backup-modal__notice">
                <i className="fa-solid fa-circle-info"></i>
                <span>
                  Dữ liệu giao dịch tháng {month}/{year} sẽ được xuất
                  thành file CSV có thể mở bằng Excel.
                </span>
              </div>
            </div>

            <div className="backup-modal__footer">
              <button
                type="button"
                className="backup-modal__cancel"
                onClick={() => setModalOpen(false)}
                disabled={exporting}
              >
                Hủy
              </button>

              <button
                type="button"
                className="backup-modal__submit"
                onClick={handleExport}
                disabled={exporting || year < 2000 || year > 2100}
              >
                <i className="fa-solid fa-download"></i>
                {exporting ? 'Đang xuất...' : 'Xuất CSV'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
