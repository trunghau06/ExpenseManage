const prisma = require('../config/prisma');

exports.getProfile = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId;

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar_url: true,
          created_at: true,
        },
      });

    if (!user) {
      return res.status(404).json({
        message:
          'Không tìm thấy người dùng!',
      });
    }

    return res
      .status(200)
      .json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        'Không thể lấy thông tin tài khoản!',
    });
  }
};

exports.updateProfile = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId;

    const { phone } = req.body;

    const phoneValue =
      typeof phone === 'string'
        ? phone.trim()
        : '';

    if (!phoneValue) {
      return res.status(400).json({
        message:
          'Vui lòng nhập số điện thoại!',
      });
    }

    const phoneRegex =
      /^(0[35789]\d{8}|\+84[35789]\d{8})$/;

    if (
      !phoneRegex.test(phoneValue)
    ) {
      return res.status(400).json({
        message:
          'Số điện thoại không hợp lệ!',
      });
    }

    const user =
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          phone: phoneValue,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar_url: true,
          created_at: true,
        },
      });

    return res.status(200).json({
      message:
        'Cập nhật thông tin thành công!',
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        'Không thể cập nhật thông tin tài khoản!',
    });
  }
};

exports.updateAvatar = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        message:
          'Vui lòng chọn ảnh!',
      });
    }

    const avatarUrl =
      `/uploads/avatars/${req.file.filename}`;

    const user =
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar_url: avatarUrl,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar_url: true,
          created_at: true,
        },
      });

    return res.status(200).json({
      message:
        'Cập nhật ảnh thành công!',
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        'Không thể cập nhật ảnh đại diện!',
    });
  }
};