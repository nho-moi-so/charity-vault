import React, { useState } from "react";
import { Typography, Table, Divider, Tabs, Pagination } from "antd";
import { HeartFilled, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const FundDescription = () => {
  // Dữ liệu thật mẫu
  const donors = [
    { key: 1, name: "NGUYEN VAN AN", amount: 500000, time: "06/11/2025 09:15:22" },
    { key: 2, name: "TRAN THI MAI", amount: 2000000, time: "06/11/2025 10:02:11" },
    { key: 3, name: "LE HOANG MINH", amount: 1000000, time: "06/11/2025 10:48:35" },
    { key: 4, name: "PHAM QUANG HUY", amount: 1500000, time: "06/11/2025 11:20:05" },
    { key: 5, name: "NGO BAO CHAU", amount: 250000, time: "06/11/2025 11:59:42" },
    { key: 6, name: "VU THI TRA MY", amount: 3000000, time: "06/11/2025 12:24:10" },
    { key: 7, name: "HOANG GIA HAN", amount: 700000, time: "06/11/2025 13:18:07" },
    { key: 8, name: "DANG NHAT NAM", amount: 500000, time: "06/11/2025 13:59:55" },
    { key: 9, name: "NGUYEN THI NGOC", amount: 1200000, time: "06/11/2025 14:25:44" },
    { key: 10, name: "PHAN THANH BINH", amount: 800000, time: "06/11/2025 14:59:00" },
    { key: 11, name: "DO MY DUNG", amount: 600000, time: "06/11/2025 15:22:33" },
    { key: 12, name: "TRUONG CONG DANH", amount: 1000000, time: "06/11/2025 15:57:41" },
    { key: 13, name: "NGUYEN BAO VY", amount: 500000, time: "06/11/2025 16:14:10" },
    { key: 14, name: "LAM KHANH HOA", amount: 1500000, time: "06/11/2025 16:49:58" },
    { key: 15, name: "PHAM TUAN KIET", amount: 200000, time: "06/11/2025 17:08:22" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentDonors = donors.slice(startIndex, endIndex);

  const columns = [
    {
      title: <b>Tên người ủng hộ</b>,
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: <b>Số tiền</b>,
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (amount) => (
        <Text style={{ color: "#52c41a", fontWeight: 600 }}>
          +{amount.toLocaleString("vi-VN")} VND
        </Text>
      ),
    },
    {
      title: <b>Thời gian</b>,
      dataIndex: "time",
      key: "time",
      align: "center",
      render: (time) => <Text type="secondary">{time}</Text>,
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: "24px 32px",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        marginTop: 40,
      }}
    >
      <Tabs
        defaultActiveKey="1"
        size="large"
        tabPosition="top"
        tabBarStyle={{
          fontWeight: "bold",
          textAlign: "left",
          justifyContent: "flex-start",
          display: "flex",
          gap: 20,
        }}
        items={[
          {
            key: "1",
            label: (
              <span>
                <InfoCircleOutlined /> Giới thiệu
              </span>
            ),
            children: (
              <div>
                <Title level={3} style={{ color: "#52c41a" }}>
                  🌿 Giới thiệu về chiến dịch
                </Title>
                <Paragraph
                  style={{ fontSize: "16px", lineHeight: "1.8", color: "#444" }}
                >
                  Chiến dịch <b>“Chung Tay Vì Miền Núi Cao Bằng”</b> được phát
                  động bởi <b>Hội Chữ Thập Đỏ Tỉnh Cao Bằng</b> nhằm hỗ trợ đồng
                  bào vùng cao có hoàn cảnh khó khăn, đặc biệt là các hộ dân bị
                  ảnh hưởng bởi thiên tai, thiếu thốn lương thực và điều kiện
                  sinh hoạt.
                </Paragraph>
                <Paragraph
                  style={{ fontSize: "16px", lineHeight: "1.8", color: "#444" }}
                >
                  Mọi khoản đóng góp đều được ghi nhận và công khai minh bạch
                  trên hệ thống. Chúng tôi cam kết toàn bộ số tiền quyên góp sẽ
                  được sử dụng đúng mục đích và cập nhật tiến trình thường xuyên
                  để cộng đồng cùng theo dõi.
                </Paragraph>
              </div>
            ),
          },
          {
            key: "2",
            label: (
              <span>
                <HeartFilled style={{ color: "#ff4d4f" }} /> Người ủng hộ
              </span>
            ),
            children: (
              <div>
                <Title level={3} style={{ color: "#52c41a" }}>
                  ❤️ Danh sách người ủng hộ
                </Title>
                <Divider style={{ margin: "12px 0" }} />

                <Table
                  dataSource={currentDonors}
                  columns={columns}
                  pagination={false}
                  bordered={false}
                  style={{ borderRadius: "12px" }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 24,
                  }}
                >
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={donors.length}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                  />
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default FundDescription;
