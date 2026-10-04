import { useCallback, useEffect, useState } from 'react';

import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import Breadcrumb from '../../components/ui/Breadcrumb/Breadcrumb';
import AddTransactionModal from '../../components/common/AddModal/AddTransactionModal';

import useScrollReveal from '../../hooks/useScrollReveal';
import axiosClient from '../../api/axiosClient';

import './Balance.css';

export default function Balance() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  const [balanceData, setBalanceData] = useState(null);

  const [actualBalance, setActualBalance] = useState('');
  const [note, setNote] = useState('');

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [breadcrumbRef, isBreadcrumbVisible] = useScrollReveal();
  const [heroRef, isHeroVisible] = useScrollReveal();
  const [summaryRef, isSummaryVisible] = useScrollReveal();
  const [contentRef, isContentVisible] = useScrollReveal();

  const breadcrumbItems = [
    { label: 'TỔNG QUAN', path: '/' },
    { label: 'SỐ DƯ' },
  ];

  const fetchBalance = useCallback(async () => {
    try {
      // Lấy số dư và lịch sử điều chỉnh.
      const response = await axiosClient.get('/balance');
      setBalanceData(response.data || null);
    } catch (err) {
      console.error('Lỗi khi tải số dư:', err);
      setBalanceData(null);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    setError('');
    const value = Number(actualBalance);

    if (!Number.isFinite(value) || value < 0) {
      setError('Vui lòng nhập số dư thực tế hợp lệ.');
      return;
    }

    try {
      setSaving(true);

      const response = await axiosClient.post(
        '/balance/adjustments',
        {
          actualBalance: value,
          note: note.trim(),
        }
      );

      setBalanceData(response.data || null);

      setActualBalance('');
      setNote('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Không thể điều chỉnh số dư.'
      );
    } finally {
      setSaving(false);
    }
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toLocaleString('vi-VN')} đ`;
  };

  return (
    <>
      <div className="balance-layout">
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenCreateModal={() =>
            setTransactionModalOpen(true)
          }
        />

        <div className="balance-main">
          <Header
            isOpen={sidebarOpen}
            onToggleMenu={() =>
              setSidebarOpen(!sidebarOpen)
            }
          />

          <main className="balance-body">
            <div
              ref={breadcrumbRef}
              className={`reveal-on-scroll ${isBreadcrumbVisible ? 'is-visible' : ''}`}
            >
              <Breadcrumb items={breadcrumbItems} />
            </div>

            <section
              ref={heroRef}
              className={`balance-hero reveal-on-scroll reveal-delay-1 ${isHeroVisible ? 'is-visible' : ''}`}
            >
              <div className="balance-hero__content">
                <span className="balance-hero__eyebrow">
                  KIỂM TRA SỐ DƯ
                </span>

                <h1>Quản lý số dư</h1>

                <p>
                  So sánh số dư hệ thống với số tiền thực tế và điều chỉnh khi có chênh lệch.
                </p>
              </div>

              <div className="balance-hero__amount">
                <div className="balance-hero__amount-icon">
                  <i className="fa-solid fa-wallet"></i>
                </div>

                <div>
                  <span>Số dư hiện tại</span>

                  <strong>
                    {formatMoney(balanceData?.currentBalance)}
                  </strong>
                </div>
              </div>
            </section>

            <section
              ref={summaryRef}
              className={`balance-summary-grid reveal-on-scroll reveal-delay-2 ${isSummaryVisible ? 'is-visible' : ''}`}
            >
              <div className="balance-summary-card">
                <div className="balance-summary-card__top">
                  <div className="balance-summary-card__icon balance-summary-card__icon--system">
                    <i className="fa-solid fa-wallet"></i>
                  </div>

                  <span>SỐ DƯ TỪ GIAO DỊCH</span>
                </div>

                <strong>
                  {formatMoney(balanceData?.systemBalance)}
                </strong>

                <p>
                  Tổng thu nhập trừ tổng chi tiêu
                </p>
              </div>

              <div className="balance-summary-card">
                <div className="balance-summary-card__top">
                  <div className="balance-summary-card__icon balance-summary-card__icon--adjust">
                    <i className="fa-solid fa-sliders"></i>
                  </div>

                  <span>TỔNG ĐIỀU CHỈNH</span>
                </div>

                <strong>
                  {formatMoney(balanceData?.adjustmentTotal)}
                </strong>

                <p>
                  Tổng chênh lệch sau các lần đối soát
                </p>
              </div>

              <div className="balance-summary-card balance-summary-card--primary">
                <div className="balance-summary-card__top">
                  <div className="balance-summary-card__icon balance-summary-card__icon--current">
                    <i className="fa-solid fa-piggy-bank"></i>
                  </div>

                  <span>SỐ DƯ TÍCH LŨY</span>
                </div>

                <strong>
                  {formatMoney(balanceData?.currentBalance)}
                </strong>

                <p>
                  Số tiền dùng để tính tiến độ mục tiêu tiết kiệm
                </p>
              </div>
            </section>

            <section
              ref={contentRef}
              className={`balance-content-grid reveal-on-scroll ${isContentVisible ? 'is-visible' : ''}`}
            >
              <div className="balance-card balance-adjust-card">
                <div className="balance-card__heading">
                  <div>
                    <h2>Điều chỉnh số dư</h2>

                    <p>
                      Nhập số tiền thực tế đang có, hệ thống sẽ tự tính phần chênh lệch.
                    </p>
                  </div>
                </div>

                <form
                  className="balance-form"
                  onSubmit={handleAdjustBalance}
                >
                  {error && (
                    <div className="balance-form__error">
                      {error}
                    </div>
                  )}

                  <div className="balance-form__group">
                    <label>
                      Số dư thực tế hiện tại
                    </label>

                    <div className="balance-input-money">
                      <input
                        type="number"
                        min="0"
                        value={actualBalance}
                        onChange={(e) =>
                          setActualBalance(e.target.value)
                        }
                        placeholder="Ví dụ: 2100000"
                      />

                      <span>đ</span>
                    </div>
                  </div>

                  <div className="balance-form__group">
                    <label>Lý do điều chỉnh</label>

                    <textarea
                      rows="4"
                      value={note}
                      onChange={(e) =>
                        setNote(e.target.value)
                      }
                      placeholder="Ví dụ: Quên nhập một số khoản chi"
                    />
                  </div>

                  <div className="balance-form__current">
                    <span>
                      Hệ thống đang ghi nhận
                    </span>

                    <strong>
                      {formatMoney(
                        balanceData?.currentBalance
                      )}
                    </strong>
                  </div>

                  <button
                    type="submit"
                    className="balance-form__submit"
                    disabled={saving}
                  >
                    <i className="fa-solid fa-check"></i>

                    {saving
                      ? 'Đang lưu...'
                      : 'Xác nhận điều chỉnh'}
                  </button>
                </form>
              </div>

              <div className="balance-card balance-history-card">
                <div className="balance-card__heading">
                  <div>
                    <h2>Lịch sử điều chỉnh</h2>

                    <p>
                      Các lần đối soát số dư gần đây
                    </p>
                  </div>
                </div>

                {balanceData?.adjustments?.length > 0 ? (
                  <div className="balance-history">
                    {balanceData.adjustments.map((item) => {
                      const amount = Number(
                        item.amount || 0
                      );

                      const positive = amount >= 0;

                      return (
                        <div
                          className="balance-history__item"
                          key={item.id}
                        >
                          <div
                            className={`balance-history__icon ${
                              positive
                                ? 'is-positive'
                                : 'is-negative'
                            }`}
                          >
                            <i
                              className={`fa-solid ${
                                positive
                                  ? 'fa-arrow-up'
                                  : 'fa-arrow-down'
                              }`}
                            ></i>
                          </div>

                          <div className="balance-history__info">
                            <strong>
                              {item.note ||
                                'Điều chỉnh số dư'}
                            </strong>

                            <span>
                              {new Date(
                                item.created_at
                              ).toLocaleString('vi-VN')}
                            </span>

                            <small>
                              {formatMoney(
                                item.balance_before
                              )}
                              {' → '}
                              {formatMoney(
                                item.balance_after
                              )}
                            </small>
                          </div>

                          <div
                            className={`balance-history__amount ${
                              positive
                                ? 'is-positive'
                                : 'is-negative'
                            }`}
                          >
                            {positive ? '+' : '-'}

                            {' '}

                            {formatMoney(
                              Math.abs(amount)
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="balance-empty">
                    <div className="balance-empty__icon">
                      <i className="fa-solid fa-clock-rotate-left"></i>
                    </div>

                    <p>
                      Chưa có lần điều chỉnh nào
                    </p>

                    <span>
                      Khi số dư thực tế khác hệ thống,
                      lịch sử đối soát sẽ xuất hiện ở đây.
                    </span>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      <AddTransactionModal
        isOpen={transactionModalOpen}
        onClose={() =>
          setTransactionModalOpen(false)
        }
        onSuccess={fetchBalance}
      />
    </>
  );
}