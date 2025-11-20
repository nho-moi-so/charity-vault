import React, { useState, useEffect } from "react";
import { Layout, Menu, Input, Button, Avatar, Dropdown } from "antd";
import { SearchOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
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
            { key: "3", label: <span onClick={() => navigate("/gioi-thieu-quy")}>Giới thiệu</span> },
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
                  src={
                    "https://i.pinimg.com/736x/06/27/e4/0627e47e1b9c55a407132520dcf6091b.jpg"
                  }
                  size={40}
                  icon={!user?.avatar && <UserOutlined />}
                />
                <DownOutlined style={{ color: "#000" }} />
              </div>
            </Dropdown>
          ) : (
            <Button
              type="text"
              style={{ color: "#8c8c8c", fontWeight: 500 }}
              onClick={() => navigate("/login", { state: { from: "/" } })}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
