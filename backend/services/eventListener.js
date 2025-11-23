import {
  contractReadOnly,
  provider,
  CONTRACT_ADDRESS,
} from "../config/contract.js";
import Fund from "../models/Fund.js";
import Donation from "../models/Donation.js";
import { ethers } from "ethers";

class EventListener {
  constructor() {
    this.isListening = false;
  }

  async startListening() {
    if (this.isListening || !contractReadOnly) {
      console.log("Event listener already running or contract not initialized");
      return;
    }

    this.isListening = true;
    console.log("Starting event listener...");

    // Lắng nghe FundCreated
    contractReadOnly.on(
      "FundCreated",
      async (fundId, owner, title, metadataURI, event) => {
        try {
          const fundIdNum = fundId.toString();
          console.log(`FundCreated event: ${fundIdNum} by ${owner}`);

          // Kiểm tra xem fund đã tồn tại với đầy đủ thông tin chưa
          const existingFund = await Fund.findOne({ fundId: fundIdNum });
          if (existingFund && existingFund.images && existingFund.images.main) {
            console.log(
              `Fund ${fundIdNum} already exists with complete data, skipping event sync`
            );
            return;
          }

          // Lấy thông tin đầy đủ từ blockchain
          const balance = await contractReadOnly.fundBalance(fundId);

          // Helper parse metadata
          let additionalData = {};
          try {
            if (metadataURI) {
              const metadata = JSON.parse(metadataURI);
              additionalData = {
                description: metadata.description || "",
                fullDescription: metadata.fullDescription || "",
                category: metadata.category || [],
                goal: Number(metadata.goal) || 0,
                startDate: metadata.startDate
                  ? new Date(metadata.startDate)
                  : null,
                endDate: metadata.endDate ? new Date(metadata.endDate) : null,
                images: {
                  main: metadata.images?.main || "",
                  thumbnails: metadata.images?.thumbnails || [],
                },
                bankAccount: metadata.bankAccount || {},
                creatorInfo: metadata.creator || {},
              };
            }
          } catch (e) {
            console.warn("Failed to parse metadataURI:", e.message);
          }

          await Fund.findOneAndUpdate(
            { fundId: fundIdNum },
            {
              fundId: fundIdNum,
              owner: owner.toLowerCase(),
              title,
              metadataURI,
              ...additionalData,
              totalReceived: "0",
              totalWithdrawn: "0",
              balance: balance.toString(),
              updatedAt: new Date(),
            },
            { upsert: true, new: true }
          );

          console.log(`Fund ${fundIdNum} synced to database via event`);
        } catch (error) {
          console.error("Error processing FundCreated event:", error);
        }
      }
    );

    // Lắng nghe DonationReceived
    contractReadOnly.on(
      "DonationReceived",
      async (fundId, donor, amount, event) => {
        try {
          const fundIdNum = fundId.toString();
          console.log(`DonationReceived event: ${amount} to fund ${fundIdNum}`);

          // 1. Lưu lịch sử giao dịch vào bảng Donation
          try {
            await Donation.create({
              transactionHash: event.log.transactionHash.toLowerCase(),
              fundId: fundIdNum,
              donor: donor.toLowerCase(),
              amount: amount.toString(),
              timestamp: new Date(),
            });
            console.log(`Donation recorded: ${event.log.transactionHash}`);
          } catch (err) {
            // Bỏ qua lỗi duplicate key nếu event được xử lý lại
            if (err.code !== 11000) {
              console.error("Error saving donation record:", err);
            }
          }

          // 2. Cập nhật Fund (logic cũ)
          const fundData = await contractReadOnly.getFund(fundId);
          const balance = await contractReadOnly.fundBalance(fundId);

          await Fund.findOneAndUpdate(
            { fundId: fundIdNum },
            {
              totalReceived: fundData.totalReceived.toString(),
              balance: balance.toString(),
              updatedAt: new Date(),
            }
          );

          console.log(`Fund ${fundIdNum} donation synced`);
        } catch (error) {
          console.error("Error processing DonationReceived event:", error);
        }
      }
    );

    // Lắng nghe FundsWithdrawn
    contractReadOnly.on(
      "FundsWithdrawn",
      async (fundId, owner, amount, event) => {
        try {
          const fundIdNum = fundId.toString();
          console.log(`FundsWithdrawn event: ${amount} from fund ${fundIdNum}`);

          // Cập nhật từ blockchain
          const fundData = await contractReadOnly.getFund(fundId);
          const balance = await contractReadOnly.fundBalance(fundId);

          await Fund.findOneAndUpdate(
            { fundId: fundIdNum },
            {
              totalWithdrawn: fundData.totalWithdrawn.toString(),
              balance: balance.toString(),
              updatedAt: new Date(),
            }
          );

          console.log(`Fund ${fundIdNum} withdrawal synced`);
        } catch (error) {
          console.error("Error processing FundsWithdrawn event:", error);
        }
      }
    );

    // Sync lại tất cả quỹ hiện có khi khởi động
    await this.syncAllFunds();
  }

  async syncAllFunds() {
    if (!contractReadOnly) return;

    try {
      console.log("Syncing all existing funds...");
      const totalFunds = await contractReadOnly.totalFunds();
      const total = parseInt(totalFunds.toString());

      for (let i = 0; i < total; i++) {
        try {
          const fundData = await contractReadOnly.getFund(i);
          const balance = await contractReadOnly.fundBalance(i);

          // Helper parse metadata
          let additionalData = {};
          try {
            if (fundData.metadataURI) {
              const metadata = JSON.parse(fundData.metadataURI);
              additionalData = {
                description: metadata.description || "",
                fullDescription: metadata.fullDescription || "",
                category: metadata.category || [],
                goal: Number(metadata.goal) || 0,
                startDate: metadata.startDate
                  ? new Date(metadata.startDate)
                  : null,
                endDate: metadata.endDate ? new Date(metadata.endDate) : null,
                images: {
                  main: metadata.images?.main || "",
                  thumbnails: metadata.images?.thumbnails || [],
                },
                bankAccount: metadata.bankAccount || {},
                creatorInfo: metadata.creator || {},
              };
            }
          } catch (e) {
            // Ignore parse error for old data
          }

          await Fund.findOneAndUpdate(
            { fundId: i.toString() },
            {
              fundId: i.toString(),
              owner: fundData.owner.toLowerCase(),
              title: fundData.title,
              metadataURI: fundData.metadataURI,
              ...additionalData,
              totalReceived: fundData.totalReceived.toString(),
              totalWithdrawn: fundData.totalWithdrawn.toString(),
              balance: balance.toString(),
              updatedAt: new Date(),
            },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error(`Error syncing fund ${i}:`, error);
        }
      }

      console.log(`Synced ${total} funds`);
    } catch (error) {
      console.error("Error syncing all funds:", error);
    }
  }

  stopListening() {
    if (contractReadOnly) {
      contractReadOnly.removeAllListeners();
      this.isListening = false;
      console.log("Event listener stopped");
    }
  }
}

export default new EventListener();
