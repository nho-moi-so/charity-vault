import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      
      const response = await authAPI.register({
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (response.data.success) {
        message.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        message.error(response.data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Register error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Đăng ký thất bại!";
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
          backgroundImage: "url('https://i.pinimg.com/736x/35/ae/43/35ae430fdb92d78754d3f7e20e0f93f7.jpg')",
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
        <h2 style={{ fontWeight: "bold", color: "#333", marginBottom: "25px", textAlign: "center" }}>
          Đăng ký tài khoản
        </h2>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          style={{ width: "100%", maxWidth: 400 }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item name="agree" valuePropName="checked">
            <Checkbox>
              Tôi đồng ý với <a href="/policy">chính sách bảo mật</a>
            </Checkbox>
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
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <p style={{ marginTop: "15px", fontSize: "14px", textAlign: "center" }}>
          Đã có tài khoản?{" "}
          <a href="/login" style={{ color: "#52c41a", fontWeight: "500" }}>
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
