import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Breadcrumb,
  Divider,
  Spin,
  message,
  Button,
  Modal,
  InputNumber,
} from "antd";
import { HomeOutlined, WalletOutlined } from "@ant-design/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import FundGallery from "../Details/FundGallery";
import FundInfoBox from "../Details/FundInfoBox";
import FundDescription from "../Details/FundDescription";
import FundCreatorInfo from "../Details/FundCreatorInfo";
import FundOtherCampaigns from "../Details/FundOtherCampaigns";
import { fundAPI } from "../services/api";
import {
  getFundInfo,
  getCurrentAddress,
  withdrawFunds,
} from "../services/Web3Service";

const { Title } = Typography;

const FundDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Withdraw State
  const [isOwner, setIsOwner] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFundDetail();
    }
  }, [id]);

  const fetchFundDetail = async () => {
    try {
      setLoading(true);

      // Lấy từ backend API
      const response = await fundAPI.getById(id);

      if (response.data.success) {
        setFund(response.data.fund);

        // Lấy thêm data từ blockchain để có thông tin mới nhất
        try {
          // Sử dụng fundId từ database để query blockchain
          const blockchainInfo = await getFundInfo(response.data.fund.fundId);
          setBlockchainData(blockchainInfo);

          // Kiểm tra quyền sở hữu
          const currentAddr = await getCurrentAddress();
          if (
            currentAddr &&
            blockchainInfo.owner &&
            currentAddr.toLowerCase() === blockchainInfo.owner.toLowerCase()
          ) {
            setIsOwner(true);
          }
        } catch (error) {
          console.warn(
            "Blockchain data not available (expected for seed data):",
            error.message
          );
          // Không throw error để page vẫn render được với data từ DB
        }
      } else {
        message.error("Không tìm thấy quỹ");
        navigate("/funds");
      }
    } catch (error) {
      console.error("Error fetching fund detail:", error);
      message.error("Không thể tải thông tin quỹ. Vui lòng thử lại sau.");
      navigate("/funds");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      message.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      setWithdrawLoading(true);
      await withdrawFunds(fund.fundId, withdrawAmount.toString());
      message.success("Rút tiền thành công!");
      setWithdrawModalVisible(false);
      setWithdrawAmount("");
      // Refresh data
      fetchFundDetail();
    } catch (error) {
      console.error("Withdraw error:", error);
      message.error("Rút tiền thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setWithdrawLoading(false);
    }
  };

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

  if (!fund) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div style={{ background: "#fff", padding: "40px 0" }}>
        <div
          style={{
            maxWidth: "1500px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Breadcrumb
              items={[
                {
                  title: (
                    <Link to="/" style={{ color: "#1677ff" }}>
                      <HomeOutlined /> Trang chủ
                    </Link>
                  ),
                },
                {
                  title: (
                    <Link to="/funds" style={{ color: "#1677ff" }}>
                      Danh sách quỹ
                    </Link>
                  ),
                },
                {
                  title: fund.title || "Chi tiết quỹ",
                },
              ]}
            />
            {isOwner && (
              <Button
                type="primary"
                danger
                icon={<WalletOutlined />}
                onClick={() => setWithdrawModalVisible(true)}
              >
                Rút tiền về ví
              </Button>
            )}
          </div>

          <Title
            level={3}
            style={{
              marginTop: 24,
              marginBottom: 20,
              color: "#222",
              fontWeight: 600,
            }}
          >
            {fund.title || "Chi tiết quỹ"}
          </Title>

          <Divider style={{ margin: "12px 0 30px 0" }} />

          <Row gutter={[40, 40]}>
            <Col xs={24} md={16}>
              <FundGallery fund={fund} />
              <FundDescription fund={fund} blockchainData={blockchainData} />
            </Col>

            <Col xs={24} md={8}>
              <FundInfoBox fund={fund} blockchainData={blockchainData} />
              <FundCreatorInfo fund={fund} />
            </Col>
          </Row>
          <FundOtherCampaigns currentFundId={id} />
        </div>
      </div>

      <Modal
        title="Rút tiền từ quỹ"
        open={withdrawModalVisible}
        onOk={handleWithdraw}
        onCancel={() => setWithdrawModalVisible(false)}
        confirmLoading={withdrawLoading}
        okText="Rút tiền"
        cancelText="Hủy"
      >
        <p>Nhập số lượng ETH muốn rút về ví của bạn:</p>
        {blockchainData && (
          <p style={{ marginBottom: 10, fontWeight: 500 }}>
            Số dư hiện tại:{" "}
            <span style={{ color: "#117529" }}>
              {parseFloat(blockchainData.totalReceived) -
                parseFloat(blockchainData.totalWithdrawn)}{" "}
              ETH
            </span>
          </p>
        )}
        <InputNumber
          style={{ width: "100%" }}
          min="0"
          step="0.01"
          value={withdrawAmount}
          onChange={(value) => setWithdrawAmount(value)}
          addonAfter="ETH"
        />
        <p style={{ marginTop: 10, color: "#888", fontSize: 12 }}>
          * Lưu ý: Bạn chỉ có thể rút số tiền nhỏ hơn hoặc bằng số dư hiện tại
          của quỹ.
        </p>
      </Modal>

      <FooterSection />
    </>
  );
};

export default FundDetail;
