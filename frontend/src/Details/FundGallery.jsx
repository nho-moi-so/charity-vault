import React, { useState, useRef } from "react";
import { Image } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const FundGallery = () => {
  const thumbnails = [
    "https://i.pinimg.com/736x/18/37/d6/1837d62b24f71016365c97ae4df12c0a.jpg",
    "https://i.pinimg.com/736x/2b/69/a8/2b69a886f1785faa63853dae3a5b546c.jpg",
    "https://i.pinimg.com/736x/21/72/17/21721718c8f434b705a2034223911799.jpg",
    "https://i.pinimg.com/736x/a0/b5/7e/a0b57eea813c891c3f93b511db209421.jpg",
    "https://i.pinimg.com/736x/30/9a/37/309a3761e71586b3b017b32760247b64.jpg",
    "https://i.pinimg.com/736x/1b/f5/9f/1bf59fdbf3f26e2d0b14d64a23f0246a.jpg",
  ];

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
