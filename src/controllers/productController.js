import Product from '../models/productModel.js';

export const getProducts = async (req, res) => {
  try {
    const { search, category_id, page, limit } = req.query;
    const result = await Product.getAll({ search, category_id, page, limit });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProductId = await Product.create(req.body);
    res.status(201).json({ id: newProductId, message: 'Thêm sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const affectedRows = await Product.update(req.params.id, req.body);
    if (affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const affectedRows = await Product.delete(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
