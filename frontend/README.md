# CharityVault Frontend

Frontend React application cho hệ thống quản lý quỹ từ thiện minh bạch trên blockchain.

## Yêu cầu

- Node.js 18+
- npm hoặc yarn

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example` và cấu hình:
```bash
# Copy file .env.example thành .env và điền các giá trị
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_CONTRACT_ADDRESS=0xAB9B8753d8551f9f427032a7743a51A57c56bA52
```

## Chạy ứng dụng

### Development mode
```bash
npm start
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

**Lưu ý:** Frontend chạy trên port 3000. Backend cần chạy trên port 3001 để tránh conflict.

### Build cho production
```bash
npm run build
```

## Cấu trúc dự án

```
src/
├── components/      # Các component tái sử dụng
├── pages/          # Các trang chính
├── services/        # API và Web3 services
│   ├── api.js      # Backend API service
│   └── Web3Service.js  # Blockchain interaction service
└── ...
```

## Tính năng

- ✅ Kết nối MetaMask wallet
- ✅ Xem danh sách quỹ từ thiện
- ✅ Tạo quỹ mới trên blockchain
- ✅ Quyên góp bằng ETH
- ✅ Xem chi tiết quỹ và lịch sử giao dịch
- ✅ Quản lý profile người dùng
- ✅ Tích hợp với backend API

## Dependencies chính

- **React 19** - UI framework
- **Ant Design 5** - Component library
- **React Router** - Routing
- **Axios** - HTTP client cho API calls
- **Ethers.js 6** - Ethereum blockchain interaction
- **React Slick** - Carousel component

## Kết nối với Backend

Frontend tự động proxy các request API đến backend tại `http://localhost:3001/api` thông qua cấu hình proxy trong `package.json`.

**Lưu ý:** Đảm bảo backend đang chạy trên port 3001. Bạn có thể cấu hình port backend trong file `.env` của backend hoặc set biến môi trường `PORT=3001`.

## Kết nối với Smart Contract

Frontend sử dụng `Web3Service.js` để tương tác với Smart Contract `CharityVault` trên blockchain. Đảm bảo:

1. MetaMask đã được cài đặt
2. Đã kết nối với đúng network (Sepolia testnet)
3. Contract address đã được cấu hình trong `.env`

## Scripts

- `npm start` - Chạy development server (port 3001)
- `npm run build` - Build cho production
- `npm test` - Chạy tests
- `npm run eject` - Eject khỏi Create React App (không khuyến khích)

## Troubleshooting

### Port đã được sử dụng
Nếu port 3000 đã được sử dụng, bạn có thể thay đổi trong `package.json`:
```json
"start": "cross-env PORT=3002 react-scripts start"
```

### Lỗi kết nối MetaMask
- Đảm bảo MetaMask extension đã được cài đặt
- Kiểm tra network đã kết nối đúng (Sepolia)
- Refresh trang và thử lại

### Lỗi kết nối Backend
- Đảm bảo backend đang chạy tại `http://localhost:3001`
- Kiểm tra CORS settings trong backend
- Kiểm tra `REACT_APP_API_URL` trong file `.env` (mặc định là `http://localhost:3001/api`)
