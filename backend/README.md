# Charity Backend API

Backend API cho dự án quản lý quyên góp từ thiện, tích hợp với smart contract trên Sepolia.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Điền thông tin vào `.env`:
- `MONGODB_URI`: Connection string MongoDB
- `CONTRACT_ADDRESS`: Địa chỉ contract đã deploy
- `SEPOLIA_RPC_URL`: RPC URL của Sepolia
- `PRIVATE_KEY`: Private key để ký transaction (chỉ dùng cho demo, production nên để frontend xử lý)

## Chạy server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Kiểm tra server

### Quỹ (Funds)

- `POST /api/funds/create` - Tạo quỹ mới
  ```json
  {
    "title": "Ủng hộ miền Trung",
    "metadataURI": "ipfs://..."
  }
  ```

- `POST /api/funds/donate` - Quyên góp
  ```json
  {
    "fundId": 0,
    "amount": "0.1"
  }
  ```

- `POST /api/funds/withdraw` - Rút tiền
  ```json
  {
    "fundId": 0,
    "amount": "0.05"
  }
  ```

- `GET /api/funds` - Lấy danh sách quỹ
  - Query params: `owner`, `page`, `limit`

- `GET /api/funds/:fundId` - Lấy thông tin quỹ
  - Query params: `refresh=true` để sync từ blockchain

- `GET /api/funds/stats/total` - Lấy tổng số quỹ

### Authentication (Web3 Style)

- `POST /api/auth/connect` - Kết nối ví (Web3 login)
  ```json
  {
    "address": "0x...",
    "signature": "0x...",
    "message": "Please sign this message..."
  }
  ```
  - Tự động tạo user mới nếu chưa có
  - Verify signature để đảm bảo user sở hữu ví

- `PUT /api/auth/profile` - Cập nhật profile
  ```json
  {
    "address": "0x...",
    "username": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "bio": "I love helping others!"
  }
  ```

- `GET /api/auth/:address` - Lấy thông tin user
- `GET /api/auth` - Lấy danh sách users (query: `page`, `limit`, `search`)

## Event Listener

Backend tự động lắng nghe events từ blockchain và sync vào MongoDB:
- `FundCreated` - Khi có quỹ mới
- `DonationReceived` - Khi có quyên góp
- `FundsWithdrawn` - Khi rút tiền

## Seed Database (Tạo dữ liệu mẫu)

### Tạo dữ liệu mẫu cố định:
```bash
npm run seed
```
Script này sẽ tạo 8 quỹ mẫu với dữ liệu cố định.

### Tạo dữ liệu ngẫu nhiên:
```bash
npm run seed:random
```
Hoặc chỉ định số lượng:
```bash
node scripts/generateRandomFunds.js 20
```
Script này sẽ tạo số lượng quỹ ngẫu nhiên với dữ liệu ngẫu nhiên.

### Tạo dữ liệu User mẫu:
```bash
# Tạo users mẫu cố định (8 users)
npm run seed:users

# Tạo users ngẫu nhiên (mặc định 10)
npm run seed:users:random

# Hoặc chỉ định số lượng
node scripts/generateRandomUsers.js 20
```

**Lưu ý:** Tất cả các script seed đều sẽ xóa toàn bộ dữ liệu cũ trước khi tạo mới.

## Lưu ý

- Trong production, nên để frontend gửi transaction trực tiếp từ ví người dùng
- Backend chỉ nên verify và lưu vào database
- Private key trong `.env` chỉ dùng cho testing, không dùng cho production

