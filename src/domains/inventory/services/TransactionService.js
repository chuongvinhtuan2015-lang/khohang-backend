import TransactionRepository from '../repositories/TransactionRepository.js';

class TransactionService {
  async getTransactions(query) {
    return await TransactionRepository.getAll(query);
  }

  async getTransactionById(id) {
    const transaction = await TransactionRepository.getById(id);
    if (!transaction) throw new Error('Không tìm thấy phiếu');
    const details = await TransactionRepository.getDetails(id);
    return { ...transaction, items: details };
  }

  async createTransaction(transactionData) {
    const { type, note, items, user_id } = transactionData;
    const transaction_code = await TransactionRepository.getNextCode(type);
    const id = await TransactionRepository.create({ transaction_code, type, user_id, note, items });
    return { id, transaction_code };
  }

  async deleteTransaction(id) {
    const affectedRows = await TransactionRepository.delete(id);
    if (affectedRows === 0) throw new Error('Không tìm thấy phiếu');
    return affectedRows;
  }
}

export default new TransactionService();
