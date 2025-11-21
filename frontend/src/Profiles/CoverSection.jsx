import React, { useState, useRef, useEffect } from "react";
import { Avatar, message } from "antd";

const defaultCover = "https://cdn.pixabay.com/photo/2021/08/20/03/57/boy-6559419_1280.jpg";
const defaultAvatar = "https://i.pinimg.com/736x/06/27/e4/0627e47e1b9c55a407132520dcf6091b.jpg";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const CoverSection = ({ user, onProfileUpdate }) => {
  const [cover, setCover] = useState(user.cover || defaultCover);
  const [avatar, setAvatar] = useState(user.avatar || defaultAvatar);
  const [updatingField, setUpdatingField] = useState(null);

  const [hoverCover, setHoverCover] = useState(false);
  const [hoverAvatar, setHoverAvatar] = useState(false);

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    setCover(user.cover || defaultCover);
  }, [user.cover]);

  useEffect(() => {
    setAvatar(user.avatar || defaultAvatar);
  }, [user.avatar]);

  const handleImageUpdate = async (file, field) => {
    if (!file || !onProfileUpdate) return;
    try {
      setUpdatingField(field);
      const base64 = await fileToBase64(file);
      if (field === "cover") {
        setCover(base64);
      } else {
        setAvatar(base64);
      }
      await onProfileUpdate({ [field]: base64 });
      message.success("Đã cập nhật ảnh thành công!");
    } catch (error) {
      message.error("Không thể cập nhật ảnh. Vui lòng thử lại.");
      if (field === "cover") {
        setCover(user.cover || defaultCover);
      } else {
        setAvatar(user.avatar || defaultAvatar);
      }
    } finally {
      setUpdatingField(null);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    handleImageUpdate(file, "cover");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    handleImageUpdate(file, "avatar");
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{ height: 500, width: "100%", position: "relative" }}
        onMouseEnter={() => setHoverCover(true)}
        onMouseLeave={() => setHoverCover(false)}
        onClick={() => coverInputRef.current.click()} 
      >
        <img
          src={cover}
          alt="cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {hoverCover && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Thay đổi ảnh bìa
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          style={{ display: "none" }}
          onChange={handleCoverChange}
        />
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          display: "flex",
          alignItems: "center",
          top: -75,
          gap: 20,
        }}
      >
        <div
          style={{ position: "relative", cursor: "pointer" }}
          onMouseEnter={() => setHoverAvatar(true)}
          onMouseLeave={() => setHoverAvatar(false)}
          onClick={() => avatarInputRef.current.click()} 
        >
          <Avatar
            src={avatar}
            size={150}
            style={{ border: "3px solid #fff", top: "20px" }}
          />
          {hoverAvatar && (
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: 0,
                width: 150,
                height: 150,
                backgroundColor: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "50%",
              }}
            >
              Thay ảnh
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={avatarInputRef}
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>

        <div>
          <h2 style={{ marginTop: "80px", fontWeight: "bold" }}>
            {user.username || "Người dùng"}
          </h2>
          <p style={{ marginTop: -10, color: "#888" }}>
            {user.address
              ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
              : "@unknown"}
          </p>
          {updatingField && (
            <p style={{ color: "#52c41a", fontSize: 12 }}>Đang cập nhật ảnh...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverSection;
