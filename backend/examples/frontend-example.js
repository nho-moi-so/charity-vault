// ============================================
// VÍ DỤ FRONTEND - User ký transaction từ ví
// ============================================

// Cài đặt: npm install ethers

import { ethers } from 'ethers';

// Contract ABI (copy từ artifacts hoặc import)
const CONTRACT_ABI = [
  "function createFund(string memory title, string memory metadataURI) public returns (uint256)",
  "function donate(uint256 fundId) public payable",
  "function withdraw(uint256 fundId, uint256 amount) public",
  "function getFund(uint256 fundId) public view returns (tuple(address owner, string title, string metadataURI, uint256 totalReceived, uint256 totalWithdrawn, bool exists))",
  "function totalFunds() public view returns (uint256)",
  "function fundBalance(uint256 fundId) public view returns (uint256)",
  "event FundCreated(uint256 indexed fundId, address indexed owner, string title, string metadataURI)",
  "event DonationReceived(uint256 indexed fundId, address indexed donor, uint256 amount)",
  "event FundsWithdrawn(uint256 indexed fundId, address indexed owner, uint256 amount)"
];

const CONTRACT_ADDRESS = '0x33878ec7Fa1AAB43f2c4D0F7996FB4a34E87c182';

// ============================================
// 1. KẾT NỐI VỚI VÍ (METAMASK)
// ============================================

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Yêu cầu kết nối ví
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Tạo provider và signer từ ví người dùng
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      console.log('Connected:', await signer.getAddress());
      return { provider, signer };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  } else {
    throw new Error('Please install MetaMask!');
  }
}

// ============================================
// 2. TẠO QUỸ MỚI (User ký transaction)
// ============================================

async function createFund(title, metadataURI) {
  try {
    // Kết nối ví
    const { signer } = await connectWallet();
    
    // Tạo contract instance với signer từ ví user
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    // Gọi hàm createFund - user sẽ ký transaction
    const tx = await contract.createFund(title, metadataURI);
    console.log('Transaction sent:', tx.hash);
    
    // Đợi transaction được confirm
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);
    
    // Lấy event FundCreated để lấy fundId
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed && parsed.name === 'FundCreated';
      } catch {
        return false;
      }
    });
    
    if (event) {
      const parsed = contract.interface.parseLog(event);
      const fundId = parsed.args.fundId.toString();
      
      // Gửi thông tin lên backend để lưu vào DB (optional)
      await fetch('http://localhost:3000/api/funds/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fundId,
          txHash: receipt.hash,
          owner: await signer.getAddress()
        })
      });
      
      return { fundId, txHash: receipt.hash };
    }
    
    throw new Error('FundCreated event not found');
  } catch (error) {
    console.error('Error creating fund:', error);
    throw error;
  }
}

// ============================================
// 3. QUYÊN GÓP (User gửi ETH và ký transaction)
// ============================================

async function donate(fundId, amountInEth) {
  try {
    // Kết nối ví
    const { signer } = await connectWallet();
    
    // Tạo contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    // Gọi hàm donate với value (ETH)
    // User sẽ phải approve transaction trong MetaMask
    const tx = await contract.donate(fundId, {
      value: ethers.parseEther(amountInEth.toString())
    });
    
    console.log('Donation transaction sent:', tx.hash);
    
    // Đợi confirm
    const receipt = await tx.wait();
    console.log('Donation confirmed:', receipt.hash);
    
    // Thông báo cho backend (optional)
    await fetch('http://localhost:3000/api/funds/sync-donation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fundId,
        txHash: receipt.hash,
        donor: await signer.getAddress()
      })
    });
    
    return { txHash: receipt.hash };
  } catch (error) {
    console.error('Error donating:', error);
    throw error;
  }
}

// ============================================
// 4. RÚT TIỀN (Chỉ owner mới được rút)
// ============================================

async function withdraw(fundId, amountInEth) {
  try {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    const tx = await contract.withdraw(
      fundId,
      ethers.parseEther(amountInEth.toString())
    );
    
    console.log('Withdrawal transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Withdrawal confirmed:', receipt.hash);
    
    return { txHash: receipt.hash };
  } catch (error) {
    console.error('Error withdrawing:', error);
    throw error;
  }
}

// ============================================
// 5. ĐỌC DỮ LIỆU (Không cần ký, chỉ đọc)
// ============================================

async function getFund(fundId) {
  try {
    // Không cần signer, chỉ cần provider
    const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_KEY');
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    const fund = await contract.getFund(fundId);
    const balance = await contract.fundBalance(fundId);
    
    return {
      owner: fund.owner,
      title: fund.title,
      metadataURI: fund.metadataURI,
      totalReceived: fund.totalReceived.toString(),
      totalWithdrawn: fund.totalWithdrawn.toString(),
      balance: balance.toString()
    };
  } catch (error) {
    console.error('Error getting fund:', error);
    throw error;
  }
}

// ============================================
// VÍ DỤ SỬ DỤNG
// ============================================

// Trong React component hoặc HTML:
/*
<button onClick={async () => {
  try {
    const result = await createFund('Ủng hộ miền Trung', 'ipfs://...');
    alert(`Quỹ đã tạo với ID: ${result.fundId}`);
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}}>
  Tạo Quỹ
</button>

<button onClick={async () => {
  try {
    await donate(0, '0.1'); // Quyên góp 0.1 ETH vào quỹ 0
    alert('Quyên góp thành công!');
  } catch (error) {
    alert('Lỗi: ' + error.message);
  }
}}>
  Quyên Góp
</button>
*/

export { connectWallet, createFund, donate, withdraw, getFund };

