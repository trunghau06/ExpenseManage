const prisma = require('../config/prisma');

exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;

    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    const budgets = await prisma.budget.findMany({
      where: {
        user_id: userId,
        ...(m && y ? { month: m, year: y } : {}),
      },
    });

    return res.status(200).json(budgets);
  } catch (error) {
    console.error('Lỗi getBudgets:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy hạn mức ngân sách!' });
  }
};

exports.upsertBudget = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category_id, amount, month, year } = req.body;

    if (!category_id || amount === undefined || !month || !year) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin hạn mức!' });
    }

    const parsedAmount = parseFloat(amount);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    const existingBudget = await prisma.budget.findFirst({
      where: {
        user_id: userId,
        category_id,
        month: m,
        year: y,
      },
    });

    let budget;
    if (existingBudget) {
      budget = await prisma.budget.update({
        where: { id: existingBudget.id },
        data: { amount: parsedAmount },
      });
    } else {
      budget = await prisma.budget.create({
        data: {
          user_id: userId,
          category_id,
          amount: parsedAmount,
          month: m,
          year: y,
        },
      });
    }

    return res.status(200).json({ message: 'Lưu hạn mức thành công!', budget });
  } catch (error) {
    console.error('Lỗi upsertBudget:', error);
    return res.status(500).json({ message: 'Lỗi server khi lưu hạn mức!' });
  }
};