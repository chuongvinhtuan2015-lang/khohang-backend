import AuthService from '../services/AuthService.js';

export const login = async (req, res) => {
  const startTime = performance.now();
  try {
    const { username, password } = req.body;
    const result = await AuthService.login(username, password);

    res.json({
      message: 'Đăng nhập thành công',
      ...result
    });
    const endTime = performance.now();
    console.log(`Thời gian đăng nhập: ${endTime - startTime}ms`);
  } catch (error) {
    if (error.message === 'Tên đăng nhập không tồn tại' || error.message === 'Mật khẩu không chính xác') {
      return res.status(401).json({ message: error.message });
    }
    if (error.message === 'Tài khoản đã bị khóa') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
