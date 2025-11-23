import React from "react";
import { Row, Col } from "antd";
import { DollarOutlined, FundOutlined } from "@ant-design/icons";

const Thongke = ({ user, stats }) => {
  const totalDonated = stats?.totalDonated || Number(user.totalDonated || 0);
  const totalFunds =
    stats?.totalFunds || user.totalFundsCreated || user.totalFunds || 0;

  const cardStyle = {
    background: "rgba(255,255,255,0.8)",
    borderRadius: 10,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  };

  const topStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  };

  const numberStyle = {
    fontSize: 24,
    color: "red",
    fontWeight: "bold",
    marginTop: 10,
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://i.pinimg.com/736x/d2/45/e6/d245e6ba6c9dedbd20f78bc2aa43d19b.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px",
        borderRadius: 10,
      }}
    >
      <Row gutter={20} justify="center">
        <Col xs={24} sm={12}>
          <div style={cardStyle}>
            <div style={topStyle}>
              <DollarOutlined style={{ fontSize: 40, color: "#52c41a" }} />
              <span style={{ fontWeight: "bold", fontSize: 16 }}>
                Tổng tiền đã ủng hộ
              </span>
            </div>
            <div style={numberStyle}>{totalDonated.toLocaleString()} VNĐ</div>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div style={cardStyle}>
            <div style={topStyle}>
              <FundOutlined style={{ fontSize: 40, color: "#1890ff" }} />
              <span style={{ fontWeight: "bold", fontSize: 16 }}>
                Tổng số quỹ đã tham gia
              </span>
            </div>
            <div style={numberStyle}>{totalFunds}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Thongke;
