import UserService from '../services/UserService.js';

export const getUsers = async (req, res) => {
  try { res.json(await UserService.getAllUsers()); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.json(user);
  } catch (e) { 
    if (e.message === 'Không tìm thấy nhân viên') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message }); 
  }
};

export const createUser = async (req, res) => {
  try {
    const id = await UserService.createUser(req.body);
    res.status(201).json({ id, message: 'Tạo nhân viên thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const updateUser = async (req, res) => {
  try {
    await UserService.updateUser(req.params.id, req.body);
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { 
    if (e.message === 'Không tìm thấy nhân viên') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message }); 
  }
};

export const deleteUser = async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (e) { 
    if (e.message === 'Không tìm thấy nhân viên') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message }); 
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const username = req.user.username; 
    
    await UserService.changePassword(username, oldPassword, newPassword);
    
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    if (error.message === 'Người dùng không tồn tại') return res.status(404).json({ message: error.message });
    if (error.message === 'Mật khẩu cũ không chính xác') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};
