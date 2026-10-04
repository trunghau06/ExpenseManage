const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = require('../config/prisma');

exports.register = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          'Vui lòng điền đầy đủ họ tên, email và mật khẩu!',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          'Mật khẩu phải có ít nhất 6 ký tự!',
      });
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          'Email này đã được sử dụng!',
      });
    }

    const password_hash =
      await bcrypt.hash(
        password,
        10
      );

    const newUser =
      await prisma.user.create({
        data: {
          name,
          email,
          password_hash,
        },
      });

    const defaultCategories = [
      {
        name: 'Ăn uống',
        type: 'EXPENSE',
        icon: 'utensils',
        user_id: newUser.id,
      },
      {
        name: 'Di chuyển',
        type: 'EXPENSE',
        icon: 'car',
        user_id: newUser.id,
      },
      {
        name: 'Mua sắm',
        type: 'EXPENSE',
        icon: 'cart-shopping',
        user_id: newUser.id,
      },
      {
        name: 'Lương',
        type: 'INCOME',
        icon: 'wallet',
        user_id: newUser.id,
      },
      {
        name: 'Thưởng',
        type: 'INCOME',
        icon: 'gift',
        user_id: newUser.id,
      },
    ];

    await prisma.category.createMany({
      data: defaultCategories,
    });

    return res.status(201).json({
      message:
        'Đăng ký tài khoản thành công!',

      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        avatar_url:
          newUser.avatar_url,
      },
    });
  } catch (error) {
    console.error(
      'Lỗi register:',
      error
    );

    return res.status(500).json({
      message:
        'Lỗi server, vui lòng thử lại sau!',
    });
  }
};

exports.login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          'Vui lòng nhập email và mật khẩu!',
      });
    }

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return res.status(400).json({
        message:
          'Email hoặc mật khẩu không chính xác!',
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!isPasswordValid) {
      return res.status(400).json({
        message:
          'Email hoặc mật khẩu không chính xác!',
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.status(200).json({
      message:
        'Đăng nhập thành công!',

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url:
          user.avatar_url,
      },
    });
  } catch (error) {
    console.error(
      'Lỗi login:',
      error
    );

    return res.status(500).json({
      message:
        'Lỗi server, vui lòng thử lại sau!',
    });
  }
};

exports.changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const userId =
      req.user.userId;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          'Vui lòng nhập đầy đủ mật khẩu cũ và mới!',
      });
    }

    if (
      newPassword.length < 6
    ) {
      return res.status(400).json({
        message:
          'Mật khẩu mới phải có ít nhất 6 ký tự!',
      });
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      return res.status(404).json({
        message:
          'Không tìm thấy người dùng!',
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        currentPassword,
        user.password_hash
      );

    if (!isPasswordValid) {
      return res.status(400).json({
        message:
          'Mật khẩu hiện tại không chính xác!',
      });
    }

    const password_hash =
      await bcrypt.hash(
        newPassword,
        10
      );

    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password_hash,
      },
    });

    return res.status(200).json({
      message:
        'Đổi mật khẩu thành công!',
    });
  } catch (error) {
    console.error(
      'Lỗi changePassword:',
      error
    );

    return res.status(500).json({
      message:
        'Lỗi server khi đổi mật khẩu!',
    });
  }
};