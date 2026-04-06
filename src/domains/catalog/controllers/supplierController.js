import SupplierService from '../services/SupplierService.js';

export const getSuppliers = async (req, res) => {
  try { res.json(await SupplierService.getAllSuppliers()); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await SupplierService.getSupplierById(req.params.id);
    res.json(supplier);
  } catch (e) { 
    if (e.message === 'Không tìm thấy nhà cung cấp') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message }); 
  }
};

export const createSupplier = async (req, res) => {
  try {
    const id = await SupplierService.createSupplier(req.body);
    res.status(201).json({ id, message: 'Tạo nhà cung cấp thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const updateSupplier = async (req, res) => {
  try {
    await SupplierService.updateSupplier(req.params.id, req.body);
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { 
    if (e.message === 'Không tìm thấy nhà cung cấp') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message }); 
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    await SupplierService.deleteSupplier(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (e) { 
    if (e.message === 'Không tìm thấy nhà cung cấp') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message }); 
  }
};
