/* eslint-env es2020 */
import { ethers } from "ethers";

// Địa chỉ Smart Contract - có thể cấu hình qua environment variable
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "0xAB9B8753d8551f9f427032a7743a51A57c56bA52";

// ABI đầy đủ của CharityVault contract
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fundId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "donor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "DonationReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fundId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      }
    ],
    "name": "FundCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fundId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundsWithdrawn",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      }
    ],
    "name": "createFund",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "fundId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fundId",
        "type": "uint256"
      }
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fundId",
        "type": "uint256"
      }
    ],
    "name": "fundBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fundId",
        "type": "uint256"
      }
    ],
    "name": "getFund",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "totalReceived",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalWithdrawn",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          }
        ],
        "internalType": "struct CharityVault.Fund",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalFunds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fundId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

/**
 * Lấy instance của Smart Contract với signer (để thực hiện giao dịch)
 * @returns {Promise<ethers.Contract>} Đối tượng Contract đã kết nối với Signer
 */
const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask chưa được cài đặt hoặc không khả dụng.");
  }
  
  // Tạo Provider (kết nối đọc)
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // Lấy Signer (kết nối ghi/giao dịch)
  const signer = await provider.getSigner();

  // Tạo Contract instance
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  return contract;
};

/**
 * Lấy instance của Smart Contract read-only (không cần signer)
 * @returns {ethers.Contract} Đối tượng Contract read-only
 */
const getReadOnlyContract = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask chưa được cài đặt hoặc không khả dụng.");
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  
  return contract;
};

/**
 * Kết nối ví MetaMask
 * @returns {Promise<string>} Địa chỉ ví đã kết nối
 */
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask chưa được cài đặt hoặc không khả dụng.");
  }
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    console.error("Lỗi kết nối ví:", error);
    throw error;
  }
};

/**
 * Lấy địa chỉ ví hiện tại (nếu đã kết nối)
 * @returns {Promise<string | null>} Địa chỉ ví
 */
export const getCurrentAddress = async () => {
  if (!window.ethereum) return null;
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Lỗi lấy địa chỉ ví:", error);
    return null;
  }
};

/**
 * Lấy tỷ giá ETH/VND từ CoinGecko API
 * @returns {Promise<number>} Giá trị 1 ETH tính bằng VND
 */
export const getCurrentEthPrice = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=vnd');
    const data = await response.json();
    return data.ethereum?.vnd || 0;
  } catch (error) {
    console.error("Không thể lấy tỷ giá ETH:", error);
    // Fallback giá trị mặc định
    return 80000000; // 1 ETH = 80,000,000 VND (giá trị ước tính)
  }
};

/**
 * Tạo quỹ mới trên blockchain
 * @param {string} title - Tiêu đề quỹ
 * @param {string} metadataURI - URI chứa metadata của quỹ
 * @returns {Promise<ethers.TransactionReceipt>} Transaction receipt
 */
export const createFund = async (title, metadataURI) => {
  try {
    const contract = await getContract();
    const tx = await contract.createFund(title, metadataURI);
    const receipt = await tx.wait();
    console.log("Tạo quỹ thành công:", receipt);
    return receipt;
  } catch (error) {
    console.error("Lỗi tạo quỹ:", error);
    throw error;
  }
};

/**
 * Quyên góp cho quỹ
 * @param {number|string|BigInt} fundId - ID của quỹ
 * @param {string} amountETHString - Số lượng ETH (dạng string, ví dụ: "0.1")
 * @returns {Promise<ethers.TransactionReceipt>} Transaction receipt
 */
export const handleDonation = async (fundId, amountETHString) => {
  try {
    const contract = await getContract();
    
    // Chuyển đổi ETH string sang Wei
    const amountWei = ethers.parseEther(amountETHString);
    
    // Chuyển đổi fundId sang BigInt
    const fundIdBigInt = BigInt(fundId);
    
    // Gửi giao dịch donate
    const tx = await contract.donate(fundIdBigInt, { value: amountWei });
    
    const receipt = await tx.wait();
    console.log("Giao dịch donate hoàn tất:", receipt);
    return receipt;
  } catch (error) {
    console.error("Lỗi trong handleDonation:", error);
    throw error;
  }
};

/**
 * Rút tiền từ quỹ (chỉ chủ quỹ mới được phép)
 * @param {number|string|BigInt} fundId - ID của quỹ
 * @param {string} amountETHString - Số lượng ETH muốn rút (dạng string)
 * @returns {Promise<ethers.TransactionReceipt>} Transaction receipt
 */
export const withdrawFunds = async (fundId, amountETHString) => {
  try {
    const contract = await getContract();
    
    const amountWei = ethers.parseEther(amountETHString);
    const fundIdBigInt = BigInt(fundId);
    
    const tx = await contract.withdraw(fundIdBigInt, amountWei);
    const receipt = await tx.wait();
    
    console.log("Rút tiền thành công:", receipt);
    return receipt;
  } catch (error) {
    console.error("Lỗi rút tiền:", error);
    throw error;
  }
};

/**
 * Lấy thông tin quỹ từ blockchain
 * @param {number|string|BigInt} fundId - ID của quỹ
 * @returns {Promise<Object>} Thông tin quỹ
 */
export const getFundInfo = async (fundId) => {
  try {
    const contract = getReadOnlyContract();
    const fundIdBigInt = BigInt(fundId);
    const fund = await contract.getFund(fundIdBigInt);
    
    return {
      title: fund.title,
      metadataURI: fund.metadataURI,
      owner: fund.owner,
      totalReceived: ethers.formatEther(fund.totalReceived),
      totalWithdrawn: ethers.formatEther(fund.totalWithdrawn),
      exists: fund.exists
    };
  } catch (error) {
    console.error("Lỗi lấy thông tin quỹ:", error);
    throw error;
  }
};

/**
 * Lấy số dư của quỹ
 * @param {number|string|BigInt} fundId - ID của quỹ
 * @returns {Promise<string>} Số dư quỹ (dạng ETH string)
 */
export const getFundBalance = async (fundId) => {
  try {
    const contract = getReadOnlyContract();
    const fundIdBigInt = BigInt(fundId);
    const balance = await contract.fundBalance(fundIdBigInt);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Lỗi lấy số dư quỹ:", error);
    throw error;
  }
};

/**
 * Lấy tổng số quỹ đã tạo
 * @returns {Promise<number>} Tổng số quỹ
 */
export const getTotalFunds = async () => {
  try {
    const contract = getReadOnlyContract();
    const total = await contract.totalFunds();
    return Number(total);
  } catch (error) {
    console.error("Lỗi lấy tổng số quỹ:", error);
    throw error;
  }
};

/**
 * Lắng nghe sự kiện DonationReceived
 * @param {function} callback - Callback function khi có sự kiện
 * @returns {Promise<ethers.ContractEvent>} Event listener
 */
export const listenToDonations = (callback) => {
  try {
    const contract = getReadOnlyContract();
    contract.on("DonationReceived", (fundId, donor, amount, event) => {
      callback({
        fundId: Number(fundId),
        donor,
        amount: ethers.formatEther(amount),
        event
      });
    });
  } catch (error) {
    console.error("Lỗi lắng nghe sự kiện:", error);
    throw error;
  }
};
