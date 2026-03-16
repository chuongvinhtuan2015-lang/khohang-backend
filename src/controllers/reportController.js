import Report from '../models/reportModel.js';

export const getGeneralReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Vui lòng cung cấp ngày bắt đầu và ngày kết thúc' });
    }

    const [summary, categoryStats, topProducts, slowProducts, dailyStats, transactionsLog] = await Promise.all([
      Report.getRevenueStats(startDate, endDate),
      Report.getCategoryStats(startDate, endDate),
      Report.getTopProducts(startDate, endDate),
      Report.getSlowProducts(startDate, endDate),
      Report.getDailyStats(startDate, endDate),
      Report.getTransactionsLog(startDate, endDate)
    ]);

    res.json({
      summary,
      categoryStats,
      topProducts,
      slowProducts,
      dailyStats,
      transactionsLog
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
