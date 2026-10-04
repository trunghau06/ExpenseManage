import { useCallback, useEffect, useState } from 'react';

import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import StatHero from '../../components/common/Stat/StatHero/StatHero';
import StatMetrics from '../../components/common/Stat/StatMetrics/StatMetrics';
import StatChart from '../../components/common/Stat/StatChart/StatChart';
import TopExpensesCard from '../../components/common/Stat/TopExpensesCard/TopExpensesCard';
import FinancialHealthCard from '../../components/common/Stat/FinancialHealthCard/FinancialHealthCard';
import AddTransactionModal from '../../components/common/AddModal/AddTransactionModal';
import Breadcrumb from '../../components/ui/Breadcrumb/Breadcrumb';

import useScrollReveal from '../../hooks/useScrollReveal';
import axiosClient from '../../api/axiosClient';
import './Stats.css';

export default function Stats() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [period, setPeriod] = useState('6');
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [topExpenses, setTopExpenses] = useState(null);

  const [breadcrumbRef, isBreadcrumbVisible] = useScrollReveal();
  const [heroRef, isHeroVisible] = useScrollReveal();
  const [chartRef, isChartVisible] = useScrollReveal();
  const [metricsRef, isMetricsVisible] = useScrollReveal();
  const [bottomRef, isBottomVisible] = useScrollReveal();

  const breadcrumbItems = [
    { label: 'TỔNG QUAN', path: '/' },
    { label: 'TÀI CHÍNH CÁ NHÂN' },
  ];

  const fetchStats = useCallback(async () => {
    try {
      // Lấy toàn bộ số liệu thống kê theo khoảng thời gian đang chọn.
      const [metricsRes, chartRes, topRes] = await Promise.all([
        axiosClient.get(`/stats/metrics?period=${period}`),
        axiosClient.get(`/stats/chart-flow?period=${period}`),
        axiosClient.get(`/stats/top-expenses?period=${period}`),
      ]);

      setMetrics(metricsRes.data || null);
      setChartData(chartRes.data || []);
      setTopExpenses(topRes.data || null);
    } catch (err) {
      console.error('Lỗi khi tải thống kê:', err);
      setMetrics(null);
      setChartData([]);
      setTopExpenses(null);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const exportReport = () => {
    window.print();
  };

  return (
    <div className="stats-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCreateModal={() => setTransactionModalOpen(true)}
      />

      <div className="stats-main">
        <Header
          isOpen={sidebarOpen}
          onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="stats-body">
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
            <StatHero period={period} onPeriodChange={setPeriod} />
          </div>

          <div
            ref={chartRef}
            className={`reveal-on-scroll reveal-delay-2 ${isChartVisible ? 'is-visible' : ''}`}
          >
            <StatChart data={chartData} />
          </div>

          <div
            ref={metricsRef}
            className={`reveal-on-scroll reveal-delay-3 ${isMetricsVisible ? 'is-visible' : ''}`}
          >
            <StatMetrics data={metrics} />
          </div>

          <div
            ref={bottomRef}
            className={`stats-bottom-grid reveal-on-scroll ${isBottomVisible ? 'is-visible' : ''}`}
          >
            <TopExpensesCard data={topExpenses} />
            <FinancialHealthCard data={metrics} onExport={exportReport} />
          </div>
        </main>
      </div>

      <AddTransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSuccess={fetchStats}
      />
    </div>
  );
}
