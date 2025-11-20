import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      const response = await authAPI.login({
        username: values.username,
        password: values.password,
      });

      if (response.data.success || response.data.token) {
        // Lưu token và user info
        const token = response.data.token || response.data.data?.token;
        const user = response.data.user || response.data.data?.user || {
          username: values.username,
          avatar: "https://i.pravatar.cc/150?img=3",
        };

        if (token) {
          localStorage.setItem("token", token);
        }
        localStorage.setItem("user", JSON.stringify(user));

        message.success("Đăng nhập thành công!");
        navigate(location.state?.from || "/");
      } else {
        message.error(response.data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Tài khoản hoặc mật khẩu không đúng!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex" }}>
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
          color: "#000000ff",
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
          Chung tay trao yêu thương, <br /> cùng nhau tạo niềm tin
        </h2>
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
          Đăng nhập hệ thống
        </h2>

        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          layout="vertical"
          style={{ width: "100%", maxWidth: 400 }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{
                width: "100%",
                backgroundColor: "#52c41a",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <p style={{ marginTop: "15px", fontSize: "14px", textAlign: "center" }}>
          Chưa có tài khoản?{" "}
          <a href="/register" style={{ color: "#52c41a", fontWeight: "500" }}>
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
