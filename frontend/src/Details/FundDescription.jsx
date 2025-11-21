import React, { useState, useEffect } from "react";
import { Typography, Table, Divider, Tabs, Pagination, Spin } from "antd";
import { HeartFilled, InfoCircleOutlined } from "@ant-design/icons";
import { donationAPI } from "../services/api";

const { Title, Paragraph, Text } = Typography;

const FundDescription = ({ fund }) => {
  const [donors, setDonors] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDonors, setTotalDonors] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (fund?.fundId) {
      fetchDonors();
    }
  }, [fund, currentPage]);

  const fetchDonors = async () => {
    try {
      setLoadingDonors(true);
      const response = await donationAPI.getFundHistory(fund.fundId, {
        page: currentPage,
        limit: pageSize
      });
      if (response.data.success) {
        setDonors(response.data.donations);
        setTotalDonors(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch donors:", error);
    } finally {
      setLoadingDonors(false);
    }
  };

  const columns = [
    {
      title: <b>Tên người ủng hộ</b>,
      dataIndex: "donor", // Dùng address nếu không có tên
      key: "donor",
      render: (text) => <Text strong>{text.slice(0, 6)}...{text.slice(-4)}</Text>,
    },
    {
      title: <b>Số tiền</b>,
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (amount) => (
        <Text style={{ color: "#52c41a", fontWeight: 600 }}>
          +{parseFloat(amount).toLocaleString("vi-VN")} ETH
        </Text>
      ),
    },
    {
      title: <b>Thời gian</b>,
      dataIndex: "timestamp",
      key: "timestamp",
      align: "center",
      render: (time) => <Text type="secondary">{new Date(time).toLocaleString()}</Text>,
    },
  ];

  if (!fund) return null;

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
                  style={{ fontSize: "16px", lineHeight: "1.8", color: "#444", whiteSpace: "pre-line" }}
                >
                  {fund.fullDescription || fund.description || "Chưa có mô tả chi tiết cho quỹ này."}
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
                  ❤️ Danh sách người ủng hộ ({totalDonors})
                </Title>
                <Divider style={{ margin: "12px 0" }} />

                {loadingDonors ? (
                    <div style={{ textAlign: "center", padding: 20 }}><Spin /></div>
                ) : (
                    <>
                        <Table
                        dataSource={donors}
                        columns={columns}
                        pagination={false}
                        bordered={false}
                        style={{ borderRadius: "12px" }}
                        rowKey="_id"
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
                            total={totalDonors}
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                        />
                        </div>
                    </>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default FundDescription;
