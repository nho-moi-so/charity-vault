import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import { ethers } from 'ethers';

dotenv.config();

const sampleUsers = [
  {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'.toLowerCase(),
    username: 'charity_hero',
    email: 'hero@charity.org',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Người yêu thích giúp đỡ cộng đồng và tạo ra những thay đổi tích cực',
    totalFundsCreated: 3,
    totalDonated: ethers.parseEther('15.5').toString(),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-20')
  },
  {
    address: '0x8ba1f109551bD432803012645Hac136c22C9e'.toLowerCase(),
    username: 'helping_hand',
    email: 'helping@charity.org',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Chuyên hỗ trợ các dự án giáo dục và phát triển cộng đồng',
    totalFundsCreated: 2,
    totalDonated: ethers.parseEther('8.2').toString(),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-15')
  },
  {
    address: '0x9cA8eF8bB19c77C4d8F3B2a5E6D7F8A9B0C1D2E'.toLowerCase(),
    username: 'care_giver',
    email: 'care@charity.org',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Tập trung vào chăm sóc người già và trẻ em có hoàn cảnh khó khăn',
    totalFundsCreated: 1,
    totalDonated: ethers.parseEther('3.2').toString(),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-05')
  },
  {
    address: '0x1a2B3c4D5e6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B'.toLowerCase(),
    username: 'health_advocate',
    email: 'health@charity.org',
    avatar: 'https://i.pravatar.cc/150?img=4',
    bio: 'Hỗ trợ các chương trình y tế và sức khỏe cộng đồng',
    totalFundsCreated: 1,
    totalDonated: ethers.parseEther('5.0').toString(),
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-20')
  },
  {
    address: '0x2b3C4d5E6f7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C'.toLowerCase(),
    username: 'education_lover',
    email: 'edu@charity.org',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Tin tưởng vào sức mạnh của giáo dục để thay đổi cuộc sống',
    totalFundsCreated: 0,
    totalDonated: ethers.parseEther('12.6').toString(),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-22')
  },
];

const seedUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Clearing existing users...');
    await User.deleteMany({});

    console.log('Seeding database with sample users...');
    const createdUsers = await User.insertMany(sampleUsers);

    console.log(`✅ Successfully seeded ${createdUsers.length} users!`);
    console.log('\n📊 Sample users created:');
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username || 'No username'}`);
      console.log(`   Address: ${user.address}`);
      console.log(`   Email: ${user.email || 'No email'}`);
      console.log(`   Funds Created: ${user.totalFundsCreated}`);
      console.log(`   Total Donated: ${ethers.formatEther(user.totalDonated)} ETH`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();

