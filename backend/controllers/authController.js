import User from '../models/User.js';
import { ethers } from 'ethers';

class AuthController {
  // Kết nối ví = "Đăng nhập" (Web3 style)
  // Frontend sẽ gửi địa chỉ ví và signature để verify
  async connectWallet(req, res) {
    try {
      const { address, signature, message } = req.body;

      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }

      // Verify signature (optional - để đảm bảo user thực sự sở hữu ví)
      if (signature && message) {
        try {
          const recoveredAddress = ethers.verifyMessage(message, signature);
          if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid signature' });
          }
        } catch (error) {
          return res.status(401).json({ error: 'Signature verification failed' });
        }
      }

      // Tìm hoặc tạo user
      let user = await User.findOne({ address: address.toLowerCase() });

      if (!user) {
        // Tự động tạo user mới khi lần đầu kết nối
        user = await User.create({
          address: address.toLowerCase(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        user.updatedAt = new Date();
        await user.save();
      }

      res.json({
        success: true,
        user: {
          address: user.address,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          totalFundsCreated: user.totalFundsCreated,
          totalDonated: user.totalDonated
        }
      });
    } catch (error) {
      console.error('Error in connectWallet:', error);
      res.status(500).json({ error: 'Failed to connect wallet' });
    }
  }

  // Cập nhật profile (sau khi đã kết nối ví)
  async updateProfile(req, res) {
    try {
      const { address } = req.body;
      const { username, email, avatar, bio } = req.body;

      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }

      const user = await User.findOne({ address: address.toLowerCase() });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Cập nhật thông tin
      if (username !== undefined) user.username = username;
      if (email !== undefined) user.email = email;
      if (avatar !== undefined) user.avatar = avatar;
      if (bio !== undefined) user.bio = bio;
      user.updatedAt = new Date();

      await user.save();

      res.json({
        success: true,
        user: {
          address: user.address,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          totalFundsCreated: user.totalFundsCreated,
          totalDonated: user.totalDonated
        }
      });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  // Lấy thông tin user
  async getUser(req, res) {
    try {
      const { address } = req.params;

      const user = await User.findOne({ address: address.toLowerCase() });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        user: {
          address: user.address,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          totalFundsCreated: user.totalFundsCreated,
          totalDonated: user.totalDonated,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Error in getUser:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  }

  // Lấy danh sách user (với pagination)
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const query = {};
      if (search) {
        query.$or = [
          { username: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v');

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error in getUsers:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  }
}

export default new AuthController();

