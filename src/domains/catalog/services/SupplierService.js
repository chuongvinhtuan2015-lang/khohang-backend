import SupplierRepository from '../repositories/SupplierRepository.js';

class SupplierService {
  async getAllSuppliers() {
    return await SupplierRepository.getAll();
  }

  async getSupplierById(id) {
    const supplier = await SupplierRepository.getById(id);
    if (!supplier) throw new Error('Không tìm thấy nhà cung cấp');
    return supplier;
  }

  async createSupplier(data) {
    return await SupplierRepository.create(data);
  }

  async updateSupplier(id, data) {
    const affectedRows = await SupplierRepository.update(id, data);
    if (affectedRows === 0) throw new Error('Không tìm thấy nhà cung cấp');
    return affectedRows;
  }

  async deleteSupplier(id) {
    const affectedRows = await SupplierRepository.delete(id);
    if (affectedRows === 0) throw new Error('Không tìm thấy nhà cung cấp');
    return affectedRows;
  }
}

export default new SupplierService();
