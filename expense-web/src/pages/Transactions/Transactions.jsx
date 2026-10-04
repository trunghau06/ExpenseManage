import { useCallback, useEffect, useState } from 'react';

import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import Breadcrumb from '../../components/ui/Breadcrumb/Breadcrumb';
import TransactionsHero from '../../components/common/Transactions/TransactionsHero/TransactionsHero';
import TransactionsMetrics from '../../components/common/Transactions/TransactionsMetrics/TransactionsMetrics';
import TransactionsFilter from '../../components/common/Transactions/TransactionsFilter/TransactionsFilter';
import TransactionsTable from '../../components/common/Transactions/TransactionsTable/TransactionsTable';
import AddTransactionModal from '../../components/common/AddModal/AddTransactionModal';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal/DeleteConfirmModal';

import useScrollReveal from '../../hooks/useScrollReveal';
import axiosClient from '../../api/axiosClient';
import './Transactions.css';

export default function Transactions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');

  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('all');
  const [categoryId, setCategoryId] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [type, setType] = useState('all');

  const [breadcrumbRef, isBreadcrumbVisible] = useScrollReveal();
  const [heroRef, isHeroVisible] = useScrollReveal();
  const [metricsRef, isMetricsVisible] = useScrollReveal();
  const [filterRef, isFilterVisible] = useScrollReveal();
  const [tableRef, isTableVisible] = useScrollReveal();

  const breadcrumbItems = [
    { label: 'TỔNG QUAN', path: '/' },
    { label: 'SỔ GIAO DỊCH' },
  ];

  const fetchTransactions = useCallback(async () => {
    try {
      // Lấy toàn bộ giao dịch và danh mục để lọc trực tiếp ở frontend.
      const [transactionRes, categoryRes] = await Promise.all([
        axiosClient.get('/transactions'),
        axiosClient.get('/categories'),
      ]);

      setTransactions(transactionRes.data?.transactions || []);
      setCategories(categoryRes.data || []);

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setLastUpdated(`Cập nhật lúc ${hours}:${minutes}`);
    } catch (err) {
      console.error('Lỗi khi tải sổ giao dịch:', err);
      setTransactions([]);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const monthOptions = [
    ...new Set(
      transactions.map((item) => {
        const date = new Date(item.transaction_date);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${date.getFullYear()}-${month}`;
      })
    ),
  ].sort().reverse();

  const isInSelectedPeriod = (dateValue) => {
    if (period === 'all') return true;

    const date = new Date(dateValue);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const transactionPeriod = `${date.getFullYear()}-${month}`;

    return transactionPeriod === period;
  };

  const filteredTransactions = transactions.filter((item) => {
    const keyword = search.trim().toLowerCase();
    const note = (item.note || '').toLowerCase();
    const categoryName = (item.category?.name || '').toLowerCase();

    const matchesSearch = !keyword || note.includes(keyword) || categoryName.includes(keyword);
    const matchesPeriod = isInSelectedPeriod(item.transaction_date);
    const matchesCategory = categoryId === 'all' || item.category_id === categoryId;
    const matchesPayment = paymentMethod === 'all' || item.payment_method === paymentMethod;
    const matchesType = type === 'all' || item.type === type;

    return matchesSearch && matchesPeriod && matchesCategory && matchesPayment && matchesType;
  });

  const metrics = filteredTransactions.reduce(
    (result, item) => {
      const amount = Number(item.amount);

      if (item.type === 'INCOME') result.totalIncome += amount;
      if (item.type === 'EXPENSE') result.totalExpense += amount;

      return result;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  const resetFilters = () => {
    setSearch('');
    setPeriod('all');
    setCategoryId('all');
    setPaymentMethod('all');
    setType('all');
  };

  const openDeleteModal = (transaction) => {
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
  };

  const deleteTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      await axiosClient.delete(`/transactions/${selectedTransaction.id}`);
      setDeleteModalOpen(false);
      setSelectedTransaction(null);
      fetchTransactions();
    } catch (err) {
      console.error('Lỗi khi xóa giao dịch:', err);
    }
  };

  const exportCsv = () => {
    if (filteredTransactions.length === 0) return;

    // Xuất chính danh sách đang hiển thị ra file CSV.
    const rows = filteredTransactions.map((item) => [
      new Date(item.transaction_date).toLocaleDateString('vi-VN'),
      item.category?.name || 'Khác',
      item.note || '',
      item.payment_method === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Tiền mặt',
      item.type === 'INCOME' ? 'Khoản thu' : 'Khoản chi',
      Number(item.amount),
    ]);

    const header = ['Ngày', 'Danh mục', 'Ghi chú', 'Nguồn tiền', 'Loại', 'Số tiền'];
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'so-giao-dich.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="transactions-layout">
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenCreateModal={() => setTransactionModalOpen(true)}
        />

        <div className="transactions-main">
          <Header
            isOpen={sidebarOpen}
            onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
          />

          <main className="transactions-body">
            <div
              ref={breadcrumbRef}
              className={`reveal-on-scroll ${isBreadcrumbVisible ? 'is-visible' : ''}`}
            >
              <Breadcrumb items={breadcrumbItems} />
            </div>

            <div
              ref={heroRef}
              className={`reveal-on-scroll reveal-delay-1 ${isHeroVisible ? 'is-visible' : ''}`}
            >
              <TransactionsHero
                onOpenModal={() => setTransactionModalOpen(true)}
                onExport={exportCsv}
              />
            </div>

            <div
              ref={metricsRef}
              className={`reveal-on-scroll reveal-delay-2 ${isMetricsVisible ? 'is-visible' : ''}`}
            >
              <TransactionsMetrics data={metrics} />
            </div>

            <div
              ref={filterRef}
              className={`reveal-on-scroll ${isFilterVisible ? 'is-visible' : ''}`}
            >
              <TransactionsFilter
                search={search}
                onSearchChange={setSearch}
                period={period}
                onPeriodChange={setPeriod}
                monthOptions={monthOptions}
                categoryId={categoryId}
                onCategoryChange={setCategoryId}
                paymentMethod={paymentMethod}
                onPaymentChange={setPaymentMethod}
                type={type}
                onTypeChange={setType}
                categories={categories}
                onReset={resetFilters}
                lastUpdated={lastUpdated}
              />
            </div>

            <div
              ref={tableRef}
              className={`reveal-on-scroll ${isTableVisible ? 'is-visible' : ''}`}
            >
              <TransactionsTable data={filteredTransactions} onDelete={openDeleteModal} />
            </div>
          </main>
        </div>
      </div>

      <AddTransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSuccess={fetchTransactions}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={deleteTransaction}
        itemTitle={selectedTransaction?.note || selectedTransaction?.category?.name}
      />
    </>
  );
}
