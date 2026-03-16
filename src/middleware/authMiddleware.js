import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_khohang_pro';

// Middleware kiểm tra Token hợp lệ
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để tiếp tục' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Lưu thông tin { id, username, role } vào req
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ' });
  }
};

// Middleware kiểm tra quyền ADMIN
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Truy cập bị từ chối: Cần quyền Admin' });
  }
};

// Middleware kiểm tra quyền MANAGER trở lên
export const isManager = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'MANAGER')) {
    next();
  } else {
    res.status(403).json({ message: 'Truy cập bị từ chối: Cần quyền Quản lý' });
  }
};
