import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
  try { res.json(await User.getAll()); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const createUser = async (req, res) => {
  try {
    const id = await User.create({ ...req.body, password_hash: req.body.password || '123456' });
    res.status(201).json({ id, message: 'Tạo nhân viên thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const updateUser = async (req, res) => {
  try {
    const rows = await User.update(req.params.id, req.body);
    if (rows === 0) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteUser = async (req, res) => {
  try {
    const rows = await User.delete(req.params.id);
    if (rows === 0) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.json({ message: 'Xóa thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const username = req.user.username; // Lấy username từ token
    
    // Sử dụng getByUsername vì hàm này SELECT * (có password_hash)
    const user = await User.getByUsername(username);
    
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    let isMatch = false;
    if (user.password_hash && user.password_hash.startsWith('$2')) {
      isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    } else {
      isMatch = (oldPassword === user.password_hash);
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    
    // Gọi hàm update trong model
    await User.updatePassword(user.id, newHash);
    
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
