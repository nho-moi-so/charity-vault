import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database.js";
import Fund from "../models/Fund.js";
import { ethers } from "ethers";

dotenv.config();

const sampleFunds = [
  {
    fundId: 1001,
    owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb".toLowerCase(),
    title: "Ủng hộ miền Trung lũ lụt",
    metadataURI: "mock-uri",
    description: "Hỗ trợ đồng bào miền Trung khắc phục hậu quả sau bão lũ.",
    fullDescription:
      "Cơn bão số 9 vừa qua đã gây thiệt hại nặng nề cho đồng bào miền Trung. Hàng ngàn ngôi nhà bị tốc mái, hoa màu bị hư hại. Chúng tôi kêu gọi sự chung tay của cộng đồng để giúp đỡ bà con sớm ổn định cuộc sống.",
    category: ["Cứu trợ khẩn cấp", "Thiên tai"],
    goal: 500000000,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-04-15"),
    images: {
      main: "https://media.vov.vn/sites/default/files/styles/large/public/2020-10/lu_lut_mien_trung_1.jpg",
      thumbnails: [
        "https://media.vov.vn/sites/default/files/styles/large/public/2020-10/lu_lut_mien_trung_2.jpg",
        "https://cdn.tuoitre.vn/thumb_w/586/2020/10/19/img-16030769782471733136287.jpg",
      ],
    },
    creatorInfo: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0912345678",
      organization: "Hội Chữ Thập Đỏ",
      address: "Hà Nội",
    },
    bankAccount: {
      accountName: "QUY CUU TRO MIEN TRUNG",
      accountNumber: "123456789",
      bank: "Vietcombank",
      branch: "Sở Giao Dịch",
    },
    totalReceived: ethers.parseEther("5.5").toString(),
    totalWithdrawn: ethers.parseEther("2.0").toString(),
    balance: ethers.parseEther("3.5").toString(),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    fundId: 1002,
    owner: "0x8ba1f109551bD432803012645Hac136c22C9e".toLowerCase(),
    title: "Giúp đỡ trẻ em mồ côi",
    metadataURI: "mock-uri",
    description: "Mang lại mái ấm và cơ hội học tập cho trẻ em mồ côi.",
    fullDescription:
      "Dự án nhằm mục đích xây dựng khu nội trú và cung cấp học bổng cho 50 trẻ em mồ côi tại mái ấm Tình Thương. Mọi sự đóng góp sẽ được sử dụng minh bạch và hiệu quả.",
    category: ["Trẻ em", "Giáo dục"],
    goal: 200000000,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-05-01"),
    images: {
      main: "https://file1.dangcongsan.vn/data/0/images/2023/05/31/upload_2666/tre-em-mo-coi.jpg",
      thumbnails: [],
    },
    creatorInfo: {
      name: "Trần Thị B",
      email: "tranthib@example.com",
      organization: "Mái ấm Tình Thương",
    },
    totalReceived: ethers.parseEther("10.2").toString(),
    totalWithdrawn: ethers.parseEther("0").toString(),
    balance: ethers.parseEther("10.2").toString(),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    fundId: 1003,
    owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb".toLowerCase(),
    title: "Xây dựng trường học vùng cao",
    metadataURI: "mock-uri",
    description: "Xây dựng điểm trường mới cho các em nhỏ tại Hà Giang.",
    fullDescription:
      "Điểm trường hiện tại đã xuống cấp trầm trọng, gây nguy hiểm cho học sinh và giáo viên. Chúng tôi dự kiến xây dựng 3 phòng học mới kiên cố và 1 khu vệ sinh.",
    category: ["Giáo dục", "Xây dựng"],
    goal: 800000000,
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-08-15"),
    images: {
      main: "https://baohatinh.vn/dataimages/201909/original/images5377643_truong_hoc_vung_cao.jpg",
      thumbnails: [],
    },
    creatorInfo: {
      name: "Lê Văn C",
      organization: "Nhóm Thiện Nguyện Vùng Cao",
    },
    totalReceived: ethers.parseEther("25.8").toString(),
    totalWithdrawn: ethers.parseEther("15.0").toString(),
    balance: ethers.parseEther("10.8").toString(),
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-25"),
  },
  {
    fundId: 1004,
    owner: "0x9cA8eF8bB19c77C4d8F3B2a5E6D7F8A9B0C1D2E".toLowerCase(),
    title: "Hỗ trợ người già neo đơn",
    metadataURI: "mock-uri",
    description: "Cung cấp thực phẩm và thuốc men cho người già neo đơn.",
    fullDescription:
      'Chương trình "Bữa cơm nghĩa tình" mang đến những bữa ăn nóng hổi và chăm sóc y tế cơ bản cho các cụ già không nơi nương tựa.',
    category: ["Người già", "Y tế"],
    goal: 100000000,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-06-01"),
    images: {
      main: "https://cdn.thuvienphapluat.vn/uploads/tintuc/2023/08/11/nguoi-cao-tuoi-neo-don.jpg",
      thumbnails: [],
    },
    creatorInfo: {
      name: "Phạm Thị D",
      organization: "CLB Tình Nguyện Trẻ",
    },
    totalReceived: ethers.parseEther("3.2").toString(),
    totalWithdrawn: ethers.parseEther("1.5").toString(),
    balance: ethers.parseEther("1.7").toString(),
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-05"),
  },
  {
    fundId: 1005,
    owner: "0x8ba1f109551bD432803012645Hac136c22C9e".toLowerCase(),
    title: "Phẫu thuật tim cho em",
    metadataURI: "mock-uri",
    description: "Tài trợ chi phí phẫu thuật tim bẩm sinh cho trẻ em nghèo.",
    fullDescription:
      "Mỗi ca phẫu thuật là một cơ hội sống. Hãy cùng chúng tôi mang lại nhịp đập khỏe mạnh cho những trái tim bé bỏng.",
    category: ["Y tế", "Trẻ em"],
    goal: 1000000000,
    startDate: new Date("2024-03-10"),
    endDate: new Date("2024-12-31"),
    images: {
      main: "https://vtv1.mediacdn.vn/thumb_w/650/2020/10/13/tim-bam-sinh-16025586830561558666511.jpg",
      thumbnails: [],
    },
    creatorInfo: {
      name: "Dr. Nguyen",
      organization: "Quỹ Nhịp Tim Việt Nam",
    },
    totalReceived: ethers.parseEther("50.0").toString(),
    totalWithdrawn: ethers.parseEther("30.0").toString(),
    balance: ethers.parseEther("20.0").toString(),
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-20"),
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log("Clearing existing funds...");
    await Fund.deleteMany({});

    console.log("Seeding database with sample funds...");
    const createdFunds = await Fund.insertMany(sampleFunds);

    console.log(`✅ Successfully seeded ${createdFunds.length} funds!`);
    console.log("\n📊 Sample funds created:");
    createdFunds.forEach((fund, index) => {
      console.log(`${index + 1}. ${fund.title}`);
      console.log(`   Fund ID: ${fund.fundId}`);
      console.log(`   Owner: ${fund.owner}`);
      console.log(
        `   Total Received: ${ethers.formatEther(fund.totalReceived)} ETH`
      );
      console.log(`   Balance: ${ethers.formatEther(fund.balance)} ETH`);
      console.log("");
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
