import Fund from "../models/Fund.js";
import blockchainService from "../services/blockchain.js";
import { ethers } from "ethers";

class FundController {
  // Tạo quỹ mới
  async createFund(req, res) {
    try {
      const {
        fundId,
        title,
        metadataURI,
        signerAddress,
        owner,
        txHash,
        image,
        thumbnails,
        description,
        category,
      } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      // TRƯỜNG HỢP 1: Frontend đã tạo fund trên blockchain và gửi fundId về để lưu DB
      // Hoặc nếu có txHash thì đây là request sync, không được tạo mới
      if (fundId || fundId === 0 || txHash) {
        if (!fundId && fundId !== 0) {
          return res
            .status(400)
            .json({ error: "Fund ID is required for sync request" });
        }

        // Parse metadata nếu cần thiết, nhưng ưu tiên dữ liệu gửi trực tiếp từ frontend
        let additionalData = {};
        let extractedImages = { main: "", thumbnails: [] };

        try {
          if (metadataURI) {
            const metadata = JSON.parse(metadataURI);
            additionalData = {
              creatorInfo: metadata.creator || {},
              bankAccount: metadata.bankAccount || {},
            };

            // Extract images from metadata as fallback
            if (metadata.images) {
              extractedImages.main = metadata.images.main || "";
              extractedImages.thumbnails = metadata.images.thumbnails || [];
            }
          }
        } catch (e) {
          console.warn("Failed to parse metadataURI:", e.message);
        }

        console.log("=== CreateFund API Call ===");
        console.log("Request Body:", JSON.stringify(req.body, null, 2));
        console.log("Extracted Images:", extractedImages);

        // Kiểm tra xem fund đã tồn tại chưa
        const existingFund = await Fund.findOne({ fundId: fundId.toString() });
        if (existingFund) {
          console.log(`Fund ${fundId} already exists, updating...`);
        } else {
          console.log(`Fund ${fundId} does not exist, creating new...`);
        }

        const newFund = await Fund.findOneAndUpdate(
          { fundId: fundId.toString() },
          {
            fundId: fundId.toString(),
            title,
            metadataURI,
            owner: owner || signerAddress,
            txHash,
            images: {
              main: image || extractedImages.main || "",
              thumbnails:
                thumbnails && thumbnails.length > 0
                  ? thumbnails
                  : extractedImages.thumbnails,
            },
            description: description || "",
            category: category || [],
            ...additionalData,
            createdAt: existingFund ? existingFund.createdAt : new Date(),
            updatedAt: new Date(),
          },
          { upsert: true, new: true }
        );

        console.log(`Fund ${fundId} saved successfully via API`);
        console.log("Saved images:", newFund.images);

        return res.json({
          success: true,
          fundId,
          fund: newFund,
          message: "Fund saved to database successfully",
        });
      }

      // TRƯỜNG HỢP 2: Backend tạo fund trên blockchain (Logic cũ)
      // Nếu có signerAddress, tạo signer từ đó (cho frontend)
      let signer = null;
      if (signerAddress && req.body.signature) {
        // Frontend sẽ gửi signature để verify
        // Ở đây ta dùng signer từ backend hoặc từ frontend
        // Tạm thời dùng backend signer
      }

      const result = await blockchainService.createFund(
        title,
        metadataURI || "",
        signer
      );

      // Event listener sẽ tự động sync vào DB
      // Nhưng ta có thể lấy ngay từ blockchain để trả về
      const fundData = await blockchainService.getFundFromBlockchain(
        result.fundId
      );

      res.json({
        success: true,
        fundId: result.fundId,
        txHash: result.txHash,
        fund: fundData,
      });
    } catch (error) {
      console.error("Error in createFund:", error);
      res.status(500).json({
        error: error.message || "Failed to create fund",
        details: error.reason || error.toString(),
      });
    }
  }

