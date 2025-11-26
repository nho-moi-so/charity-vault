import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Progress, Spin } from "antd";
import { fundAPI } from "../services/api";
import { weiToVND, isLikelyWei } from "../utils/currencyHelper";
import { getCurrentEthPrice } from "../services/Web3Service";

const FeaturedCampaigns = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ethPrice, setEthPrice] = useState(80000000); // Default ETH price
  const navigate = useNavigate();
  const visibleCount = 3;

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
    fetchFeaturedCampaigns();
  }, []);

  const fetchFeaturedCampaigns = async () => {
    try {
      setLoading(true);
      // Lấy top 5 quỹ mới nhất hoặc có số tiền quyên góp cao nhất
      const response = await fundAPI.getAll({ page: 1, limit: 5 });

      if (response.data.success) {
        const mappedCampaigns = response.data.funds.map((fund) => {
          // Convert donated amount from Wei to VND if needed
          let donatedAmount = 0;
          if (fund.totalReceived) {
            if (isLikelyWei(fund.totalReceived)) {
              donatedAmount = weiToVND(fund.totalReceived, ethPrice);
            } else {
              donatedAmount = parseFloat(fund.totalReceived);
            }
          }
          const endDate = fund.endDate ? new Date(fund.endDate) : new Date();
          const today = new Date();
          const timeDiff = endDate.getTime() - today.getTime();
          const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

          return {
            id: fund.fundId,
            title: fund.title,
            description: fund.metadataURI || "Quỹ từ thiện ý nghĩa",
            image:
              fund.images?.main ||
              "https://cdn.pixabay.com/photo/2017/08/06/23/00/charity-2596422_1280.jpg",
            remainingDays: remainingDays > 0 ? remainingDays : 0,
            goal: fund.goal,
            donated: donatedAmount,
          };
        });

        setCampaigns(mappedCampaigns);
      }
    } catch (error) {
      console.error("Error fetching featured campaigns:", error);
      // Fallback to empty array
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? campaigns.length - visibleCount : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= campaigns.length ? 0 : prev + 1
    );
  };

  const formatMoney = (num) => num.toLocaleString("vi-VN") + "₫";

  if (loading) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "50px 0",
          textAlign: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return null; // Không hiển thị nếu không có quỹ
  }

  const visibleItems = campaigns.slice(startIndex, startIndex + visibleCount);
  const itemsToDisplay =
    visibleItems.length < visibleCount
      ? [
          ...visibleItems,
          ...campaigns.slice(0, visibleCount - visibleItems.length),
        ]
      : visibleItems;

  return (
    <div
      style={{
        background: "#fff",
        padding: "50px 0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "1500px",
          margin: "0 auto 40px auto",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            margin: 0,
          }}
        >
          Các chiến dịch nổi bật
        </h2>
        <a
          href="/funds"
          style={{
            position: "absolute",
            right: "150px",
            bottom: "-22px",
            color: "#117529",
            fontSize: "15px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Xem tất cả →
        </a>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {campaigns.length > visibleCount && (
          <button
            onClick={handlePrev}
            style={{
              background: "none",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "#333",
              marginRight: "10px",
            }}
          >
            <LeftOutlined />
          </button>
        )}

        <div
          style={{
            display: "flex",
            gap: "30px",
            overflow: "hidden",
            width: "80%",
            justifyContent: "center",
          }}
        >
          {itemsToDisplay.map((item, index) => {
            const percent = Math.min((item.donated / item.goal) * 100, 100);
            return (
              <div
                key={index}
                onClick={() => navigate(`/funds/${item.id}`)} // 👉 điều hướng khi click
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  width: "30%",
                  minWidth: "250px",
                  textAlign: "left",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-6px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "rgba(255,255,255,0.9)",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      color: "#117529",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    ⏰ {item.remainingDays} ngày còn lại
                  </div>
                </div>

                <div style={{ padding: "15px" }}>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#117529",
                      marginBottom: "8px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "48px",
                    }}
                  >
                    {item.title}
                  </h3>

                  <Progress
                    percent={percent}
                    showInfo={false}
                    strokeColor="#52c41a"
                    trailColor="#f0f0f0"
                    style={{ marginBottom: "10px" }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ color: "#117529", fontWeight: 600 }}>
                      {formatMoney(item.donated)}
                    </span>
                    <span style={{ color: "#999" }}>
                      {formatMoney(item.goal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {campaigns.length > visibleCount && (
          <button
            onClick={handleNext}
            style={{
              background: "none",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "#333",
              marginLeft: "10px",
            }}
          >
            <RightOutlined />
          </button>
        )}
      </div>
    </div>
  );
};

export default FeaturedCampaigns;
