import React from "react";
import { Card, Typography, Button, Progress } from "antd";
import {
  BankOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const FundInfoBox = () => {
  const navigate = useNavigate();

  const goal = 10000000000;
  const raised = 4500000000; 
  const remainingDays = 40;

  const percent = ((raised / goal) * 100).toFixed(1);

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        padding: "5px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <img
          src="https://i.pinimg.com/1200x/a4/0b/05/a40b050278d6c4ba8f9f959100722ad8.jpg"
          alt="Red Cross"
          width={60}
          height={60}
          style={{ marginRight: 12 }}
        />
        <div>
          <Text strong style={{ fontSize: 20 }}>
            Hội Chữ Thập Đỏ Tỉnh Cao Bằng
          </Text>
          <br />
          <a href="/saoke-quy" style={{ fontSize: 16, color: "#52c41a" }}>
            Xem sao kê tài khoản
          </a>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <Text style={{ fontSize: 17 }}>
          <BankOutlined /> <b>Mục tiêu chiến dịch:</b>
        </Text>
        <br />
        <Text strong style={{ color: "red", fontSize: 25 }}>
          {goal.toLocaleString("vi-VN")} VND
        </Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 17 }}>
          <FieldTimeOutlined /> <b>Thời gian còn lại:</b>
        </Text>
        <br />
        <Text strong style={{ color: "red", fontSize: 25 }}>
          {remainingDays} ngày
        </Text>
      </div>

      <Progress
        percent={parseFloat(percent)}
        showInfo={false}
        strokeColor="linear-gradient(90deg, #b6eb7a 0%, #52c41a 100%)"
        style={{ marginBottom: 8 }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text>
          <CheckCircleOutlined /> Đã đạt được:{" "}
          <strong>{raised.toLocaleString("vi-VN")} VND</strong>
        </Text>
        <Text strong style={{ color: "#52c41a" }}>
          {percent}%
        </Text>
      </div>

      <Button
        type="primary"
        block
        size="large"
        style={{
          background: "linear-gradient(90deg, #a8e063 0%, #56ab2f 100%)",
          border: "none",
          borderRadius: "10px",
          fontWeight: 700,
          fontSize: "22px",
          height: 50,
          color: "white",
          letterSpacing: "0.5px",
          marginBottom: 20,
          transition: "all 0.5s ease",
          boxShadow: "0 4px 12px rgba(86,171,47,0.4)",
          backgroundSize: "200% 200%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundPosition = "right center";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundPosition = "left center";
        }}
        onClick={() => navigate("/donate")} 
      >
        Ủng hộ
      </Button>

      <div style={{ textAlign: "center" }}>
        <img
          src="https://redcross.org.vn/wp-content/uploads/2024/09/Ma-QR-Iraiser-ung-Ho-Bao-Yagi.png"
          alt="QR Code"
          width={230}
          height={230}
          style={{ borderRadius: "12px" }}
        />
        <p
          style={{
            marginTop: 8,
            fontSize: 15,
            color: "#555",
            fontStyle: "italic",
          }}
        >
          Quét mã QR để ủng hộ nhanh chóng và an toàn 💚
        </p>
      </div>
    </Card>
  );
};

export default FundInfoBox;
