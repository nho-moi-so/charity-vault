import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers'; // KHÔNG cần thiết ở đây nếu chỉ dùng để kết nối

// Component cần nhận setAccount (từ DonatePage) và setError (từ DonatePage) làm props
const WalletConnect = ({ setAccount, setError }) => { 
    
    // State nội bộ để quản lý việc hiển thị trong component này
    const [localAccount, setLocalAccount] = useState(null); 
    const [localError, setLocalError] = useState(null); 

    // Logic 1: Kiểm tra tài khoản đã kết nối khi tải trang (eth_accounts)
    useEffect(() => {
        // Sử dụng setTimeout để cho MetaMask có thời gian inject window.ethereum (mẹo phổ biến)
        const checkWallet = setTimeout(() => {
            if (window.ethereum) {
                window.ethereum.request({ method: 'eth_accounts' })
                    .then(accounts => {
                        if (accounts.length > 0) {
                            const account = accounts[0];
                            setLocalAccount(account);
                            setAccount(account); // Cập nhật trạng thái cho DonatePage
                        }
                    })
                    .catch(err => {
                        console.error("Lỗi kiểm tra eth_accounts:", err);
                        setLocalError("Không thể tải trạng thái ví.");
                    });
            } else {
                // Nếu MetaMask không được tìm thấy khi tải trang
                setLocalError("MetaMask không được tìm thấy.");
            }
        }, 100); // Chờ 100ms

        return () => clearTimeout(checkWallet);
        
    }, [setAccount]); // Dependency array: chỉ chạy lại khi setAccount thay đổi (thường là không)

    
    // Logic 2: Xử lý sự kiện khi người dùng nhấn nút "Kết nối Ví MetaMask"
    const handleConnect = async () => {
        // Kiểm tra lại xem đã có tài khoản kết nối chưa
        if (localAccount) return; 

        if (!window.ethereum) {
            setLocalError("Vui lòng cài đặt MetaMask!");
            setError("MetaMask không được tìm thấy."); // Truyền lỗi lên component cha
            return;
        }

        try {
            // Yêu cầu kết nối tài khoản (sẽ mở MetaMask pop-up)
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            const selectedAccount = accounts[0];
            
            // Cập nhật trạng thái nội bộ và trạng thái component cha (prop)
            setLocalAccount(selectedAccount); 
            setAccount(selectedAccount); 
            
            setLocalError(null); 
            setError(null); 
            
        } catch (err) {
            console.error(err);
            const errorMsg = "Kết nối bị từ chối hoặc lỗi. Vui lòng thử lại.";
            
            // Cập nhật trạng thái lỗi nội bộ và trạng thái lỗi component cha (prop)
            setLocalError(errorMsg);
            setError(errorMsg); 
            setLocalAccount(null);
            setAccount(null);
        }
    };

    return (
        <div>
            {localAccount ? ( // Sử dụng localAccount để hiển thị
                <p>
                    ✅ **Đã kết nối:** {localAccount.substring(0, 6)}...{localAccount.substring(localAccount.length - 4)}
                </p>
            ) : (
                <button 
                    onClick={handleConnect}
                    // Nếu đã có lỗi nội bộ và window.ethereum không tồn tại thì disable
                    disabled={localError && !window.ethereum} 
                >
                    Kết nối Ví MetaMask
                </button>
            )}
            {/* Hiển thị lỗi cục bộ (nếu có) */}
            {localError && <p style={{ color: 'red' }}>Lỗi: {localError}</p>}
        </div>
    );
};

export default WalletConnect;