import DashboardRepository from '../repositories/DashboardRepository.js';

class DashboardService {
  async getDashboardStats(range) {
    const stats = await DashboardRepository.getStats(range);
    const chart = await DashboardRepository.getChartData(range);
    const recent = await DashboardRepository.getRecentTransactions();
    return { stats, chart, recent };
  }
}

export default new DashboardService();
