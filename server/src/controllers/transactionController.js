const prisma = require('../config/prisma');

const calcGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
};

const sumTransactions = (transactions) => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((item) => {
    const amount = Number(item.amount);

    if (item.type === 'INCOME') totalIncome += amount;
    if (item.type === 'EXPENSE') totalExpense += amount;
  });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

// Lấy danh sách giao dịch và tổng thu chi theo bộ lọc.
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year, startDate, endDate, category_id, type, payment_method } = req.query;

    let dateFilter = {};
    let previousDateFilter = null;

    if (startDate && endDate) {
      dateFilter = {
        transaction_date: {
          gte: new Date(`${startDate}T00:00:00`),
          lte: new Date(`${endDate}T23:59:59.999`),
        },
      };
    } else if (month && year) {
      const selectedMonth = Number(month);
      const selectedYear = Number(year);
      const start = new Date(selectedYear, selectedMonth - 1, 1);
      const end = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999);
      const previousStart = new Date(selectedYear, selectedMonth - 2, 1);
      const previousEnd = new Date(selectedYear, selectedMonth - 1, 0, 23, 59, 59, 999);

      dateFilter = {
        transaction_date: { gte: start, lte: end },
      };

      previousDateFilter = {
        transaction_date: { gte: previousStart, lte: previousEnd },
      };
    }

    const commonFilter = {
      user_id: userId,
      ...(category_id && { category_id }),
      ...(type && { type }),
      ...(payment_method && { payment_method }),
    };

    const transactions = await prisma.transaction.findMany({
      where: {
        ...commonFilter,
        ...dateFilter,
      },
      include: {
        category: {
          select: { id: true, name: true, icon: true, type: true },
        },
      },
      orderBy: { transaction_date: 'desc' },
    });

    const summary = sumTransactions(transactions);
    let incomeGrowth = 0;
    let expenseGrowth = 0;

    if (previousDateFilter) {
      const previousTransactions = await prisma.transaction.findMany({
        where: {
          ...commonFilter,
          ...previousDateFilter,
        },
      });

      const previousSummary = sumTransactions(previousTransactions);
      incomeGrowth = calcGrowth(summary.totalIncome, previousSummary.totalIncome);
      expenseGrowth = calcGrowth(summary.totalExpense, previousSummary.totalExpense);
    }

    return res.status(200).json({
      transactions,
      summary: {
        ...summary,
        incomeGrowth,
        expenseGrowth,
      },
    });
  } catch (error) {
    console.error('Lỗi getTransactions:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy giao dịch!' });
  }
};

// Thêm giao dịch mới.
exports.createTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category_id, amount, type, note, transaction_date, payment_method } = req.body;

    if (!category_id || !amount || !type || !transaction_date) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin giao dịch!' });
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      return res.status(400).json({ message: 'Loại giao dịch không hợp lệ!' });
    }

    if (payment_method && !['CASH', 'BANK_TRANSFER'].includes(payment_method)) {
      return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ!' });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({ message: 'Số tiền phải lớn hơn 0!' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        user_id: userId,
        category_id,
        amount: Number(amount),
        type,
        payment_method: payment_method || 'CASH',
        note: note || null,
        transaction_date: new Date(transaction_date),
      },
      include: { category: true },
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error('Lỗi createTransaction:', error);
    return res.status(500).json({ message: 'Lỗi server khi thêm giao dịch!' });
  }
};

// Cập nhật giao dịch của người dùng hiện tại.
exports.updateTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { category_id, amount, type, note, transaction_date, payment_method } = req.body;

    const oldTransaction = await prisma.transaction.findFirst({
      where: { id, user_id: userId },
    });

    if (!oldTransaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch!' });
    }

    if (!category_id || !amount || !type || !transaction_date || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Thông tin giao dịch không hợp lệ!' });
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        category_id,
        amount: Number(amount),
        type,
        note: note || null,
        transaction_date: new Date(transaction_date),
        payment_method: payment_method || 'CASH',
      },
      include: { category: true },
    });

    return res.status(200).json(transaction);
  } catch (error) {
    console.error('Lỗi updateTransaction:', error);
    return res.status(500).json({ message: 'Lỗi server khi sửa giao dịch!' });
  }
};

// Xóa giao dịch của người dùng hiện tại.
exports.deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, user_id: userId },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch!' });
    }

    await prisma.transaction.delete({ where: { id } });

    return res.status(200).json({ message: 'Xóa giao dịch thành công!' });
  } catch (error) {
    console.error('Lỗi deleteTransaction:', error);
    return res.status(500).json({ message: 'Lỗi server khi xóa giao dịch!' });
  }
};
