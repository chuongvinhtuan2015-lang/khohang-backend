import Transaction from '../models/transactionModel.js';

export const getTransactions = async (req, res) => {
  try {
    const { type, search, page, limit } = req.query; // 'IN' or 'OUT'
    const result = await Transaction.getAll({ type, search, page, limit });
    res.json(result);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.getById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Không tìm thấy phiếu' });
    const details = await Transaction.getDetails(req.params.id);
    res.json({ ...transaction, items: details });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const createTransaction = async (req, res) => {
  try {
    const { type, note, items } = req.body;
    const userId = req.user.id; // Lấy ID người dùng từ token
    const transaction_code = await Transaction.getNextCode(type);
    const id = await Transaction.create({ transaction_code, type, user_id: userId, note, items });
    res.status(201).json({ id, transaction_code, message: 'Tạo phiếu thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteTransaction = async (req, res) => {
  try {
    const rows = await Transaction.delete(req.params.id);
    if (rows === 0) return res.status(404).json({ message: 'Không tìm thấy phiếu' });
    res.json({ message: 'Xóa phiếu thành công' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
