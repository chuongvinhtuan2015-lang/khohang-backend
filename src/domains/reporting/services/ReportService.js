import ReportRepository from '../repositories/ReportRepository.js';

class ReportService {
  async getGeneralReport(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new Error('Vui lòng cung cấp ngày bắt đầu và ngày kết thúc');
    }

    const [summary, categoryStats, topProducts, slowProducts, dailyStats, transactionsLog] = await Promise.all([
      ReportRepository.getRevenueStats(startDate, endDate),
      ReportRepository.getCategoryStats(startDate, endDate),
      ReportRepository.getTopProducts(startDate, endDate),
      ReportRepository.getSlowProducts(startDate, endDate),
      ReportRepository.getDailyStats(startDate, endDate),
      ReportRepository.getTransactionsLog(startDate, endDate)
    ]);

    return {
      summary,
      categoryStats,
      topProducts,
      slowProducts,
      dailyStats,
      transactionsLog
    };
  }
}

export default new ReportService();
