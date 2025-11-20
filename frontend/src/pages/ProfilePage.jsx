import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import Navbar from "../components/Navbar";
import CoverSection from "../Profiles/CoverSection";
import Infor from "../Profiles/Infor";
import Thongke from "../Profiles/Thongke";
import Lichsugiaodich from "../Profiles/Lichsugiaodich";
import FooterSection from "../components/FooterSection";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  if (!user) return <p>Đang tải...</p>;

  return (
    <div>
      <Navbar />
      <CoverSection user={user} />
      <div style={{ maxWidth: 1500, margin: "0 auto", padding: "10px 20px 40px" }}>
        <Row gutter={20}>
          <Col span={8}>
            <Infor user={user} />
          </Col>
          <Col span={16}>
            <Thongke user={user} />
            <Lichsugiaodich />
          </Col>
        </Row>
      </div>

      <FooterSection />
    </div>
  );
};

export default ProfilePage;
