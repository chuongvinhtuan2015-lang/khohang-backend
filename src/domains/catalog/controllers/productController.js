import ProductService from '../services/ProductService.js';

export const getProducts = async (req, res) => {
  try {
    const query = req.query;
    res.json(await ProductService.getAllProducts(query));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.json(product);
  } catch (e) {
    if (e.message === 'Không tìm thấy sản phẩm') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message });
  }
};

export const createProduct = async (req, res) => {
  const startTime = performance.now();
  try {
    const id = await ProductService.createProduct(req.body);
    res.status(201).json({ id, message: 'Tạo sản phẩm thành công' });
    const endTime = performance.now();
    console.log(`Thời gian tạo sản phẩm: ${endTime - startTime}ms`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    await ProductService.updateProduct(req.params.id, req.body);
    res.json({ message: 'Cập nhật thành công' });
  } catch (e) {
    if (e.message === 'Không tìm thấy sản phẩm') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.json({ message: 'Xóa thành công' });
  } catch (e) {
    if (e.message === 'Không tìm thấy sản phẩm') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message });
  }
};
