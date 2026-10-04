import StatCard from '../../../ui/StatCard/StatCard';
import './TransactionsMetrics.css';

export default function TransactionsMetrics({ data }) {
  const totalIncome = data?.totalIncome || 0;
  const totalExpense = data?.totalExpense || 0;
  const balance = totalIncome - totalExpense;

  return (
    <div className="transactions-metrics-grid">
      <StatCard
        variant="light"
        type="income"
        label="TỔNG THU TRONG KỲ"
        amount={`+ ${totalIncome.toLocaleString('vi-VN')}`}
        note="Khoản thu sau khi lọc"
        icon="fa-solid fa-arrow-up"
      />

      <StatCard
        variant="light"
        type="expense"
        label="TỔNG CHI TRONG KỲ"
        amount={`- ${totalExpense.toLocaleString('vi-VN')}`}
        note="Khoản chi sau khi lọc"
        icon="fa-solid fa-arrow-down"
      />

      <StatCard
        variant="light"
        type="net"
        label="DÒNG TIỀN RÒNG (NET)"
        amount={balance.toLocaleString('vi-VN')}
        note="Thu nhập trừ chi tiêu"
        icon="fa-solid fa-wallet"
      />
    </div>
  );
}
