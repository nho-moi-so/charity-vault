import React, { useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const persons = [
  {
    name: "Hội Chữ Thập Đỏ Việt Nam",
    image:
      "https://i.pinimg.com/1200x/a4/0b/05/a40b050278d6c4ba8f9f959100722ad8.jpg",
  },
  {
    name: "Mặt Trận Tổ Quốc Việt Nam",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a2/Bi%E1%BB%83u_tr%C6%B0ng_M%E1%BA%B7t_tr%E1%BA%ADn_T%E1%BB%95_qu%E1%BB%91c_Vi%E1%BB%87t_Nam.svg",
  },
  {
    name: "Quỹ Bảo Trợ Trẻ Em Việt Nam",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk0kwAdukd5cTYdHuJktbTOMgj4_TwiJa7kQ&s",
  },
  {
    name: "Quỹ Từ Thiện Việt Nam",
    image:
      "https://bcp.cdnchinhphu.vn/Uploaded/phungthithuhuyen/2018_10_30/index.png",
  },
  {
    name: "Quỹ Từ Thiện Tu Viện Tường Vân",
    image:
      "https://quytuvientuongvan.com/wp-content/uploads/2016/10/final-logo-white-bg.png",
  },
];

const CaNhanNoiBat = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? persons.length - visibleCount : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= persons.length ? 0 : prev + 1
    );
  };

  const visibleItems = persons.slice(startIndex, startIndex + visibleCount);
  const itemsToDisplay =
    visibleItems.length < visibleCount
      ? [
          ...visibleItems,
          ...persons.slice(0, visibleCount - visibleItems.length),
        ]
      : visibleItems;

  return (
    <div
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/005/180/314/non_2x/green-abstract-background-with-modern-style-wave-background-illustration-vector.jpg?auto=compress')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "20px",
        padding: "60px 0",
        textAlign: "center",
      }}
    >
      <div style={{ position: "relative", marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            margin: "0 auto",
            color: "#040404ff",
          }}
        >
          Các cá nhân gây quỹ nổi bật
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <button
          onClick={handlePrev}
          style={{
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "#fff",
            marginRight: "10px",
          }}
        >
          <LeftOutlined />
        </button>

        <div
          style={{
            display: "flex",
            gap: "25px",
            overflow: "hidden",
            justifyContent: "center",
            width: "80%",
          }}
        >
          {itemsToDisplay.map((item, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255, 255, 255, 0.92)",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                overflow: "hidden",
                width: "30%",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                padding: "20px",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "contain",
                  marginBottom: "15px",
                  borderRadius: "8px",
                }}
              />
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#222",
                  margin: 0,
                }}
              >
                {item.name}
              </h3>
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
            color: "#fff",
            marginLeft: "10px",
          }}
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
};

export default CaNhanNoiBat;
