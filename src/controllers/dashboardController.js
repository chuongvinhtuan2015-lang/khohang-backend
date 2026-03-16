import Dashboard from '../models/dashboardModel.js';

export const getDashboardStats = async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    const stats = await Dashboard.getStats(range);
    const chart = await Dashboard.getChartData(range);
    const recent = await Dashboard.getRecentTransactions();
    res.json({ stats, chart, recent });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
