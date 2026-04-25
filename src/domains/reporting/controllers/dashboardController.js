import DashboardService from '../services/DashboardService.js';

export const getDashboardStats = async (req, res) => {
  const startTime = performance.now();
  try {
    const { range = 'week' } = req.query;
    const result = await DashboardService.getDashboardStats(range);
    res.json(result);
    const endTime = performance.now();
    console.log(`Thời gian lấy thống kê: ${endTime - startTime}ms`);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
