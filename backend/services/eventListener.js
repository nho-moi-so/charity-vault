import { contractReadOnly, provider, CONTRACT_ADDRESS } from '../config/contract.js';
import Fund from '../models/Fund.js';
import { ethers } from 'ethers';

class EventListener {
  constructor() {
    this.isListening = false;
  }

  async startListening() {
    if (this.isListening || !contractReadOnly) {
      console.log('Event listener already running or contract not initialized');
      return;
    }

    this.isListening = true;
    console.log('Starting event listener...');

    // Lắng nghe FundCreated
    contractReadOnly.on('FundCreated', async (fundId, owner, title, metadataURI, event) => {
      try {
        const fundIdNum = fundId.toString();
        console.log(`FundCreated event: ${fundIdNum} by ${owner}`);

        // Lấy thông tin đầy đủ từ blockchain
        const balance = await contractReadOnly.fundBalance(fundId);
        
        await Fund.findOneAndUpdate(
          { fundId: fundIdNum },
          {
            fundId: fundIdNum,
            owner: owner.toLowerCase(),
            title,
            metadataURI,
            totalReceived: '0',
            totalWithdrawn: '0',
            balance: balance.toString(),
            updatedAt: new Date()
          },
          { upsert: true, new: true }
        );

        console.log(`Fund ${fundIdNum} synced to database`);
      } catch (error) {
        console.error('Error processing FundCreated event:', error);
      }
    });

    // Lắng nghe DonationReceived
    contractReadOnly.on('DonationReceived', async (fundId, donor, amount, event) => {
      try {
        const fundIdNum = fundId.toString();
        console.log(`DonationReceived event: ${amount} to fund ${fundIdNum}`);

        // Cập nhật từ blockchain để đảm bảo dữ liệu chính xác
        const fundData = await contractReadOnly.getFund(fundId);
        const balance = await contractReadOnly.fundBalance(fundId);

        await Fund.findOneAndUpdate(
          { fundId: fundIdNum },
          {
            totalReceived: fundData.totalReceived.toString(),
            balance: balance.toString(),
            updatedAt: new Date()
          }
        );

        console.log(`Fund ${fundIdNum} donation synced`);
      } catch (error) {
        console.error('Error processing DonationReceived event:', error);
      }
    });

    // Lắng nghe FundsWithdrawn
    contractReadOnly.on('FundsWithdrawn', async (fundId, owner, amount, event) => {
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
            updatedAt: new Date()
          }
        );

        console.log(`Fund ${fundIdNum} withdrawal synced`);
      } catch (error) {
        console.error('Error processing FundsWithdrawn event:', error);
      }
    });

    // Sync lại tất cả quỹ hiện có khi khởi động
    await this.syncAllFunds();
  }

  async syncAllFunds() {
    if (!contractReadOnly) return;

    try {
      console.log('Syncing all existing funds...');
      const totalFunds = await contractReadOnly.totalFunds();
      const total = parseInt(totalFunds.toString());

      for (let i = 0; i < total; i++) {
        try {
          const fundData = await contractReadOnly.getFund(i);
          const balance = await contractReadOnly.fundBalance(i);

          await Fund.findOneAndUpdate(
            { fundId: i.toString() },
            {
              fundId: i.toString(),
              owner: fundData.owner.toLowerCase(),
              title: fundData.title,
              metadataURI: fundData.metadataURI,
              totalReceived: fundData.totalReceived.toString(),
              totalWithdrawn: fundData.totalWithdrawn.toString(),
              balance: balance.toString(),
              updatedAt: new Date()
            },
            { upsert: true, new: true }
          );
        } catch (error) {
          console.error(`Error syncing fund ${i}:`, error);
        }
      }

      console.log(`Synced ${total} funds`);
    } catch (error) {
      console.error('Error syncing all funds:', error);
    }
  }

  stopListening() {
    if (contractReadOnly) {
      contractReadOnly.removeAllListeners();
      this.isListening = false;
      console.log('Event listener stopped');
    }
  }
}

export default new EventListener();

