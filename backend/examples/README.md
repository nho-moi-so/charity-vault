# Frontend Integration Examples

Ví dụ cách frontend/user ký transaction từ ví của họ thay vì backend.

## Cách hoạt động

1. **Frontend kết nối với ví** (MetaMask, WalletConnect, etc.)
2. **User ký transaction** trực tiếp từ ví của họ
3. **Backend chỉ verify và sync** dữ liệu vào database

## Files

- `frontend-example.js` - Ví dụ vanilla JavaScript
- `react-example.jsx` - Ví dụ React component

## Flow

### Tạo quỹ:
```
1. User click "Tạo Quỹ" trên frontend
2. Frontend kết nối MetaMask → User approve
3. Frontend gọi contract.createFund() → User ký transaction
4. Transaction được gửi lên blockchain
5. Frontend gọi API /api/funds/sync để backend sync vào DB
```

### Quyên góp:
```
1. User nhập số tiền và click "Quyên Góp"
2. Frontend gọi contract.donate(fundId, { value: amount })
3. MetaMask hiện popup → User approve và ký
4. Transaction được gửi lên blockchain
5. Frontend gọi API /api/funds/sync-donation để backend sync
```

## Lợi ích

✅ **Bảo mật**: Private key không bao giờ rời khỏi ví user
✅ **Quyền kiểm soát**: User hoàn toàn kiểm soát transaction
✅ **Phí gas**: User tự trả phí gas từ ví của họ
✅ **Trải nghiệm**: User quen thuộc với MetaMask flow

## Backend chỉ làm gì?

- Lắng nghe events từ blockchain (tự động sync)
- Cung cấp API để frontend sync sau khi transaction
- Lưu trữ dữ liệu vào MongoDB để query nhanh
- Không ký transaction (không cần PRIVATE_KEY trong production)

