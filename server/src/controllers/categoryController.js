const prisma = require('../config/prisma');

const validTypes = [
  'INCOME',
  'EXPENSE',
];

exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;

    const categories =
      await prisma.category.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          created_at: 'asc',
        },
      });

    return res.status(200).json(
      categories
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        'Không thể tải danh mục!',
    });
  }
};

exports.createCategory = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;

    const {
      name,
      type,
      icon,
    } = req.body;

    const categoryName =
      typeof name === 'string'
        ? name.trim()
        : '';

    if (!categoryName) {
      return res.status(400).json({
        message:
          'Vui lòng nhập tên danh mục!',
      });
    }

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message:
          'Loại danh mục không hợp lệ!',
      });
    }

    const existedCategory =
      await prisma.category.findFirst({
        where: {
          user_id: userId,
          name: categoryName,
          type,
        },
      });

    if (existedCategory) {
      return res.status(400).json({
        message:
          'Danh mục này đã tồn tại!',
      });
    }

    const category =
      await prisma.category.create({
        data: {
          user_id: userId,
          name: categoryName,
          type,
          icon: icon || 'tag',
        },
      });

    return res.status(201).json(
      category
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        'Không thể tạo danh mục!',
    });
  }
};

exports.deleteCategory = async (
  req,
  res
) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const category =
      await prisma.category.findFirst({
        where: {
          id,
          user_id: userId,
        },
      });

    if (!category) {
      return res.status(404).json({
        message:
          'Không tìm thấy danh mục!',
      });
    }

    const transactionCount =
      await prisma.transaction.count({
        where: {
          user_id: userId,
          category_id: id,
        },
      });

    if (transactionCount > 0) {
      return res.status(400).json({
        message:
          'Không thể xóa danh mục đã có giao dịch!',
      });
    }

    const budgetCount =
      await prisma.budget.count({
        where: {
          user_id: userId,
          category_id: id,
        },
      });

    if (budgetCount > 0) {
      return res.status(400).json({
        message:
          'Không thể xóa danh mục đang có hạn mức!',
      });
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message:
        'Đã xóa danh mục!',
      id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        'Không thể xóa danh mục!',
    });
  }
};