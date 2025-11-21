import Donation from '../models/Donation.js';
import Fund from '../models/Fund.js';

class DonationController {
  // Lấy lịch sử giao dịch của user
  async getUserDonations(req, res) {
    try {
      const { address } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }

      const query = { donor: address.toLowerCase() };

      const donations = await Donation.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Donation.countDocuments(query);

      // Enrich data với thông tin quỹ (nếu cần hiển thị tên quỹ)
      const enrichedDonations = await Promise.all(donations.map(async (donation) => {
        const fund = await Fund.findOne({ fundId: donation.fundId }).select('title');
        return {
          ...donation.toObject(),
          fundTitle: fund ? fund.title : `Fund #${donation.fundId}`
        };
      }));

      res.json({
        success: true,
        donations: enrichedDonations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error in getUserDonations:', error);
      res.status(500).json({ error: 'Failed to get user donations' });
    }
  }

  // Lấy lịch sử giao dịch của quỹ (optional, cho tương lai)
  async getFundDonations(req, res) {
    try {
      const { fundId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const query = { fundId: fundId.toString() };

      const donations = await Donation.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Donation.countDocuments(query);

      res.json({
        success: true,
        donations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error in getFundDonations:', error);
      res.status(500).json({ error: 'Failed to get fund donations' });
    }
  }
}

export default new DonationController();
