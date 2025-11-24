import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CloudOutlined,
  HeartOutlined,
  HomeOutlined,
  MoonOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  SmileOutlined,
  AlertOutlined,
  BookOutlined,
  UserOutlined,
  AppstoreOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const categories = [
  { icon: <CloudOutlined />, name: "Thiên tai" },
  { icon: <HeartOutlined />, name: "Xóa nghèo" },
  { icon: <AlertOutlined />, name: "Xóa đói" },
  { icon: <SmileOutlined />, name: "Trẻ em" },
  { icon: <HomeOutlined />, name: "Người cao tuổi" },
  { icon: <UserOutlined />, name: "Người khuyết tật" },
  { icon: <AlertOutlined />, name: "Bệnh hiểm nghèo" },
  { icon: <TeamOutlined />, name: "Dân tộc thiểu số" },
  { icon: <MoonOutlined />, name: "Người vô gia cư" },
  { icon: <EnvironmentOutlined />, name: "Môi trường" },
  { icon: <BookOutlined />, name: "Giáo dục" },
  { icon: <AppstoreOutlined />, name: "Khác" },
];

const Categories = () => {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? categories.length - visibleCount : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= categories.length ? 0 : prev + 1
    );
  };

  const handleCategoryClick = (categoryName) => {
    // Chuyển sang trang FundList và truyền category qua query param
    navigate(`/funds?category=${encodeURIComponent(categoryName)}`);
  };

  const visibleItems = categories.slice(startIndex, startIndex + visibleCount);

  const itemsToDisplay =
    visibleItems.length < visibleCount
      ? [
          ...visibleItems,
          ...categories.slice(0, visibleCount - visibleItems.length),
        ]
      : visibleItems;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        padding: "30px 0",
      }}
    >
      <button
        onClick={handlePrev}
        style={{
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "#333",
          marginRight: "10px",
        }}
      >
        <LeftOutlined />
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          overflow: "hidden",
          marginTop: "20px",
          width: "80%",
          maxWidth: "1200px",
        }}
      >
        {itemsToDisplay.map((item, index) => (
          <div
            key={index}
            style={{
              flex: "1",
              textAlign: "center",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => handleCategoryClick(item.name)}
          >
            <div
              style={{
                fontSize: "30px",
                color: "#52c41a",
                marginBottom: "8px",
              }}
            >
              {item.icon}
            </div>
            <div style={{ color: "#333", fontWeight: 500 }}>{item.name}</div>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        style={{
          background: "none",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "#333",
          marginLeft: "10px",
        }}
      >
        <RightOutlined />
      </button>
    </div>
  );
};

export default Categories;
