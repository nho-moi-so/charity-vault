import React from "react";
import { Card, Typography, Button, Progress } from "antd";
import {
  BankOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const FundInfoBox = ({ fund, blockchainData }) => {
  const navigate = useNavigate();

  if (!fund) return null;

  const goal = fund.goal || 100000000;
  // Ưu tiên lấy totalReceived từ blockchain nếu có, không thì lấy từ DB
  const raised = blockchainData
    ? parseFloat(blockchainData.totalReceived) * 1e18 // Convert ETH to Wei/Unit if needed, but here assuming VND for simplicity or need conversion logic
    : parseFloat(fund.totalReceived || 0);

  // Lưu ý: Ở đây đang giả định đơn vị tiền tệ là VND.
  // Nếu blockchain trả về ETH, cần convert hoặc hiển thị ETH.
  // Để đơn giản cho demo, ta hiển thị số raw hoặc format lại sau.

  // Tính ngày còn lại
  const endDate = fund.endDate ? new Date(fund.endDate) : new Date();
  const today = new Date();
  const timeDiff = endDate.getTime() - today.getTime();
  const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const percent = goal > 0 ? ((raised / goal) * 100).toFixed(1) : 0;

  // Thông tin người tạo
  const creatorName =
    fund.creatorInfo?.organization || fund.creatorInfo?.name || "Người gây quỹ";

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
        <div style={{ marginRight: 12 }}>
          {/* Placeholder avatar nếu không có logo */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            {creatorName.charAt(0).toUpperCase()}
          </div>
        </div>
        <div>
          <Text strong style={{ fontSize: 20 }}>
            {creatorName}
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
          {remainingDays > 0 ? remainingDays : 0} ngày
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
        onClick={() => navigate(`/donate/${fund.fundId}`)}
      >
        Ủng hộ
      </Button>

      <div style={{ textAlign: "center" }}>
        {fund.qrCode ? (
          <img
            src={fund.qrCode}
            alt="QR Code"
            width={230}
            height={230}
            style={{ borderRadius: "12px" }}
          />
        ) : (
          <div
            style={{
              width: 230,
              height: 230,
              margin: "0 auto",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              color: "#999",
            }}
          >
            Chưa có mã QR
          </div>
        )}

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
