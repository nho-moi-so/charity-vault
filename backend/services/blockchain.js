import { contract, contractReadOnly } from '../config/contract.js';
import { ethers } from 'ethers';

class BlockchainService {
  // Tạo quỹ mới
  async createFund(title, metadataURI, signer) {
    if (!contract) {
      throw new Error('Contract not initialized. Check CONTRACT_ADDRESS and PRIVATE_KEY in .env');
    }

    try {
      // Nếu có signer riêng (từ frontend), dùng signer đó
      const contractWithSigner = signer 
        ? contract.connect(signer)
        : contract;

      const tx = await contractWithSigner.createFund(title, metadataURI);
      const receipt = await tx.wait();
      
      // Lấy event FundCreated
      const event = receipt.logs.find(
        log => {
          try {
            const parsed = contract.interface.parseLog(log);
            return parsed && parsed.name === 'FundCreated';
          } catch {
            return false;
          }
        }
      );

      if (event) {
        const parsed = contract.interface.parseLog(event);
        const fundId = parsed.args.fundId.toString();
        return { txHash: receipt.hash, fundId };
      }

      throw new Error('FundCreated event not found');
    } catch (error) {
      console.error('Error creating fund:', error);
      throw error;
    }
  }

  // Quyên góp
  async donate(fundId, amount, signer) {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const contractWithSigner = signer 
        ? contract.connect(signer)
        : contract;

      const tx = await contractWithSigner.donate(fundId, {
        value: ethers.parseEther(amount.toString())
      });
      
      const receipt = await tx.wait();
      return { txHash: receipt.hash };
    } catch (error) {
      console.error('Error donating:', error);
      throw error;
    }
  }

  // Rút tiền
  async withdraw(fundId, amount, signer) {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const contractWithSigner = signer 
        ? contract.connect(signer)
        : contract;

      const tx = await contractWithSigner.withdraw(
        fundId,
        ethers.parseEther(amount.toString())
      );
      
      const receipt = await tx.wait();
      return { txHash: receipt.hash };
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw error;
    }
  }

  // Lấy thông tin quỹ từ blockchain
  async getFundFromBlockchain(fundId) {
    if (!contractReadOnly) {
      throw new Error('Contract not initialized');
    }

    try {
      const fund = await contractReadOnly.getFund(fundId);
      const balance = await contractReadOnly.fundBalance(fundId);

      // fund là một struct, truy cập các thuộc tính
      return {
        owner: fund.owner,
        title: fund.title,
        metadataURI: fund.metadataURI,
        totalReceived: fund.totalReceived.toString(),
        totalWithdrawn: fund.totalWithdrawn.toString(),
        balance: balance.toString(),
        exists: fund.exists
      };
    } catch (error) {
      console.error('Error getting fund from blockchain:', error);
      throw error;
    }
  }

  // Lấy tổng số quỹ
  async getTotalFunds() {
    if (!contractReadOnly) {
      throw new Error('Contract not initialized');
    }

    try {
      const total = await contractReadOnly.totalFunds();
      return total.toString();
    } catch (error) {
      console.error('Error getting total funds:', error);
      throw error;
    }
  }
}

export default new BlockchainService();

