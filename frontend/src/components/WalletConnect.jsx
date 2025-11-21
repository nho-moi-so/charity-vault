import React, { useState, useEffect } from "react";
import { loginWithAddress } from "../services/authService";

// Component nhận setAccount và setError làm props
const WalletConnect = ({ setAccount, setError }) => {
  const [localAccount, setLocalAccount] = useState(null);
  const [localError, setLocalError] = useState(null);

  const handleLoginWithAccount = async (account) => {
    try {
      await loginWithAddress(account);
    } catch (error) {
      console.error("Wallet login failed:", error);
    }
  };

  useEffect(() => {
    const checkWallet = setTimeout(() => {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_accounts" })
          .then((accounts) => {
            if (accounts.length > 0) {
              const account = accounts[0];
              setLocalAccount(account);
              setAccount(account);
              handleLoginWithAccount(account);
            }
          })
          .catch((err) => {
            console.error("Lỗi kiểm tra eth_accounts:", err);
            setLocalError("Không thể tải trạng thái ví.");
          });
      } else {
        setLocalError("MetaMask không được tìm thấy.");
      }
    }, 100);

    return () => clearTimeout(checkWallet);
  }, [setAccount]);

  const handleConnect = async () => {
    if (localAccount) return;

    if (!window.ethereum) {
      const errText = "Vui lòng cài đặt MetaMask!";
      setLocalError(errText);
      setError(errText);
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const selectedAccount = accounts[0];
      setLocalAccount(selectedAccount);
      setAccount(selectedAccount);
      setLocalError(null);
      setError(null);
      await handleLoginWithAccount(selectedAccount);
    } catch (err) {
      console.error(err);
      const errorMsg = "Kết nối bị từ chối hoặc lỗi. Vui lòng thử lại.";
      setLocalError(errorMsg);
      setError(errorMsg);
      setLocalAccount(null);
      setAccount(null);
    }
  };

  return (
    <div>
      {localAccount ? (
        <p>
          ✅ <strong>Đã kết nối:</strong>{" "}
          {localAccount.substring(0, 6)}...
          {localAccount.substring(localAccount.length - 4)}
        </p>
      ) : (
        <button
          onClick={handleConnect}
          disabled={localError && !window.ethereum}
        >
          Kết nối Ví MetaMask
        </button>
      )}
      {localError && <p style={{ color: "red" }}>Lỗi: {localError}</p>}
    </div>
  );
};

export default WalletConnect;