import ReportService from '../services/ReportService.js';

export const getGeneralReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const result = await ReportService.getGeneralReport(startDate, endDate);
    res.json(result);
  } catch (error) {
    if (error.message === 'Vui lòng cung cấp ngày bắt đầu và ngày kết thúc') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
