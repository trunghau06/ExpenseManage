const prisma = require('../config/prisma');

const calcGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const sumByType = (transactions) => {
  let income = 0;
  let expense = 0;

  transactions.forEach((item) => {
    const amount = Number(item.amount);

    if (item.type === 'INCOME') income += amount;
    if (item.type === 'EXPENSE') expense += amount;
  });

  return { income, expense };
};

const getPeriodInfo = (period) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  if (period === 'year') {
    return {
      startDate: new Date(currentYear, 0, 1),
      endDate: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999),
      previousStartDate: new Date(currentYear - 1, 0, 1),
      previousEndDate: new Date(currentYear - 1, currentMonth + 1, 0, 23, 59, 59, 999),
      monthCount: currentMonth + 1,
      periodLabel: `Năm ${currentYear}`,
      comparisonLabel: 'so với cùng kỳ năm trước',
    };
  }

  const monthCount = period === '3' ? 3 : 6;
  const startDate = new Date(currentYear, currentMonth - monthCount + 1, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
  const previousStartDate = new Date(startDate.getFullYear(), startDate.getMonth() - monthCount, 1);
  const previousEndDate = new Date(startDate.getFullYear(), startDate.getMonth(), 0, 23, 59, 59, 999);

  return {
    startDate,
    endDate,
    previousStartDate,
    previousEndDate,
    monthCount,
    periodLabel: `${monthCount} tháng gần nhất`,
    comparisonLabel: `so với ${monthCount} tháng trước`,
  };
};

// Lấy các chỉ số thống kê theo khoảng thời gian đang chọn.
exports.getStatMetrics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const period = ['3', '6', 'year'].includes(req.query.period) ? req.query.period : '6';
    const periodInfo = getPeriodInfo(period);

    const [currentTransactions, previousTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          user_id: userId,
          transaction_date: { gte: periodInfo.startDate, lte: periodInfo.endDate },
        },
        select: { type: true, amount: true },
      }),
      prisma.transaction.findMany({
        where: {
          user_id: userId,
          transaction_date: {
            gte: periodInfo.previousStartDate,
            lte: periodInfo.previousEndDate,
          },
        },
        select: { type: true, amount: true },
      }),
    ]);

    const current = sumByType(currentTransactions);
    const previous = sumByType(previousTransactions);
    const balance = current.income - current.expense;
    const savingRate = current.income > 0
      ? Math.max(0, Math.round((balance / current.income) * 100))
      : 0;

    return res.status(200).json({
      totalIncome: current.income,
      totalExpense: current.expense,
      balance,
      avgIncome: Math.round(current.income / periodInfo.monthCount),
      avgExpense: Math.round(current.expense / periodInfo.monthCount),
      savingRate,
      canCalculateSavingRate: current.income > 0,
      incomeGrowth: calcGrowth(current.income, previous.income),
      expenseGrowth: calcGrowth(current.expense, previous.expense),
      periodLabel: periodInfo.periodLabel,
      comparisonLabel: periodInfo.comparisonLabel,
    });
  } catch (error) {
    console.error('Lỗi getStatMetrics:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy số liệu thống kê!' });
  }
};

// Lấy dữ liệu thu chi từng tháng cho biểu đồ.
exports.getFlowChartData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const period = ['3', '6', 'year'].includes(req.query.period) ? req.query.period : '6';
    const periodInfo = getPeriodInfo(period);
    const now = new Date();
    const months = [];

    for (let index = periodInfo.monthCount - 1; index >= 0; index -= 1) {
      months.push(new Date(now.getFullYear(), now.getMonth() - index, 1));
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
        transaction_date: { gte: periodInfo.startDate, lte: periodInfo.endDate },
      },
      select: { type: true, amount: true, transaction_date: true },
    });

    const chartData = months.map((monthDate) => {
      const monthTransactions = transactions.filter((item) => {
        const date = new Date(item.transaction_date);
        return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear();
      });

      const totals = sumByType(monthTransactions);
      const monthNumber = monthDate.getMonth() + 1;

      return {
        month: `T${monthNumber}`,
        monthNumber,
        year: monthDate.getFullYear(),
        income: totals.income,
        expense: totals.expense,
        isCurrent: monthNumber === now.getMonth() + 1 && monthDate.getFullYear() === now.getFullYear(),
      };
    });

    return res.status(200).json(chartData);
  } catch (error) {
    console.error('Lỗi getFlowChartData:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu biểu đồ!' });
  }
};

// Lấy top 5 danh mục chi tiêu theo khoảng thời gian đang chọn.
exports.getTopExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const period = ['3', '6', 'year'].includes(req.query.period) ? req.query.period : '6';
    const periodInfo = getPeriodInfo(period);

    const expenses = await prisma.transaction.findMany({
      where: {
        user_id: userId,
        type: 'EXPENSE',
        transaction_date: { gte: periodInfo.startDate, lte: periodInfo.endDate },
      },
      include: {
        category: {
          select: { id: true, name: true, icon: true },
        },
      },
    });

    if (expenses.length === 0) {
      return res.status(200).json({
        period: periodInfo.periodLabel,
        totalExpense: '0 đ',
        topSharePercent: 0,
        otherAmount: '0 đ',
        items: [],
      });
    }

    const categoryMap = {};
    let totalExpense = 0;

    expenses.forEach((item) => {
      const amount = Number(item.amount);
      const categoryId = item.category?.id || 'other';

      totalExpense += amount;

      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = {
          id: categoryId,
          name: item.category?.name || 'Khác',
          icon: item.category?.icon || 'receipt',
          amount: 0,
        };
      }

      categoryMap[categoryId].amount += amount;
    });

    const colors = [
      { color: '#2457c5', bg: '#eaf1ff' },
      { color: '#4674d4', bg: '#eef3fc' },
      { color: '#6b8fdc', bg: '#f1f4fb' },
      { color: '#8aa7e5', bg: '#f4f6fb' },
      { color: '#a9bde8', bg: '#f6f8fc' },
    ];

    const topCategories = Object.values(categoryMap)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const topTotal = topCategories.reduce((sum, item) => sum + item.amount, 0);

    const items = topCategories.map((item, index) => ({
      id: item.id,
      rank: index + 1,
      title: item.name,
      icon: `fa-solid fa-${item.icon}`,
      iconBg: colors[index].bg,
      iconColor: colors[index].color,
      barColor: colors[index].color,
      amount: `${item.amount.toLocaleString('vi-VN')} đ`,
      percent: Math.round((item.amount / totalExpense) * 100),
    }));

    return res.status(200).json({
      period: periodInfo.periodLabel,
      totalExpense: `${totalExpense.toLocaleString('vi-VN')} đ`,
      topSharePercent: Math.round((topTotal / totalExpense) * 100),
      otherAmount: `${Math.max(totalExpense - topTotal, 0).toLocaleString('vi-VN')} đ`,
      items,
    });
  } catch (error) {
    console.error('Lỗi getTopExpenses:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy top chi tiêu!' });
  }
};
