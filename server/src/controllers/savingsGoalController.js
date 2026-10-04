const prisma = require('../config/prisma');

// Lấy mục tiêu tiết kiệm hiện tại của người dùng.
exports.getSavingsGoal = async (req, res) => {
  try {
    const userId = req.user.userId;

    const goal = await prisma.savingsGoal.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return res.status(200).json(goal || null);
  } catch (error) {
    console.error('Lỗi getSavingsGoal:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy mục tiêu tiết kiệm!' });
  }
};

// Tạo mới hoặc cập nhật tên và số tiền mục tiêu.
exports.upsertSavingsGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, targetAmount } = req.body;
    const target = Number(targetAmount);

    if (!title?.trim() || !Number.isFinite(target) || target <= 0) {
      return res.status(400).json({ message: 'Vui lòng nhập tên mục tiêu và số tiền hợp lệ!' });
    }

    const existingGoal = await prisma.savingsGoal.findFirst({
      where: { user_id: userId },
    });

    const data = {
      title: title.trim(),
      target_amount: target,
    };

    const goal = existingGoal
      ? await prisma.savingsGoal.update({
          where: { id: existingGoal.id },
          data,
        })
      : await prisma.savingsGoal.create({
          data: {
            user_id: userId,
            ...data,
          },
        });

    return res.status(200).json({
      message: 'Lưu mục tiêu tiết kiệm thành công!',
      goal,
    });
  } catch (error) {
    console.error('Lỗi upsertSavingsGoal:', error);
    return res.status(500).json({ message: 'Lỗi server khi lưu mục tiêu tiết kiệm!' });
  }
};
