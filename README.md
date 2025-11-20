## CharityVault - Hệ Thống Quản Lý Quyên Góp Minh Bạch

Lớp smart contract dùng để quản lý quỹ từ thiện trên các mạng tương thích Ethereum. Người dùng có thể tạo quỹ, nhận đóng góp bằng ETH gốc, và chủ quỹ có thể rút số dư còn lại. Repository đã được chuẩn bị để triển khai lên Sepolia bằng Hardhat + JavaScript.

### Yêu cầu

- Node.js 18+
- npm

### Cài đặt

1. Cài dependencies:
   ```
   npm install
   ```
2. Tạo file `.env` bằng cách copy `.env.example` và điền các giá trị:

- `SEPOLIA_RPC_URL`
- `PRIVATE_KEY` (ví deploy)
- `ETHERSCAN_API_KEY`

### Các lệnh hữu ích

- Compile smart contract: `npm run compile`
- Chạy test: `npm test`
- Xoá artifacts: `npm run clean`
- Coverage (tùy chọn): `npm run coverage`

### Deployment (Sepolia)

```
npm run deploy:sepolia
```

Script sẽ in ra địa chỉ contract sau khi triển khai. Hãy lưu lại để dùng cho verify và tích hợp frontend/backend.

### Xác minh trên Etherscan

```
npx hardhat verify --network sepolia <DEPLOYED_ADDRESS>
```

Không cần truyền constructor arguments.

### Contract Events

- `FundCreated(fundId, owner, title, metadataURI)`
- `DonationReceived(fundId, donor, amount)`
- `FundsWithdrawn(fundId, owner, amount)`

Các dịch vụ downstream (backend/frontend) có thể subscribe những sự kiện này để đồng bộ UI và lưu trữ off-chain.
