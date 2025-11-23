import React, { useState, useEffect } from "react";
import { loginWithAddress, ensureWalletLogin } from "../services/authService";
import { Button } from "antd";

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
    const checkWallet = async () => {
      const user = await ensureWalletLogin();
      if (user && user.address) {
        setLocalAccount(user.address);
        setAccount(user.address);
      }
    };

    checkWallet();

    const handleAuthChange = (event) => {
      const user = event.detail;
      if (user && user.address) {
        setLocalAccount(user.address);
        setAccount(user.address);
      } else {
        setLocalAccount(null);
        setAccount(null);
      }
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
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
          ✅ <strong>Đã kết nối:</strong> {localAccount.substring(0, 6)}...
          {localAccount.substring(localAccount.length - 4)}
        </p>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={localError && !window.ethereum}
          type="primary"
        >
          Kết nối Ví MetaMask
        </Button>
      )}
      {localError && <p style={{ color: "red" }}>Lỗi: {localError}</p>}
    </div>
  );
};

export default WalletConnect;
