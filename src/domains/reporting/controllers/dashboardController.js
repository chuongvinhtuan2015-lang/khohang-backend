import DashboardService from '../services/DashboardService.js';

export const getDashboardStats = async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    const result = await DashboardService.getDashboardStats(range);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
