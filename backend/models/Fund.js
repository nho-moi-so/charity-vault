import mongoose from 'mongoose';

const fundSchema = new mongoose.Schema({
  fundId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  owner: {
    type: String,
    required: true,
    lowercase: true
  },
  title: {
    type: String,
    required: true
  },
  metadataURI: {
    type: String,
    default: ''
  },
  totalReceived: {
    type: String, // Lưu dạng string để tránh mất precision với BigNumber
    default: '0'
  },
  totalWithdrawn: {
    type: String,
    default: '0'
  },
  balance: {
    type: String,
    default: '0'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index để query nhanh
fundSchema.index({ owner: 1 });
fundSchema.index({ createdAt: -1 });

const Fund = mongoose.model('Fund', fundSchema);

export default Fund;

