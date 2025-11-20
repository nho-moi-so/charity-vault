import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  // Thông tin bổ sung (optional)
  username: {
    type: String,
    sparse: true, // Cho phép null nhưng unique nếu có
    trim: true
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  // Thống kê
  totalFundsCreated: {
    type: Number,
    default: 0
  },
  totalDonated: {
    type: String, // Lưu dạng string để tránh mất precision
    default: '0'
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index
userSchema.index({ address: 1 });
userSchema.index({ username: 1 }, { sparse: true });

const User = mongoose.model('User', userSchema);

export default User;

