import './TransactionsTable.css';

export default function TransactionsTable({ data = [], onDelete }) {
  return (
    <div className="transactions-table-card">
      <div className="table-responsive">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>NGÀY & GIỜ</th>
              <th>DANH MỤC</th>
              <th>NỘI DUNG / GHI CHÚ</th>
              <th>VÍ / NGUỒN TIỀN</th>
              <th>LOẠI</th>
              <th style={{ textAlign: 'right' }}>SỐ TIỀN</th>
              <th style={{ textAlign: 'center', width: '80px' }}>THAO TÁC</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item) => {
                const date = new Date(item.transaction_date);
                const isIncome = item.type === 'INCOME';

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="col-datetime">
                        <span className="col-datetime__date">{date.toLocaleDateString('vi-VN')}</span>
                        <span className="col-datetime__time">
                          {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="col-category">
                        <div className="col-category__icon">
                          <i className={`fa-solid fa-${item.category?.icon || 'tag'}`}></i>
                        </div>
                        <span className="col-category__name">{item.category?.name || 'Khác'}</span>
                      </div>
                    </td>

                    <td>
                      <div className="col-description">
                        <span className="col-description__title">{item.note || item.category?.name || 'Giao dịch'}</span>
                      </div>
                    </td>

                    <td>
                      <div className="col-account">
                        <span className="col-account__dot"></span>
                        {item.payment_method === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Tiền mặt'}
                      </div>
                    </td>

                    <td>
                      <span className={`col-type ${isIncome ? 'col-type--income' : 'col-type--expense'}`}>
                        {isIncome ? 'Khoản thu' : 'Khoản chi'}
                      </span>
                    </td>

                    <td className={`col-amount ${isIncome ? 'col-amount--income' : 'col-amount--expense'}`}>
                      {isIncome ? '+' : '-'} {Number(item.amount).toLocaleString('vi-VN')} đ
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <button type="button" className="btn-delete-tx" onClick={() => onDelete(item)}>
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7">
                  <div className="transactions-table-empty">
                    <div className="transactions-table-empty__icon">
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <p className="transactions-table-empty__text">Không có giao dịch phù hợp</p>
                    <span className="transactions-table-empty__sub">Thử thay đổi bộ lọc hoặc thêm giao dịch mới</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
