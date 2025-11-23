import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Card,
  Row,
  Col,
  DatePicker,
  Input,
  Space,
  Spin,
  message,
} from "antd";
import {
  BankOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import FooterSection from "../components/FooterSection";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { donationAPI, fundAPI } from "../services/api";
import { ethers } from "ethers";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;

const SaoKeQuy = () => {
  const { fundId } = useParams(); // Lấy fundId từ URL
  const [dates, setDates] = useState([dayjs().subtract(1, "month"), dayjs()]);
  const [searchText, setSearchText] = useState("");
  const [donations, setDonations] = useState([]);
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fundId) {
      fetchData();
    } else {
      // Nếu không có fundId, hiển thị tất cả donations hoặc thông báo lỗi
      setLoading(false);
      message.warning("Vui lòng chọn quỹ để xem sao kê");
    }
  }, [fundId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch fund info
      const fundResponse = await fundAPI.getById(fundId);
      if (fundResponse.data.success) {
        setFund(fundResponse.data.fund);
      }

      // Fetch donations
      const donationsResponse = await donationAPI.getFundHistory(fundId);
      if (donationsResponse.data.success) {
        // Transform blockchain data to table format
        const transformedDonations = donationsResponse.data.donations.map(
          (donation, index) => ({
            key: index,
            maGD: donation.transactionHash.slice(0, 12) + "...",
            fullTxHash: donation.transactionHash,
            time: dayjs(donation.timestamp).format("DD/MM/YY - HH:mm:ss"),
            sender: donation.donor,
            content: `Ủng hộ quỹ ${fund?.title || ""}`,
            amount: parseFloat(ethers.formatEther(donation.amount)) * 80000000, // Convert ETH to VND (giả định tỷ giá)
            type: "Thu",
          })
        );
        setDonations(transformedDonations);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu sao kê");
    } finally {
      setLoading(false);
    }
  };

  const tongThu = donations
    .filter((t) => t.type === "Thu")
    .reduce((sum, t) => sum + t.amount, 0);
  const tongChi = donations
    .filter((t) => t.type === "Chi")
    .reduce((sum, t) => sum + t.amount, 0);
  const soDu = tongThu - tongChi;

  const formatMoney = (num) => num.toLocaleString("vi-VN") + " VND";

  const filteredData = donations.filter(
    (item) =>
      item.maGD.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sender.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "maGD",
      key: "maGD",
      render: (text, record) => (
        <a
          href={`https://sepolia.etherscan.io/tx/${record.fullTxHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      ),
    },
    { title: "Thời gian", dataIndex: "time", key: "time" },
    {
      title: "Người chuyển",
      dataIndex: "sender",
      key: "sender",
      render: (text) => `${text.slice(0, 6)}...${text.slice(-4)}`,
    },
    { title: "Nội dung", dataIndex: "content", key: "content" },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (value, record) => (
        <span
          style={{
            color: record.type === "Thu" ? "#52c41a" : "#ff4d4f",
            fontWeight: "bold",
          }}
        >
          {record.type === "Thu" ? "+" : "-"}
          {formatMoney(value)}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <Spin size="large" />
        </div>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1500, margin: "0 auto", padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          {fund?.images?.logo ? (
            <img
              src={fund.images.logo}
              alt="Logo Quỹ"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 10,
              }}
            />
          ) : (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#52c41a",
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              {fund?.title?.charAt(0) || "Q"}
            </div>
          )}
          <Title level={3} style={{ color: "#52c41a" }}>
            Sao Kê - {fund?.title || "Quỹ Thiện Nguyện"}
          </Title>
          <div>Quỹ ID: {fundId}</div>
          <div>
            Người tạo:{" "}
            {fund?.creatorInfo?.name ||
              fund?.creatorInfo?.organization ||
              "Chưa cập nhật"}
          </div>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={8}>
            <Card hoverable style={{ textAlign: "center" }}>
              <BankOutlined
                style={{ fontSize: 28, color: "#52c41a", marginRight: 8 }}
              />
              <div
                style={{ fontSize: 22, fontWeight: "bold", color: "#52c41a" }}
              >
                {formatMoney(soDu)}
              </div>
              <div>Số dư tài khoản</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable style={{ textAlign: "center" }}>
              <ArrowDownOutlined
                style={{ fontSize: 28, color: "#1890ff", marginRight: 8 }}
              />
              <div
                style={{ fontSize: 22, fontWeight: "bold", color: "#1890ff" }}
              >
                {formatMoney(tongThu)}
              </div>
              <div>Tổng thu</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable style={{ textAlign: "center" }}>
              <ArrowUpOutlined
                style={{ fontSize: 28, color: "#ff4d4f", marginRight: 8 }}
              />
              <div
                style={{ fontSize: 22, fontWeight: "bold", color: "#ff4d4f" }}
              >
                {formatMoney(tongChi)}
              </div>
              <div>Tổng chi</div>
            </Card>
          </Col>
        </Row>

        <div
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <RangePicker
            value={dates}
            onChange={(dates) => setDates(dates)}
            format="DD/MM/YYYY"
          />

          <Search
            placeholder="Tìm theo tên hoặc mã giao dịch..."
            allowClear
            enterButton={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
          />
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 20 }}
          bordered
          locale={{ emptyText: "Chưa có giao dịch nào" }}
        />

        <FooterSection />
      </div>
    </>
  );
};

export default SaoKeQuy;
