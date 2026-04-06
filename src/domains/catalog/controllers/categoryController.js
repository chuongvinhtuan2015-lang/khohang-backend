import CategoryService from '../services/CategoryService.js';

export const getCategories = async (req, res) => {
  try { res.json(await CategoryService.getAllCategories()); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.id);
    res.json(category);
  } catch (e) { 
    if (e.message === 'Không tìm thấy danh mục') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message }); 
  }
};

export const createCategory = async (req, res) => {
  try {
    const id = await CategoryService.createCategory(req.body);
    res.status(201).json({ id, message: 'Tạo danh mục thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const updateCategory = async (req, res) => {
  try {
    await CategoryService.updateCategory(req.params.id, req.body);
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) { 
    if (e.message === 'Không tìm thấy danh mục') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message }); 
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await CategoryService.deleteCategory(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (e) { 
    if (e.message === 'Không tìm thấy danh mục') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message }); 
  }
};
