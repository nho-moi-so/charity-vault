import React, { useState, useRef } from "react";
import { Image } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const FundGallery = ({ fund }) => {
  // Tạo danh sách ảnh từ dữ liệu quỹ
  const images = [];

  if (fund?.image) {
    images.push(fund.image);
  }

  if (fund?.thumbnails && Array.isArray(fund.thumbnails)) {
    images.push(...fund.thumbnails);
  }

  // Nếu không có ảnh nào, dùng ảnh placeholder
  if (images.length === 0) {
    images.push("https://via.placeholder.com/800x600?text=No+Image");
  }

  const thumbnails = images;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainSlider = useRef(null);
  const thumbSlider = useRef(null);

  const Arrow = ({ onClick, direction }) => (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        [direction === "left" ? "left" : "right"]: "15px",
        transform: "translateY(-50%)",
        background: "rgba(255, 255, 255, 0.8)",
        borderRadius: "50%",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 2,
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
      }}
    >
      {direction === "left" ? <LeftOutlined /> : <RightOutlined />}
    </div>
  );

  const mainSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
    beforeChange: (_, next) => setSelectedIndex(next),
  };

  const thumbSettings = {
    dots: false,
    infinite: thumbnails.length > 5,
    slidesToShow: Math.min(5, thumbnails.length),
    slidesToScroll: 1,
    speed: 300,
    arrows: true,
    nextArrow: <Arrow direction="right" />,
    prevArrow: <Arrow direction="left" />,
    focusOnSelect: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } },
    ],
  };

  return (
    <div style={{ position: "relative" }}>
      <Slider ref={mainSlider} {...mainSettings}>
        {thumbnails.map((img, idx) => (
          <div key={idx}>
            <Image
              src={img}
              alt={`Ảnh ${idx + 1}`}
              width="100%"
              height={600}
              style={{
                objectFit: "cover",
                borderRadius: "16px",
              }}
              preview={false}
            />
          </div>
        ))}
      </Slider>

      <div style={{ marginTop: 16 }}>
        <Slider ref={thumbSlider} {...thumbSettings}>
          {thumbnails.map((img, idx) => (
            <div key={idx} style={{ padding: "0 6px" }}>
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                preview={false}
                style={{
                  width: "100%",
                  height: 90,
                  borderRadius: "10px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border:
                    selectedIndex === idx
                      ? "2px solid #52c41a"
                      : "1px solid #ddd",
                  transition: "0.3s",
                }}
                onClick={() => {
                  setSelectedIndex(idx);
                  mainSlider.current.slickGoTo(idx);
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default FundGallery;
