import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  fundId: {
    type: String,
    required: true,
    index: true
  },
  donor: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  amount: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Compound index cho việc query lịch sử của user hoặc của fund
donationSchema.index({ donor: 1, timestamp: -1 });
donationSchema.index({ fundId: 1, timestamp: -1 });

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
