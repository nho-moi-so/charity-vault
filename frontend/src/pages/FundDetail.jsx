import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Breadcrumb, Divider, Spin, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import FundGallery from "../Details/FundGallery";
import FundInfoBox from "../Details/FundInfoBox";
import FundDescription from "../Details/FundDescription";
import FundCreatorInfo from "../Details/FundCreatorInfo"; 
import FundOtherCampaigns from "../Details/FundOtherCampaigns";
import { fundAPI } from "../services/api";
import { getFundInfo } from "../services/Web3Service";

const { Title } = Typography;

const FundDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [loading, setLoading] = useState(true);

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
          const blockchainInfo = await getFundInfo(id);
          setBlockchainData(blockchainInfo);
        } catch (error) {
          console.error("Error fetching blockchain data:", error);
          // Không block UI nếu blockchain fail
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

      <FooterSection />
    </>
  );
};

export default FundDetail;
