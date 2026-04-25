import TransactionService from '../services/TransactionService.js';

export const getTransactions = async (req, res) => {
  const startTime = performance.now();
  try {
    const { type, search, page, limit } = req.query;
    const result = await TransactionService.getTransactions({ type, search, page, limit });
    res.json(result);
    const endTime = performance.now();
    let label = type === 'IN' ? 'Nhập' : 'Xuất';
    console.log(`Thời gian lấy danh sách phiếu ${label}: ${endTime - startTime}ms`);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await TransactionService.getTransactionById(req.params.id);
    res.json(transaction);
  } catch (e) {
    if (e.message === 'Không tìm thấy phiếu') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { type, note, items } = req.body;
    const user_id = req.user.id;
    const { id, transaction_code } = await TransactionService.createTransaction({ type, note, items, user_id });
    res.status(201).json({ id, transaction_code, message: 'Tạo phiếu thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteTransaction = async (req, res) => {
  try {
    await TransactionService.deleteTransaction(req.params.id);
    res.json({ message: 'Xóa phiếu thành công' });
  } catch (e) {
    if (e.message === 'Không tìm thấy phiếu') return res.status(404).json({ message: e.message });
    res.status(500).json({ message: e.message });
  }
};
