import './TransactionsFilter.css';

export default function TransactionsFilter({
  search,
  onSearchChange,
  period,
  onPeriodChange,
  monthOptions = [],
  categoryId,
  onCategoryChange,
  paymentMethod,
  onPaymentChange,
  type,
  onTypeChange,
  categories = [],
  onReset,
  lastUpdated,
}) {
  const categoryOptions =
    type === 'all'
      ? categories
      : categories.filter(
          (category) =>
            category.type === type
        );

  return (
    <div className="transactions-filter-card">
      <div className="transactions-filter__row-top">
        <div className="filter-search-box">
          <i className="fa-solid fa-magnifying-glass filter-search-box__icon"></i>

          <input
            type="text"
            placeholder="Tìm theo nội dung hoặc danh mục..."
            value={search}
            onChange={(e) =>
              onSearchChange(
                e.target.value
              )
            }
          />
        </div>

        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={period}
            onChange={(e) =>
              onPeriodChange(
                e.target.value
              )
            }
          >
            <option value="all">
              Tất cả thời gian
            </option>

            {monthOptions.map(
              (value) => {
                const [
                  year,
                  month,
                ] =
                  value.split(
                    '-'
                  );

                return (
                  <option
                    key={value}
                    value={value}
                  >
                    Tháng{' '}
                    {Number(
                      month
                    )}
                    /{year}
                  </option>
                );
              }
            )}
          </select>

          <i className="fa-solid fa-chevron-down select-arrow"></i>
        </div>

        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={categoryId}
            onChange={(e) =>
              onCategoryChange(
                e.target.value
              )
            }
          >
            <option value="all">
              Tất cả danh mục
            </option>

            {categoryOptions.map(
              (category) => (
                <option
                  key={
                    category.id
                  }
                  value={
                    category.id
                  }
                >
                  {
                    category.name
                  }
                </option>
              )
            )}
          </select>

          <i className="fa-solid fa-chevron-down select-arrow"></i>
        </div>

        <div className="filter-select-wrapper">
          <select
            className="filter-select"
            value={
              paymentMethod
            }
            onChange={(e) =>
              onPaymentChange(
                e.target.value
              )
            }
          >
            <option value="all">
              Tất cả nguồn tiền
            </option>

            <option value="CASH">
              Tiền mặt
            </option>

            <option value="BANK_TRANSFER">
              Chuyển khoản
            </option>
          </select>

          <i className="fa-solid fa-chevron-down select-arrow"></i>
        </div>

        <button
          type="button"
          className="filter-btn-reset"
          onClick={onReset}
        >
          <i className="fa-solid fa-rotate-left"></i>

          <span>
            Đặt lại
          </span>
        </button>
      </div>

      <div className="transactions-filter__row-bottom">
        <div className="filter-tabs">
          <button
            type="button"
            className={`filter-tab ${
              type === 'all'
                ? 'is-active'
                : ''
            }`}
            onClick={() => {
              onTypeChange('all');
              onCategoryChange(
                'all'
              );
            }}
          >
            Tất cả giao dịch
          </button>

          <button
            type="button"
            className={`filter-tab filter-tab--income ${
              type === 'INCOME'
                ? 'is-active'
                : ''
            }`}
            onClick={() => {
              onTypeChange(
                'INCOME'
              );

              onCategoryChange(
                'all'
              );
            }}
          >
            Khoản thu
          </button>

          <button
            type="button"
            className={`filter-tab filter-tab--expense ${
              type === 'EXPENSE'
                ? 'is-active'
                : ''
            }`}
            onClick={() => {
              onTypeChange(
                'EXPENSE'
              );

              onCategoryChange(
                'all'
              );
            }}
          >
            Khoản chi
          </button>
        </div>

        <p className="filter-update-time">
          {lastUpdated ||
            'Chưa cập nhật dữ liệu'}
        </p>
      </div>
    </div>
  );
}