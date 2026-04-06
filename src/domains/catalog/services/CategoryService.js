import CategoryRepository from '../repositories/CategoryRepository.js';

class CategoryService {
  async getAllCategories() {
    return await CategoryRepository.getAll();
  }

  async getCategoryById(id) {
    const category = await CategoryRepository.getById(id);
    if (!category) throw new Error('Không tìm thấy danh mục');
    return category;
  }

  async createCategory(data) {
    return await CategoryRepository.create(data);
  }

  async updateCategory(id, data) {
    const affectedRows = await CategoryRepository.update(id, data);
    if (affectedRows === 0) throw new Error('Không tìm thấy danh mục');
    return affectedRows;
  }

  async deleteCategory(id) {
    const affectedRows = await CategoryRepository.delete(id);
    if (affectedRows === 0) throw new Error('Không tìm thấy danh mục');
    return affectedRows;
  }
}

export default new CategoryService();
