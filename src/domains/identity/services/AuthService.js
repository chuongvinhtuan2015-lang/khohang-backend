import UserRepository from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_khohang_pro';

class AuthService {
  async login(username, password) {
    const user = await UserRepository.getByUsername(username);
    
    if (!user) {
      throw new Error('Tên đăng nhập không tồn tại');
    }

    if (user.status !== 'active') {
      throw new Error('Tài khoản đã bị khóa');
    }

    // Only allow bcrypt hashed passwords for security
    if (!user.password_hash || !user.password_hash.startsWith('$2')) {
      throw new Error('Tài khoản cần được cập nhật bảo mật, vui lòng liên hệ admin (Lỗi mã hóa mật khẩu).');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new Error('Mật khẩu không chính xác');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      }
    };
  }
}

export default new AuthService();
