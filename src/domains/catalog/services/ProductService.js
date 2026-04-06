import ProductRepository from '../repositories/ProductRepository.js';

class ProductService {
  async getAllProducts(query) {
    return await ProductRepository.getAll(query);
  }

  async getProductById(id) {
    const product = await ProductRepository.getById(id);
    if (!product) throw new Error('Không tìm thấy sản phẩm');
    return product;
  }

  async createProduct(data) {
    return await ProductRepository.create(data);
  }

  async updateProduct(id, data) {
    const affectedRows = await ProductRepository.update(id, data);
    if (affectedRows === 0) throw new Error('Không tìm thấy sản phẩm');
    return affectedRows;
  }

  async deleteProduct(id) {
    const hasTransactions = await ProductRepository.hasTransactions(id);
    if (hasTransactions) {
      throw new Error('Sản phẩm này đã có lịch sử giao dịch (Nhập/Xuất kho), không thể xóa để đảm bảo tính nhất quán dữ liệu.');
    }
    const affectedRows = await ProductRepository.delete(id);
    if (affectedRows === 0) throw new Error('Không tìm thấy sản phẩm');
    return affectedRows;
  }
}

export default new ProductService();
