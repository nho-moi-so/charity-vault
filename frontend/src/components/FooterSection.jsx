import React from "react";

const FooterSection = () => {
  return (
    <footer
      style={{
        backgroundColor: "#fff",
        padding: "50px 20px 20px",
        textAlign: "center",
        color: "#333",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <div>
        <img
          src="https://vn-test-11.slatic.net/shop/ef696bbfa65b218629e1ee20923b731e.jpeg"
          alt="Logo"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "contain",
            marginBottom: "15px",
          }}
        />
      </div>

      <p
        style={{
          fontSize: "18px",
          fontWeight: "500",
          color: "#4b4b4b",
          marginBottom: "30px",
          fontStyle: "italic",
        }}
      >
        “Chung tay trao yêu thương, cùng nhau tạo niềm tin”
      </p>

      <hr
        style={{
          width: "60%",
          margin: "0 auto 25px",
          border: "none",
          height: "1px",
          backgroundColor: "#ddd",
        }}
      />

      <div style={{ fontSize: "14px", color: "#777" }}>
        <p>© 2025 Cổng Gây Quỹ Minh Bạch | Mọi quyền được bảo lưu.</p>
        <p>Email: lienhe@gayquyminhbach.vn | Hotline: 0123 456 789</p>
        <p>Địa chỉ: 123 Đường 456, Quận 789, TP. 000</p>
      </div>
    </footer>
  );
};

export default FooterSection;
