const prisma = require('../config/prisma');

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
    systemBalance: totalIncome - totalExpense,
  };
};

const getBalanceData = async (userId) => {
  const [transactions, adjustments] = await Promise.all([
    prisma.transaction.findMany({
      where: { user_id: userId },
      select: { type: true, amount: true },
    }),
    prisma.balanceAdjustment.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    }),
  ]);

  const transactionSummary = sumTransactions(transactions);
  const adjustmentTotal = adjustments.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return {
    ...transactionSummary,
    adjustmentTotal,
    currentBalance: transactionSummary.systemBalance + adjustmentTotal,
    adjustments,
  };
};

// Lấy số dư tích lũy và lịch sử điều chỉnh của người dùng.
exports.getBalance = async (req, res) => {
  try {
    const data = await getBalanceData(req.user.userId);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Lỗi getBalance:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy số dư!' });
  }
};

// Điều chỉnh số dư bằng số tiền thực tế mà người dùng đang có.
exports.createAdjustment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const actualBalance = Number(req.body.actualBalance);
    const note = req.body.note?.trim() || null;

    if (!Number.isFinite(actualBalance)) {
      return res.status(400).json({ message: 'Số dư thực tế không hợp lệ!' });
    }

    const currentData = await getBalanceData(userId);
    const difference = actualBalance - currentData.currentBalance;

    if (Math.abs(difference) < 0.01) {
      return res.status(400).json({ message: 'Số dư thực tế đang khớp với hệ thống.' });
    }

    await prisma.balanceAdjustment.create({
      data: {
        user_id: userId,
        amount: difference,
        balance_before: currentData.currentBalance,
        balance_after: actualBalance,
        note,
      },
    });

    const data = await getBalanceData(userId);
    return res.status(201).json(data);
  } catch (error) {
    console.error('Lỗi createAdjustment:', error);
    return res.status(500).json({ message: 'Lỗi server khi điều chỉnh số dư!' });
  }
};
