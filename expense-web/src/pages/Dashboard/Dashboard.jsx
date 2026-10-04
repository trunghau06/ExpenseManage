import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import AddTransactionModal from '../../components/common/AddModal/AddTransactionModal';
import DashboardHero from '../../components/common/DashBoard/DashboardHero/DashboardHero';
import DashboardMetrics from '../../components/common/DashBoard/DashboardMetrics/DashboardMetrics';
import ExpenseStructureCard from '../../components/common/DashBoard/ExpenseStructureCard/ExpenseStructureCard';
import RecentTransactionsCard from '../../components/common/DashBoard/RecentTransactionsCard/RecentTransactionsCard';
import BudgetProgressCard from '../../components/common/DashBoard/BudgetProgressCard/BudgetProgressCard';
import SavingGoalCard from '../../components/common/DashBoard/SavingsGoalCard/SavingsGoalCard';
import SavingsGoalModal from '../../components/common/SavingsGoalModal/SavingsGoalModal';
import BudgetModal from '../../components/common/BudgetModal/BudgetModal';

import useScrollReveal from '../../hooks/useScrollReveal';
import axiosClient from '../../api/axiosClient';
import './Dashboard.css';

const CATEGORY_COLORS = {
  'Ăn uống': '#2457c5',
  'Di chuyển': '#4674d4',
  'Mua sắm': '#315fb8',
  'Giải trí': '#6b8fdc',
  'Học tập': '#1e46a0',
};

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [summaryData, setSummaryData] = useState(null);
  const [recentData, setRecentData] = useState([]);
  const [expenseData, setExpenseData] = useState(null);
  const [budgetData, setBudgetData] = useState([]);
  const [savingGoalData, setSavingGoalData] = useState(null);

  const [heroRef, isHeroVisible] = useScrollReveal();
  const [metricsRef, isMetricsVisible] = useScrollReveal();
  const [leftTopRef, isLeftTopVisible] = useScrollReveal();
  const [leftBottomRef, isLeftBottomVisible] = useScrollReveal();
  const [rightTopRef, isRightTopVisible] = useScrollReveal();
  const [rightBottomRef, isRightBottomVisible] = useScrollReveal();

  const now = new Date();
  const selectedDate = activeTab === 0
    ? now
    : new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const selectedMonth = selectedDate.getMonth() + 1;
  const selectedYear = selectedDate.getFullYear();

  const fetchDashboardData = useCallback(async () => {
    try {
      // Lấy dữ liệu Dashboard của tháng đang xem và số dư tích lũy toàn bộ.
      const [transactionRes, balanceRes, goalRes, budgetRes, categoryRes] = await Promise.all([
        axiosClient.get(`/transactions?month=${selectedMonth}&year=${selectedYear}`),
        axiosClient.get('/balance'),
        axiosClient.get('/savings-goals'),
        axiosClient.get(`/budgets?month=${selectedMonth}&year=${selectedYear}`),
        axiosClient.get('/categories'),
      ]);

      const { transactions = [], summary = {} } = transactionRes.data;
      const accumulatedBalance = Number(balanceRes.data?.currentBalance || 0);
      const goal = goalRes.data || null;
      const budgets = budgetRes.data || [];
      const categories = categoryRes.data || [];

      setSavingGoalData(goal);

      const expenseTotals = {};

      transactions
        .filter((item) => item.type === 'EXPENSE')
        .forEach((item) => {
          const categoryName = item.category?.name || 'Khác';
          expenseTotals[categoryName] = (expenseTotals[categoryName] || 0) + Number(item.amount);
        });

      const expenseCategories = Object.entries(expenseTotals)
        .map(([name, amount]) => ({
          name,
          amount,
          percent: summary.totalExpense > 0
            ? Math.round((amount / summary.totalExpense) * 100)
            : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

      setExpenseData(
        expenseCategories.length > 0
          ? {
              totalExpense: summary.totalExpense,
              categories: expenseCategories,
            }
          : null
      );

      const formattedRecent = transactions.slice(0, 5).map((item) => {
        const categoryName = item.category?.name || 'Chung';
        const isIncome = item.type === 'INCOME';
        const color = isIncome
          ? '#2457c5'
          : CATEGORY_COLORS[categoryName] || '#4674d4';

        return {
          id: item.id,
          title: item.note || categoryName || 'Giao dịch',
          category: categoryName,
          date: new Date(item.transaction_date).toLocaleDateString('vi-VN'),
          amount: `${isIncome ? '+' : '-'} ${Number(item.amount).toLocaleString('vi-VN')} đ`,
          paymentMethod: item.payment_method === 'BANK_TRANSFER'
            ? 'Chuyển khoản'
            : 'Tiền mặt',
          type: item.type.toLowerCase(),
          icon: item.category?.icon
            ? `fa-solid fa-${item.category.icon}`
            : 'fa-solid fa-receipt',
          iconColor: color,
          iconBg: `${color}18`,
        };
      });

      setRecentData(formattedRecent);

      const formattedBudgets = budgets.map((budget) => {
        const category = categories.find((item) => item.id === budget.category_id);
        const spent = expenseTotals[category?.name] || 0;
        const limit = Number(budget.amount || 0);
        const percent = limit > 0
          ? Math.min(Math.round((spent / limit) * 100), 100)
          : 0;

        return {
          id: budget.id,
          name: category?.name || 'Danh mục khác',
          icon: category?.icon || 'tag',
          color: CATEGORY_COLORS[category?.name] || '#2457c5',
          spent,
          limit,
          percent,
        };
      });

      setBudgetData(formattedBudgets);

      const monthlyIncome = Number(summary.totalIncome || 0);
      const monthlyExpense = Number(summary.totalExpense || 0);
      const monthlyBalance = Number(summary.balance || 0);
      const budgetLimit = budgets.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );

      setSummaryData({
        totalIncome: monthlyIncome,
        totalExpense: monthlyExpense,
        balance: monthlyBalance,
        allTimeBalance: accumulatedBalance,
        incomeGrowth: summary.incomeGrowth === null ? null : Number(summary.incomeGrowth || 0),
        expenseGrowth: summary.expenseGrowth === null ? null : Number(summary.expenseGrowth || 0),
        budgetLimit,
      });
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Dashboard:', err);
      setSummaryData(null);
      setRecentData([]);
      setExpenseData(null);
      setBudgetData([]);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <>
      <div className="dashboard-layout">
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenCreateModal={() => setTransactionModalOpen(true)}
        />

        <div className="dashboard-main">
          <Header
            isOpen={sidebarOpen}
            onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
          />

          <main className="dashboard-body">
            <div
              ref={heroRef}
              className={`reveal-on-scroll ${isHeroVisible ? 'is-visible' : ''}`}
            >
              <DashboardHero
                user={user?.name}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            <div
              ref={metricsRef}
              className={`reveal-on-scroll reveal-delay-1 ${isMetricsVisible ? 'is-visible' : ''}`}
            >
              <DashboardMetrics data={summaryData} />
            </div>

            <div className="dashboard-content">
              <div className="dashboard-content__left">
                <div
                  ref={leftTopRef}
                  className={`reveal-on-scroll reveal-delay-2 ${isLeftTopVisible ? 'is-visible' : ''}`}
                >
                  <ExpenseStructureCard data={expenseData} />
                </div>

                <div
                  ref={leftBottomRef}
                  className={`reveal-on-scroll ${isLeftBottomVisible ? 'is-visible' : ''}`}
                >
                  <BudgetProgressCard
                    budgets={budgetData}
                    onOpenModal={() => setBudgetModalOpen(true)}
                  />
                </div>
              </div>

              <div className="dashboard-content__right">
                <div
                  ref={rightTopRef}
                  className={`reveal-on-scroll reveal-delay-2 ${isRightTopVisible ? 'is-visible' : ''}`}
                >
                  <RecentTransactionsCard data={recentData} />
                </div>

                <div
                  ref={rightBottomRef}
                  className={`reveal-on-scroll ${isRightBottomVisible ? 'is-visible' : ''}`}
                >
                  <SavingGoalCard
                    data={savingGoalData}
                    accumulatedBalance={summaryData?.allTimeBalance || 0}
                    onOpenModal={() => setGoalModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AddTransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <SavingsGoalModal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSuccess={fetchDashboardData}
        initialData={savingGoalData}
      />

      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        onSuccess={fetchDashboardData}
        month={selectedMonth}
        year={selectedYear}
      />
    </>
  );
}
