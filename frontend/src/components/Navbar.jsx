import React, { useState, useEffect } from "react";
import { Layout, Menu, Input, Button, Avatar, Dropdown, message } from "antd";
import { SearchOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  ensureWalletLogin,
  loginWithWallet,
  logout as logoutService,
  getStoredUser,
} from "../services/authService";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    const syncUser = async () => {
      const walletUser = await ensureWalletLogin();
      if (walletUser) {
        setUser(walletUser);
      }
    };

    syncUser();
  }, []);

  const handleLogout = () => {
    logoutService();
    setUser(null);
    navigate("/");
  };

  const handleConnectWallet = async () => {
    if (connecting) return;
    try {
      setConnecting(true);
      const connectedUser = await loginWithWallet();
      setUser(connectedUser);
      message.success("Đã kết nối ví thành công!");
    } catch (error) {
      console.error("Connect wallet error:", error);
      const errorMessage =
        error?.message || "Không thể kết nối ví. Vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setConnecting(false);
    }
  };

  // menu cho tài khoản người dùng
  const userMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: <span onClick={() => navigate("/profile")}>Xem trang cá nhân</span>,
        },
        {
          key: "2",
          label: <span onClick={handleLogout}>Đăng xuất</span>,
        },
      ]}
    />
  );

  // menu con cho Chính sách
  const policyMenu = (
    <Menu
      items={[
        {
          key: "policy-1",
          label: <span onClick={() => navigate("/dieu-khoan")}>Điều khoản sử dụng</span>,
        },
        {
          key: "policy-2",
          label: <span onClick={() => navigate("/chinh-sach-bao-mat")}>Chính sách bảo mật</span>,
        },
      ]}
    />
  );

  return (
    <Header
      style={{
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: 70,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo và ô tìm kiếm */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <img
            src="https://vn-test-11.slatic.net/shop/ef696bbfa65b218629e1ee20923b731e.jpeg"
            alt="logo"
            style={{ width: 65, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <Input
            placeholder="Search"
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            style={{
              width: 350,
              borderRadius: 25,
              backgroundColor: "#f5f5f5",
              border: "none",
            }}
          />
        </div>

        {/* Thanh menu chính */}
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={[
            { key: "1", label: <span onClick={() => navigate("/")}>Trang chủ</span> },
            { key: "2", label: <span onClick={() => navigate("/funds")}>Gây quỹ</span> },
          {
            key: "3",
            label: <span onClick={() => navigate("/gioi-thieu-quy")}>Giới thiệu</span>,
          },
            {
              key: "4",
              label: (
                <Dropdown overlay={policyMenu} placement="bottom">
                  <span style={{ cursor: "pointer" }}>
                    Chính sách <DownOutlined />
                  </span>
                </Dropdown>
              ),
            },
          ]}
          style={{
            borderBottom: "none",
            fontSize: 16,
            flex: 1,
            justifyContent: "center",
            display: "flex",
            background: "transparent",
          }}
        />

        {/* Nút tạo quỹ và avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button
            type="primary"
            shape="round"
            style={{
              background: "linear-gradient(90deg, #b6eb7a 0%, #52c41a 100%)",
              border: "none",
              color: "#fff",
              fontWeight: 500,
            }}
            onClick={() => navigate("/tao-quy-moi")}
          >
            Tạo quỹ mới
          </Button>

          {user ? (
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  cursor: "pointer",
                }}
              >
                <Avatar
                  src={user?.avatar || "https://i.pravatar.cc/150?img=3"}
                  size={40}
                  icon={!user?.avatar && <UserOutlined />}
                />
                <span style={{ fontSize: 14, color: "#333", display: "flex", alignItems: "center", gap: 4 }}>
                  {user?.username ||
                    (user?.address
                      ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
                      : "Người dùng")}
                  <DownOutlined style={{ fontSize: 12 }} />
                </span>
              </div>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              ghost
              style={{ borderRadius: 20 }}
              onClick={handleConnectWallet}
              loading={connecting}
            >
              Kết nối ví
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