  // Quyên góp
  async donate(req, res) {
    try {
      const { fundId, amount } = req.body;

      if (!fundId && fundId !== 0) {
        return res.status(400).json({ error: "Fund ID is required" });
      }

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }

      // Lưu ý: Trong production, bạn nên để frontend gửi transaction trực tiếp
      // Backend chỉ nên verify và lưu vào DB
      // Ở đây ta dùng backend signer để demo
      const result = await blockchainService.donate(fundId, amount);

      res.json({
        success: true,
        txHash: result.txHash,
        message: "Donation successful",
      });
    } catch (error) {
      console.error("Error in donate:", error);
      res.status(500).json({
        error: error.message || "Failed to process donation",
        details: error.reason || error.toString(),
      });
    }
  }

  // Rút tiền
  async withdraw(req, res) {
    try {
      const { fundId, amount } = req.body;

      if (!fundId && fundId !== 0) {
        return res.status(400).json({ error: "Fund ID is required" });
      }

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }

      const result = await blockchainService.withdraw(fundId, amount);

      res.json({
        success: true,
        txHash: result.txHash,
        message: "Withdrawal successful",
      });
    } catch (error) {
      console.error("Error in withdraw:", error);
      res.status(500).json({
        error: error.message || "Failed to process withdrawal",
        details: error.reason || error.toString(),
      });
    }
  }

  // Lấy danh sách quỹ
  async getFunds(req, res) {
    try {
      const { owner, page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const query = {};
      if (owner) {
        query.owner = owner.toLowerCase();
      }

      const funds = await Fund.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Fund.countDocuments(query);

      res.json({
        success: true,
        funds,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error("Error in getFunds:", error);
      res.status(500).json({ error: "Failed to fetch funds" });
    }
  }

  // Lấy thông tin quỹ theo ID
  async getFundById(req, res) {
    try {
      const { fundId } = req.params;

      // Lấy từ DB trước
      let fund = await Fund.findOne({ fundId });

      // Nếu không có trong DB hoặc muốn lấy data mới nhất, sync từ blockchain
      if (!fund || req.query.refresh === "true") {
        try {
          const blockchainData = await blockchainService.getFundFromBlockchain(
            fundId
          );

          fund = await Fund.findOneAndUpdate(
            { fundId },
            {
              ...blockchainData,
              fundId,
              updatedAt: new Date(),
            },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error("Error syncing from blockchain:", error);
          if (!fund) {
            return res.status(404).json({ error: "Fund not found" });
          }
        }
      }

      res.json({
        success: true,
        fund,
      });
    } catch (error) {
      console.error("Error in getFundById:", error);
      res.status(500).json({ error: "Failed to fetch fund" });
    }
  }

  // Lấy tổng số quỹ
  async getTotalFunds(req, res) {
    try {
      const total = await blockchainService.getTotalFunds();
      res.json({
        success: true,
        total,
      });
    } catch (error) {
      console.error("Error in getTotalFunds:", error);
      res.status(500).json({ error: "Failed to get total funds" });
    }
  }

  // Sync quỹ từ blockchain (khi frontend đã tạo transaction)
  async syncFund(req, res) {
    try {
      const { fundId, txHash, owner } = req.body;

      if (!fundId && fundId !== 0) {
        return res.status(400).json({ error: "Fund ID is required" });
      }

      // Lấy dữ liệu từ blockchain
      const fundData = await blockchainService.getFundFromBlockchain(fundId);

      // Parse metadata nếu có
      let additionalData = {};
      try {
        if (fundData.metadataURI) {
          const metadata = JSON.parse(fundData.metadataURI);
          additionalData = {
            description: metadata.description || "",
            fullDescription: metadata.fullDescription || "",
            category: metadata.category || [],
            goal: Number(metadata.goal) || 0,
            startDate: metadata.startDate ? new Date(metadata.startDate) : null,
            endDate: metadata.endDate ? new Date(metadata.endDate) : null,
            images: {
              main:
                metadata.anhChinh?.[0]?.response?.url ||
                metadata.anhChinh?.[0]?.url ||
                "",
              thumbnails:
                metadata.anhThumbnail?.map((f) => f.response?.url || f.url) ||
                [],
            },
            bankAccount: metadata.bankAccount || {},
            creatorInfo: metadata.creator || {},
          };
        }
      } catch (e) {
        console.warn("Failed to parse metadataURI in syncFund:", e.message);
      }

      // Lưu vào DB
      const fund = await Fund.findOneAndUpdate(
        { fundId: fundId.toString() },
        {
          ...fundData,
          ...additionalData,
          fundId: fundId.toString(),
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      res.json({
        success: true,
        message: "Fund synced successfully",
        fund,
      });
    } catch (error) {
      console.error("Error syncing fund:", error);
      res.status(500).json({ error: "Failed to sync fund" });
    }
  }

  // Sync donation từ blockchain
  async syncDonation(req, res) {
    try {
      const { fundId, txHash, donor } = req.body;

      if (!fundId && fundId !== 0) {
        return res.status(400).json({ error: "Fund ID is required" });
      }

      // Lấy dữ liệu mới nhất từ blockchain
      const fundData = await blockchainService.getFundFromBlockchain(fundId);

      // Cập nhật vào DB
      await Fund.findOneAndUpdate(
        { fundId: fundId.toString() },
        {
          totalReceived: fundData.totalReceived,
          balance: fundData.balance,
          updatedAt: new Date(),
        }
      );

      res.json({
        success: true,
        message: "Donation synced successfully",
      });
    } catch (error) {
      console.error("Error syncing donation:", error);
      res.status(500).json({ error: "Failed to sync donation" });
    }
  }
}

export default new FundController();
