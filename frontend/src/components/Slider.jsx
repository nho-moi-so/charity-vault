import React, { useRef } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const Slider = () => {
  const carouselRef = useRef(null);

  const images = [
    "https://static.thiennguyen.app/public/banner/2025/6/23/1aaada3e-e069-4d11-a0d2-455cf7a9de41.jpg",
    "https://i.pinimg.com/1200x/77/25/4a/77254ab021fdb14628909ee7fe55dfbd.jpg",
    "https://i.pinimg.com/1200x/8c/8b/06/8c8b06a8be90e5f09dc30b6f1fbe32f9.jpg",
    "https://i.pinimg.com/736x/30/bc/8f/30bc8f962a8167293595c0134050a927.jpg",
  ];

  const next = () => {
    carouselRef.current.next();
  };

  const prev = () => {
    carouselRef.current.prev();
  };

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <Carousel ref={carouselRef} autoplay dots={true}>
        {images.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`slide-${index}`}
              style={{
                width: "100%",
                height: "700px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        ))}
      </Carousel>

      <button
        onClick={prev}
        style={{
          position: "absolute",
          top: "50%",
          left: "30px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          border: "none",
          borderRadius: "50%",
          width: "45px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        <LeftOutlined style={{ fontSize: "20px" }} />
      </button>

      <button
        onClick={next}
        style={{
          position: "absolute",
          top: "50%",
          right: "30px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          border: "none",
          borderRadius: "50%",
          width: "45px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        <RightOutlined style={{ fontSize: "20px" }} />
      </button>
    </div>
  );
};

export default Slider;
