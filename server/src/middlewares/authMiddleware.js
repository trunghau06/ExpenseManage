const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Lấy token từ header Authorization: Bearer <TOKEN>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập hoặc thiếu Token xác thực!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
    }

    // Gắn thông tin userId đã giải mã vào req để các controller phía sau dùng
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;