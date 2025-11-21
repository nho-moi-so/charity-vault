import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { loginWithWallet, ensureWalletLogin } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      const user = await ensureWalletLogin();
      if (user) {
        navigate(location.state?.from || "/");
      }
    };

    autoLogin();
  }, [location.state, navigate]);

  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      await loginWithWallet();
      message.success("Đã kết nối ví thành công!");
      navigate(location.state?.from || "/");
    } catch (error) {
      console.error("Wallet login error:", error);
      const errorMessage =
        error?.message || "Không thể kết nối ví. Vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <div
        style={{
          flex: 1,
          backgroundImage:
            "url('https://i.pinimg.com/736x/35/ae/43/35ae430fdb92d78754d3f7e20e0f93f7.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#000",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        <img
          src="https://vn-test-11.slatic.net/shop/ef696bbfa65b218629e1ee20923b731e.jpeg"
          alt="Logo"
          style={{ width: 100, marginBottom: 20 }}
        />
        <h2 style={{ fontWeight: "bold", fontSize: 24 }}>
          Kết nối ví MetaMask để đăng nhập
        </h2>
        <p style={{ maxWidth: 360, color: "#333" }}>
          Lần đầu kết nối, hệ thống sẽ tự động tạo tài khoản của bạn.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 40px",
        }}
      >
        <h2
          style={{
            fontWeight: "bold",
            color: "#333",
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          Đăng nhập bằng ví
        </h2>

        <p style={{ marginBottom: 20, color: "#666", textAlign: "center" }}>
          Bạn chỉ cần kết nối ví MetaMask để truy cập toàn bộ tính năng.
        </p>

        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={handleConnectWallet}
          style={{
            width: "100%",
            maxWidth: 300,
            borderRadius: 30,
            background: "linear-gradient(90deg, #b6eb7a 0%, #52c41a 100%)",
            border: "none",
            fontWeight: 600,
            height: 50,
          }}
        >
          {loading ? "Đang kết nối..." : "Kết nối ví MetaMask"}
        </Button>

        <p style={{ marginTop: 20, color: "#888", textAlign: "center" }}>
          Không cần đăng ký hay nhập mật khẩu.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
