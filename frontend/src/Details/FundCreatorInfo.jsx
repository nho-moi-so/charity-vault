import React from "react";
import { Card, Typography, Space, Image } from "antd";
import {
  HomeOutlined,
  MailOutlined,
  FacebookOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Text, Link, Title } = Typography;

const FundCreatorInfo = ({ fund }) => {
  const creator = fund?.creator || fund?.creatorInfo || {};
  const creatorName = creator.organization || creator.name || "Người gây quỹ";
  const creatorAddress = creator.address || "Chưa cập nhật";
  const creatorEmail = creator.email || "Chưa cập nhật";
  const creatorPhone = creator.phone || "Chưa cập nhật";
  const creatorFacebook = creator.facebook || "Chưa cập nhật";

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        marginTop: 20,
        padding: "30px 40px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Charity_logo.svg/512px-Charity_logo.svg.png"
          alt="Logo Quỹ Thiện Nguyện"
          width={140}
          preview={false}
          style={{ marginBottom: 16, borderRadius: "50%" }}
        />

        <Title
          level={3}
          style={{
            color: "#1677ff",
            fontWeight: 700,
            margin: 0,
          }}
        >
          {creatorName}
        </Title>
      </div>

      <Space
        direction="vertical"
        size="large"
        style={{
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <Space>
          <HomeOutlined style={{ color: "#52c41a", fontSize: 20 }} />
          <Text strong>Địa chỉ:</Text>
          <Text>{creatorAddress}</Text>
        </Space>

        <Space>
          <MailOutlined style={{ color: "#faad14", fontSize: 20 }} />
          <Text strong>Email:</Text>
          <Link
            href={`mailto:${creatorEmail}`}
            style={{ transition: "color 0.3s" }}
          >
            {creatorEmail}
          </Link>
        </Space>

        <Space>
          <FacebookOutlined style={{ color: "#1677ff", fontSize: 20 }} />
          <Text strong>Facebook:</Text>
          <Link
            href={
              creatorFacebook !== "Chưa cập nhật" ? creatorFacebook : undefined
            }
            target="_blank"
            style={{ transition: "color 0.3s" }}
          >
            {creatorFacebook}
          </Link>
        </Space>

        <Space>
          <PhoneOutlined style={{ color: "#eb2f96", fontSize: 20 }} />
          <Text strong>Số điện thoại:</Text>
          <Text>{creatorPhone}</Text>
        </Space>
      </Space>
    </Card>
  );
};

export default FundCreatorInfo;
