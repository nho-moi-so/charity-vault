import React, { useState } from "react";
import { Card, Typography, Row, Col, Button, Progress } from "antd";
import { LeftOutlined, RightOutlined, PictureOutlined } from "@ant-design/icons";

const { Title, Text, Link } = Typography;

const campaigns = [
  {
    id: 1,
    title: "Chung Tay Vì Miền Trung",
    img: "https://cdn.pixabay.com/photo/2017/08/06/23/00/charity-2596422_1280.jpg",
    donated: 120000000,
    goal: 200000000,
    daysLeft: 12,
    fundName: "Quỹ Thiện Tâm Việt",
  },
  {
    id: 2,
    title: "Tiếp Sức Đến Trường",
    img: "https://i.pinimg.com/1200x/a4/77/f1/a477f1953b54dffd8961bb9fd9264c51.jpg",
    donated: 85000000,
    goal: 150000000,
    daysLeft: 20,
    fundName:
      "Quỹ Hy Vọng Xanh – Nơi kết nối yêu thương giúp trẻ em vùng cao tiếp tục hành trình đến trường",
  },
  {
    id: 3,
    title: "Tết Ấm Cho Người Nghèo",
    img: "",
    donated: 50000000,
    goal: 100000000,
    daysLeft: 8,
    fundName: "Quỹ Ánh Dương",
  },
  {
    id: 4,
    title: "Mùa Đông Không Lạnh",
    img: "https://taadgroup.vn/wp-content/uploads/2023/06/ao-am-cho-em-2022-1024x1024.jpg",
    donated: 90000000,
    goal: 120000000,
    daysLeft: 5,
    fundName: "Quỹ Trái Tim Hồng",
  },
  {
    id: 5,
    title: "Bữa Cơm Yêu Thương",
    img: "https://cdn.pixabay.com/photo/2017/08/02/23/27/people-2579317_1280.jpg",
    donated: 60000000,
    goal: 100000000,
    daysLeft: 15,
    fundName: "Quỹ Nụ Cười Việt",
  },
  {
    id: 6,
    title: "Ánh Sáng Cho Em",
    img: "https://cdn.pixabay.com/photo/2017/07/31/11/21/children-2553078_1280.jpg",
    donated: 70000000,
    goal: 120000000,
    daysLeft: 10,
    fundName: "Quỹ Hy Vọng Sáng",
  },
];

const FundOtherCampaigns = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCards = 3;

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? campaigns.length - visibleCards : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCards >= campaigns.length ? 0 : prev + 1
    );
  };

  const visibleCampaigns = campaigns
    .slice(startIndex, startIndex + visibleCards)
    .concat(
      startIndex + visibleCards > campaigns.length
        ? campaigns.slice(0, (startIndex + visibleCards) % campaigns.length)
        : []
    );

  const formatMoney = (num) => num.toLocaleString("vi-VN") + "₫";

  return (
    <div
      style={{
        marginTop: 50,
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        padding: "30px 40px",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Các chiến dịch gây quỹ khác
        </Title>
        <Link
          href="/funds"
          style={{
            fontSize: 16,
            color: "#117529ff",
            fontWeight: 500,
          }}
        >
          Xem tất cả →
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Button shape="circle" icon={<LeftOutlined />} onClick={handlePrev} />

        <Row gutter={[24, 24]} style={{ flex: 1 }}>
          {visibleCampaigns.map((item) => {
            const percent = Math.min((item.donated / item.goal) * 100, 100);
            return (
              <Col xs={24} sm={12} md={8} key={item.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    height: "100%",
                    position: "relative",
                    borderColor: "#52c41a30",
                  }}
                  cover={
                    <div
                      style={{
                        position: "relative",
                        height: 240,
                        background: item.img ? "#f0f0f0" : "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.img ? (
                        <img
                          alt={item.title}
                          src={item.img}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }}
                        />
                      ) : (
                        <PictureOutlined
                          style={{ fontSize: 48, color: "#bbb" }}
                        />
                      )}

                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          background: "rgba(255, 255, 255, 0.95)",
                          color: "#117529",
                          padding: "4px 10px",
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        ⏰ {item.daysLeft} ngày còn lại
                      </div>
                    </div>
                  }
                >
                  <h3
                    style={{
                      color: "#117529",
                      marginBottom: 8,
                      fontWeight: "bold",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: 50,
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Tên quỹ */}
                  <div
                    style={{
                      color: "rgba(0, 0, 0, 0.45)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: "20px",
                      height: "40px",
                      marginBottom: 8,
                    }}
                  >
                    {item.fundName}
                  </div>

                  <Progress
                    percent={percent}
                    showInfo={false}
                    strokeColor="#52c41a"
                    trailColor="#f0f0f0"
                    style={{ marginTop: 4, marginBottom: 8 }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                    }}
                  >
                    <Text strong style={{ color: "#117529" }}>
                      {formatMoney(item.donated)}
                    </Text>
                    <Text type="secondary">{formatMoney(item.goal)}</Text>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Button shape="circle" icon={<RightOutlined />} onClick={handleNext} />
      </div>
    </div>
  );
};

export default FundOtherCampaigns;
