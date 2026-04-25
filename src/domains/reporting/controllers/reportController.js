import ReportService from '../services/ReportService.js';

export const getGeneralReport = async (req, res) => {
  const startTime = performance.now();
  try {
    const { startDate, endDate } = req.query;
    
    const result = await ReportService.getGeneralReport(startDate, endDate);
    res.json(result);
    const endTime = performance.now();
    console.log(`Thời gian lấy báo cáo: ${endTime - startTime}ms`);
  } catch (error) {
    if (error.message === 'Vui lòng cung cấp ngày bắt đầu và ngày kết thúc') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
