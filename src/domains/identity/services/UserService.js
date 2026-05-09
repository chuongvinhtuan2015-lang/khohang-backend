import UserRepository from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';

class UserService {
  async getAllUsers() {
    return await UserRepository.getAll();
  }

  async getUserById(id) {
    const user = await UserRepository.getById(id);
    if (!user) throw new Error('Không tìm thấy nhân viên');
    return user;
  }

  async createUser(userData) {
    console.log('--- Creating User ---');
    const { username, full_name, email, phone, role, password } = userData;
    
    const plainPassword = password || '123456';
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(plainPassword, salt);
    
    console.log(`Hashing password for user: ${username}`);
    
    const id = await UserRepository.create({ 
      username, 
      password_hash, 
      full_name, 
      email, 
      phone, 
      role 
    });
    
    return id;
  }

  async updateUser(id, userData) {
    const affectedRows = await UserRepository.update(id, userData);
    if (affectedRows === 0) throw new Error('Không tìm thấy nhân viên');
    return affectedRows;
  }

  async deleteUser(id) {
    const affectedRows = await UserRepository.delete(id);
    if (affectedRows === 0) throw new Error('Không tìm thấy nhân viên');
    return affectedRows;
  }

  async changePassword(username, oldPassword, newPassword) {
    const user = await UserRepository.getByUsername(username);
    
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    let isMatch = false;
    if (user.password_hash && user.password_hash.startsWith('$2')) {
      isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    } else {
      isMatch = (oldPassword === user.password_hash);
    }

    if (!isMatch) {
      throw new Error('Mật khẩu cũ không chính xác');
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    
    await UserRepository.updatePassword(user.id, newHash);
  }
}

export default new UserService();
