import { useEffect, useState } from "react";
import { fundAPI } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Col, Progress, Row, Typography } from "antd";
import {
  LeftOutlined,
  PictureOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { weiToVND, isLikelyWei } from "../utils/currencyHelper";
import { getCurrentEthPrice } from "../services/Web3Service";

const { Title, Text } = Typography;

const FundOtherCampaigns = ({ currentFundId }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [ethPrice, setEthPrice] = useState(80000000); // Default ETH price
  const visibleCards = 3;
  const navigate = useNavigate();

  // Fetch ETH price
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const price = await getCurrentEthPrice();
        setEthPrice(price);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    };
    fetchEthPrice();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fundAPI.getAll();
        if (response.data.success) {
          // Lọc bỏ quỹ hiện tại
          const otherFunds = response.data.funds.filter(
            (f) => f.fundId !== currentFundId && f._id !== currentFundId
          );
          setCampaigns(otherFunds);
        }
      } catch (error) {
        console.error("Error fetching other campaigns:", error);
      }
    };

    fetchCampaigns();
  }, [currentFundId]);

  if (campaigns.length === 0) return null;

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
          to="/funds"
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
            const goal = item.goal || 1;

            // Convert donated amount from Wei to VND if needed
            let donated = 0;
            if (item.totalReceived) {
              if (isLikelyWei(item.totalReceived)) {
                donated = weiToVND(item.totalReceived, ethPrice);
              } else {
                donated = parseFloat(item.totalReceived);
              }
            }

            const percent = Math.min((donated / goal) * 100, 100);

            // Tính ngày còn lại
            const endDate = item.endDate ? new Date(item.endDate) : new Date();
            const today = new Date();
            const timeDiff = endDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

            const creatorName =
              item.creatorInfo?.organization ||
              item.creatorInfo?.name ||
              "Người gây quỹ";

            return (
              <Col xs={24} sm={12} md={8} key={item._id || item.fundId}>
                <Card
                  hoverable
                  onClick={() => navigate(`/funds/${item.fundId}`)}
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
                      {item.image ? (
                        <img
                          alt={item.title}
                          src={item.image}
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
                        ⏰ {daysLeft > 0 ? daysLeft : 0} ngày còn lại
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
                    {creatorName}
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
                      {formatMoney(donated)}
                    </Text>
                    <Text type="secondary">{formatMoney(goal)}</Text>
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
