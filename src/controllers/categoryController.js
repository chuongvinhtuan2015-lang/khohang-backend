import Category from '../models/categoryModel.js';

export const getCategories = async (req, res) => {
  try { res.json(await Category.getAll()); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.getById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    res.json(category);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const createCategory = async (req, res) => {
  try {
    const id = await Category.create(req.body);
    res.status(201).json({ id, message: 'Tạo danh mục thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const updateCategory = async (req, res) => {
  try {
    const rows = await Category.update(req.params.id, req.body);
    if (rows === 0) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteCategory = async (req, res) => {
  try {
    const rows = await Category.delete(req.params.id);
    if (rows === 0) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    res.json({ message: 'Xóa thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
