// File: pages/GioiThieuQuy.jsx
import React from "react";
import { Typography, Row, Col, Card, Divider, Image } from "antd";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";

const { Title, Paragraph, Text } = Typography;

const GioiThieuQuy = () => {
  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <Title level={2} style={{ color: "#1e9c45" }}>
          GIỚI THIỆU VỀ QUỸ QUYÊN GÓP MINH BẠCH
        </Title>

        <Paragraph style={{ fontSize: 16, color: "#555", maxWidth: 900, margin: "20px auto" }}>
          Nền tảng <Text strong>Quỹ Quyên Góp Minh Bạch</Text> ra đời với sứ mệnh mang đến 
          một hệ thống gây quỹ và quyên góp công khai, minh bạch, giúp mọi cá nhân và tổ chức 
          có thể dễ dàng kết nối, đóng góp và theo dõi từng khoản hỗ trợ đến tay người cần giúp đỡ.
        </Paragraph>

        <Divider />

        <Row gutter={[24, 24]} justify="center" style={{ marginTop: 40 }}>
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{
                height: "100%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                borderRadius: 12,
              }}
            >
              <Image
                src="https://cdn.pixabay.com/photo/2016/10/29/09/16/charity-1776925_1280.jpg"
                alt="Minh bạch"
                preview={false}
                style={{ borderRadius: 10, height: 200, objectFit: "cover" }}
              />
              <Title level={4} style={{ marginTop: 20 }}>
                Minh bạch tuyệt đối
              </Title>
              <Paragraph style={{ color: "#555" }}>
                Mọi giao dịch quyên góp, chi tiêu và sao kê đều được công khai để người ủng hộ 
                dễ dàng theo dõi và giám sát.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{
                height: "100%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                borderRadius: 12,
              }}
            >
              <Image
                src="https://cdn.pixabay.com/photo/2016/11/29/04/00/hand-1868102_1280.jpg"
                alt="Kết nối cộng đồng"
                preview={false}
                style={{ borderRadius: 10, height: 200, objectFit: "cover" }}
              />
              <Title level={4} style={{ marginTop: 20 }}>
                Kết nối cộng đồng
              </Title>
              <Paragraph style={{ color: "#555" }}>
                Kết nối các nhà hảo tâm, tổ chức và người cần giúp đỡ thông qua 
                nền tảng đáng tin cậy và thuận tiện.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{
                height: "100%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                borderRadius: 12,
              }}
            >
              <Image
                src="https://cdn.pixabay.com/photo/2015/09/02/13/24/hands-918778_1280.jpg"
                alt="Hiệu quả và tin cậy"
                preview={false}
                style={{ borderRadius: 10, height: 200, objectFit: "cover" }}
              />
              <Title level={4} style={{ marginTop: 20 }}>
                Hiệu quả & Tin cậy
              </Title>
              <Paragraph style={{ color: "#555" }}>
                Đảm bảo tiền ủng hộ đến đúng nơi, đúng người, đúng mục đích. 
                Mọi quỹ đều được xác minh kỹ lưỡng trước khi hoạt động.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <Divider style={{ margin: "60px 0" }} />

        <Title level={3} style={{ color: "#1e9c45" }}>
          Tầm nhìn & Sứ mệnh
        </Title>
        <Paragraph style={{ fontSize: 16, color: "#555", maxWidth: 900, margin: "0 auto" }}>
          Chúng tôi hướng tới xây dựng một cộng đồng thiện nguyện số hóa, nơi mọi hành động 
          giúp đỡ đều được ghi nhận, lan tỏa và minh bạch. Sự tin tưởng của bạn là động lực 
          để chúng tôi tiếp tục phát triển và hoàn thiện hệ thống.
        </Paragraph>
      </div>

      <FooterSection />
    </>
  );
};

export default GioiThieuQuy;
