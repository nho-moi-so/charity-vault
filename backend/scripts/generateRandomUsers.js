import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import { ethers } from 'ethers';

dotenv.config();

const usernames = [
  'charity_hero', 'helping_hand', 'care_giver', 'health_advocate',
  'education_lover', 'environment_guardian', 'disaster_relief',
  'community_builder', 'hope_giver', 'kind_heart', 'generous_soul',
  'compassionate', 'supportive_friend', 'change_maker', 'impact_creator'
];

const bios = [
  'Người yêu thích giúp đỡ cộng đồng',
  'Chuyên hỗ trợ các dự án giáo dục',
  'Tập trung vào chăm sóc người già và trẻ em',
  'Hỗ trợ các chương trình y tế',
  'Tin tưởng vào sức mạnh của giáo dục',
  'Bảo vệ môi trường và phát triển bền vững',
  'Cứu trợ khẩn cấp cho các vùng bị thiên tai',
  'Xây dựng cộng đồng mạnh mẽ',
  'Tạo ra những thay đổi tích cực',
  'Lan tỏa yêu thương và lòng tốt'
];

// Tạo địa chỉ ví ngẫu nhiên (mock)
const generateRandomAddress = () => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address.toLowerCase();
};

// Tạo email ngẫu nhiên
const generateRandomEmail = (username) => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'charity.org', 'example.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
};

// Tạo số ngẫu nhiên trong khoảng
const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Tạo ngày ngẫu nhiên trong khoảng
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateRandomUsers = async (count = 10) => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log(`Generating ${count} random users...`);

    const users = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date();
    const usedUsernames = new Set();

    for (let i = 0; i < count; i++) {
      // Tạo username unique
      let username;
      do {
        username = usernames[Math.floor(Math.random() * usernames.length)] + 
                   (Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : '');
      } while (usedUsernames.has(username));
      usedUsernames.add(username);

      const totalFundsCreated = Math.floor(randomBetween(0, 5));
      const totalDonated = randomBetween(0, 100); // 0-100 ETH

      const createdAt = randomDate(startDate, endDate);
      const updatedAt = randomDate(createdAt, endDate);

      users.push({
        address: generateRandomAddress(),
        username: username,
        email: generateRandomEmail(username),
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
        bio: bios[Math.floor(Math.random() * bios.length)],
        totalFundsCreated: totalFundsCreated,
        totalDonated: ethers.parseEther(totalDonated.toFixed(4)).toString(),
        createdAt,
        updatedAt
      });
    }

    console.log('Clearing existing users...');
    await User.deleteMany({});

    console.log('Inserting random users...');
    const createdUsers = await User.insertMany(users);

    console.log(`✅ Successfully created ${createdUsers.length} random users!`);
    console.log('\n📊 Sample of created users:');
    createdUsers.slice(0, 5).forEach((user, index) => {
      console.log(`${index + 1}. ${user.username}`);
      console.log(`   Address: ${user.address}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Funds Created: ${user.totalFundsCreated}`);
      console.log(`   Total Donated: ${ethers.formatEther(user.totalDonated)} ETH`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating random users:', error);
    process.exit(1);
  }
};

// Lấy số lượng từ command line argument
const count = process.argv[2] ? parseInt(process.argv[2]) : 10;
generateRandomUsers(count);

