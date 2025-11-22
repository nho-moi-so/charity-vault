import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database.js";
import Fund from "../models/Fund.js";
import { ethers } from "ethers";

dotenv.config();

// Danh sách tên quỹ mẫu
const fundTitles = [
  "Ủng hộ miền Trung lũ lụt",
  "Giúp đỡ trẻ em mồ côi",
  "Xây dựng trường học vùng cao",
  "Hỗ trợ người già neo đơn",
  "Cứu trợ thiên tai",
  "Bảo vệ môi trường",
  "Hỗ trợ bệnh nhân ung thư",
  "Giáo dục cho trẻ em nghèo",
  "Xây dựng cầu đường nông thôn",
  "Hỗ trợ người khuyết tật",
  "Bảo tồn di sản văn hóa",
  "Phát triển nông nghiệp bền vững",
  "Hỗ trợ phụ nữ khởi nghiệp",
  "Chăm sóc sức khỏe cộng đồng",
  "Bảo vệ động vật hoang dã",
];

// Tạo địa chỉ ví ngẫu nhiên (mock)
const generateRandomAddress = () => {
  const chars = "0123456789abcdef";
  let address = "0x";
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address.toLowerCase();
};

// Tạo số ngẫu nhiên trong khoảng
const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Tạo ngày ngẫu nhiên trong khoảng
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const generateRandomFunds = async (count = 10) => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log(`Generating ${count} random funds...`);

    const funds = [];
    const startDate = new Date("2024-01-01");
    const endDate = new Date();

    for (let i = 0; i < count; i++) {
      const totalReceived = randomBetween(1, 100); // 1-100 ETH
      const totalWithdrawn = randomBetween(0, totalReceived * 0.7); // 0-70% của totalReceived
      const balance = totalReceived - totalWithdrawn;

      const createdAt = randomDate(startDate, endDate);
      const updatedAt = randomDate(createdAt, endDate);

      // Random category
      const categories = [
        "Giáo dục",
        "Y tế",
        "Thiên tai",
        "Trẻ em",
        "Người già",
        "Môi trường",
        "Động vật",
      ];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      // Random images (placeholder)
      const randomImageId = Math.floor(Math.random() * 1000);
      const mainImage = `https://picsum.photos/id/${randomImageId}/800/400`;

      funds.push({
        fundId: 2000 + i, // Start from 2000 to avoid conflict with manual seed
        owner: generateRandomAddress(),
        title:
          fundTitles[Math.floor(Math.random() * fundTitles.length)] +
          ` #${i + 1}`,
        metadataURI: `mock-uri-${i}`,
        description:
          "Mô tả ngắn gọn về quỹ từ thiện này. Chúng tôi cam kết minh bạch và hiệu quả.",
        fullDescription:
          "Đây là mô tả chi tiết về mục đích, kế hoạch và đối tượng thụ hưởng của quỹ. Mọi đóng góp sẽ được cập nhật công khai trên hệ thống blockchain.",
        category: [randomCategory],
        goal: Math.floor(randomBetween(100, 1000)) * 1000000, // 100M - 1B VND
        startDate: createdAt,
        endDate: new Date(createdAt.getTime() + 90 * 24 * 60 * 60 * 1000), // +90 days
        images: {
          main: mainImage,
          thumbnails: [
            `https://picsum.photos/id/${randomImageId + 1}/200/200`,
            `https://picsum.photos/id/${randomImageId + 2}/200/200`,
          ],
        },
        creatorInfo: {
          name: `Người gây quỹ #${i + 1}`,
          email: `user${i}@example.com`,
          organization: "Tổ chức Từ thiện ABC",
        },
        bankAccount: {
          accountName: "QUY TU THIEN",
          accountNumber: "000000" + i,
          bank: "MBBank",
        },
        totalReceived: ethers.parseEther(totalReceived.toFixed(4)).toString(),
        totalWithdrawn: ethers.parseEther(totalWithdrawn.toFixed(4)).toString(),
        balance: ethers.parseEther(balance.toFixed(4)).toString(),
        createdAt,
        updatedAt,
      });
    }

    console.log("Clearing existing funds...");
    await Fund.deleteMany({});

    console.log("Inserting random funds...");
    const createdFunds = await Fund.insertMany(funds);

    console.log(`✅ Successfully created ${createdFunds.length} random funds!`);
    console.log("\n📊 Sample of created funds:");
    createdFunds.slice(0, 5).forEach((fund, index) => {
      console.log(`${index + 1}. ${fund.title}`);
      console.log(`   Fund ID: ${fund.fundId}`);
      console.log(
        `   Total Received: ${ethers.formatEther(fund.totalReceived)} ETH`
      );
      console.log(`   Balance: ${ethers.formatEther(fund.balance)} ETH`);
      console.log("");
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error generating random funds:", error);
    process.exit(1);
  }
};

// Lấy số lượng từ command line argument
const count = process.argv[2] ? parseInt(process.argv[2]) : 10;
generateRandomFunds(count);
