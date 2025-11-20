import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load ABI từ artifact file
let CONTRACT_ABI;
try {
  const artifactPath = join(__dirname, '../../artifacts/contracts/CharityVault.sol/CharityVault.json');
  const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
  CONTRACT_ABI = artifact.abi;
} catch (error) {
  console.warn('Could not load ABI from artifact, using fallback ABI');
  // Fallback ABI nếu không tìm thấy file
  CONTRACT_ABI = [
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
}

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
const RPC_URL = process.env.SEPOLIA_RPC_URL || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

// Tạo provider và signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;
const contract = CONTRACT_ADDRESS && wallet 
  ? new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet)
  : null;

// Contract instance cho read-only operations (không cần signer)
const contractReadOnly = CONTRACT_ADDRESS
  ? new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
  : null;

export { contract, contractReadOnly, provider, CONTRACT_ABI, CONTRACT_ADDRESS };

