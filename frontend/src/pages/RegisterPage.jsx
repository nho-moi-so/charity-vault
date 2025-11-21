import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin size="large" tip="Vui lòng kết nối ví ở trang đăng nhập..." />
    </div>
  );
};

export default RegisterPage;
