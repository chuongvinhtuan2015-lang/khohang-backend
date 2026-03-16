import Supplier from '../models/supplierModel.js';

export const getSuppliers = async (req, res) => {
  try { res.json(await Supplier.getAll()); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.getById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp' });
    res.json(supplier);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const createSupplier = async (req, res) => {
  try {
    const id = await Supplier.create(req.body);
    res.status(201).json({ id, message: 'Tạo nhà cung cấp thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const updateSupplier = async (req, res) => {
  try {
    const rows = await Supplier.update(req.params.id, req.body);
    if (rows === 0) return res.status(404).json({ message: 'Không tìm thấy NCC' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteSupplier = async (req, res) => {
  try {
    const rows = await Supplier.delete(req.params.id);
    if (rows === 0) return res.status(404).json({ message: 'Không tìm thấy NCC' });
    res.json({ message: 'Xóa thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
