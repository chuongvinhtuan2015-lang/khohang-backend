import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_khohang_pro';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Tìm USer bằng username
    const user = await User.getByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập không tồn tại' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }

    // So sánh mật khẩu
    // Hiện tại Database đang lưu pass plain text "123456" do mock data cũ, 
    // Chúng ta tạm chấp nhận so sánh chuẩn trước (giả định có bcrypt) 
    // Nếu lỗi do pass cũ không băm, xử lý fallback cho pass plain text
    let isMatch = false;
    if (user.password_hash.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } else {
      isMatch = (password === user.password_hash);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác' });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
