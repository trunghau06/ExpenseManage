import { useState } from 'react';

import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import Breadcrumb from '../../components/ui/Breadcrumb/Breadcrumb';

import InfoCard from '../../components/common/SettingsPage/InfoCard/InfoCard';
import SecurityCard from '../../components/common/SettingsPage/SecurityCard/SecurityCard';
import CategoryCard from '../../components/common/SettingsPage/CategoryCard/CategoryCard';
import BackupDataCard from '../../components/common/SettingsPage/BackupDataCard/BackupDataCard';
import AddTransactionModal from '../../components/common/AddModal/AddTransactionModal';

import './Settings.css';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  const breadcrumbItems = [
    {
      label: 'TỔNG QUAN',
      path: '/',
    },
    {
      label: 'CÀI ĐẶT HỆ THỐNG',
    },
  ];

  return (
    <div className="settings-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCreateModal={() => setTransactionModalOpen(true)}
      />

      <div className="settings-main">
        <Header
          isOpen={sidebarOpen}
          onToggleMenu={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="settings-body">
          <Breadcrumb items={breadcrumbItems} />

          <div className="setting-body__heading">
            <h1>Hệ thống & Tùy chỉnh</h1>

            <p>
              Quản lý thông tin tài khoản, danh mục tiền và tùy chọn ứng dụng
            </p>
          </div>

          <div className="settings-content">
            <div className="settings-content__left">
              <InfoCard />
              <BackupDataCard />
            </div>

            <div className="settings-content__right">
              <CategoryCard />
              <SecurityCard />
            </div>
          </div>
        </main>
      </div>

      <AddTransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
      />
    </div>
  );
}