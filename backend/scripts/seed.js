import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Fund from '../models/Fund.js';
import { ethers } from 'ethers';

dotenv.config();

const sampleFunds = [
  {
    fundId: '0',
    owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'.toLowerCase(),
    title: 'Ủng hộ miền Trung lũ lụt',
    metadataURI: 'ipfs://QmXxx...',
    totalReceived: ethers.parseEther('5.5').toString(),
    totalWithdrawn: ethers.parseEther('2.0').toString(),
    balance: ethers.parseEther('3.5').toString(),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    fundId: '1',
    owner: '0x8ba1f109551bD432803012645Hac136c22C9e'.toLowerCase(),
    title: 'Giúp đỡ trẻ em mồ côi',
    metadataURI: 'ipfs://QmYyy...',
    totalReceived: ethers.parseEther('10.2').toString(),
    totalWithdrawn: ethers.parseEther('0').toString(),
    balance: ethers.parseEther('10.2').toString(),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  },
  {
    fundId: '2',
    owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'.toLowerCase(),
    title: 'Xây dựng trường học vùng cao',
    metadataURI: 'ipfs://QmZzz...',
    totalReceived: ethers.parseEther('25.8').toString(),
    totalWithdrawn: ethers.parseEther('15.0').toString(),
    balance: ethers.parseEther('10.8').toString(),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-25')
  },
  {
    fundId: '3',
    owner: '0x9cA8eF8bB19c77C4d8F3B2a5E6D7F8A9B0C1D2E'.toLowerCase(),
    title: 'Hỗ trợ người già neo đơn',
    metadataURI: 'ipfs://QmAaa...',
    totalReceived: ethers.parseEther('3.2').toString(),
    totalWithdrawn: ethers.parseEther('1.5').toString(),
    balance: ethers.parseEther('1.7').toString(),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05')
  },
  {
    fundId: '4',
    owner: '0x8ba1f109551bD432803012645Hac136c22C9e'.toLowerCase(),
    title: 'Cứu trợ thiên tai',
    metadataURI: 'ipfs://QmBbb...',
    totalReceived: ethers.parseEther('50.0').toString(),
    totalWithdrawn: ethers.parseEther('30.0').toString(),
    balance: ethers.parseEther('20.0').toString(),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-20')
  },
  {
    fundId: '5',
    owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'.toLowerCase(),
    title: 'Bảo vệ môi trường',
    metadataURI: 'ipfs://QmCcc...',
    totalReceived: ethers.parseEther('7.5').toString(),
    totalWithdrawn: ethers.parseEther('0').toString(),
    balance: ethers.parseEther('7.5').toString(),
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-18')
  },
  {
    fundId: '6',
    owner: '0x1a2B3c4D5e6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B'.toLowerCase(),
    title: 'Hỗ trợ bệnh nhân ung thư',
    metadataURI: 'ipfs://QmDdd...',
    totalReceived: ethers.parseEther('15.3').toString(),
    totalWithdrawn: ethers.parseEther('8.0').toString(),
    balance: ethers.parseEther('7.3').toString(),
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-25')
  },
  {
    fundId: '7',
    owner: '0x8ba1f109551bD432803012645Hac136c22C9e'.toLowerCase(),
    title: 'Giáo dục cho trẻ em nghèo',
    metadataURI: 'ipfs://QmEee...',
    totalReceived: ethers.parseEther('12.6').toString(),
    totalWithdrawn: ethers.parseEther('5.0').toString(),
    balance: ethers.parseEther('7.6').toString(),
    createdAt: new Date('2024-03-22'),
    updatedAt: new Date('2024-03-28')
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Clearing existing funds...');
    await Fund.deleteMany({});

    console.log('Seeding database with sample funds...');
    const createdFunds = await Fund.insertMany(sampleFunds);

    console.log(`✅ Successfully seeded ${createdFunds.length} funds!`);
    console.log('\n📊 Sample funds created:');
    createdFunds.forEach((fund, index) => {
      console.log(`${index + 1}. ${fund.title}`);
      console.log(`   Fund ID: ${fund.fundId}`);
      console.log(`   Owner: ${fund.owner}`);
      console.log(`   Total Received: ${ethers.formatEther(fund.totalReceived)} ETH`);
      console.log(`   Balance: ${ethers.formatEther(fund.balance)} ETH`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

