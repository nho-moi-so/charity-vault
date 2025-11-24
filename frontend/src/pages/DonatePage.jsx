import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Progress,
  Form,
  Input,
  InputNumber,
  Button,
  Avatar,
  Checkbox,
  Spin,
  message,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import WalletConnect from "../components/WalletConnect";
import {
  handleDonation,
  getCurrentEthPrice,
  getFundInfo,
} from "../services/Web3Service";
import { fundAPI } from "../services/api";
import { weiToVND, isLikelyWei } from "../utils/currencyHelper";

const { Title, Text } = Typography;

const DonatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [raisedAmount, setRaisedAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(0);

  const [anonymous, setAnonymous] = useState(false);
  const [thankMessage, setThankMessage] = useState("");
  const [walletAccount, setWalletAccount] = useState(null);
  const [walletError, setWalletError] = useState(null);
  const [ethPrice, setEthPrice] = useState(0);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Get ETH Price
        const price = await getCurrentEthPrice();
        setEthPrice(price);

        // 2. Get Fund Details from Backend
        const response = await fundAPI.getById(id);
        if (response.data.success) {
          const fundData = response.data.fund;
          setFund(fundData);
          setGoalAmount(fundData.goal || 100000000);

          // 3. Get Blockchain Data (for latest raised amount)
          try {
            const blockchainInfo = await getFundInfo(fundData.fundId);
            // blockchainInfo.totalReceived is in ETH (formatted string)
            const totalReceivedETH = parseFloat(blockchainInfo.totalReceived);
            const totalReceivedVND = totalReceivedETH * price;
            setRaisedAmount(totalReceivedVND);
          } catch (bcError) {
            console.error("Blockchain fetch error:", bcError);
            // Fallback to backend data, but convert if it's Wei
            const backendAmount = fundData.totalReceived || 0;
            if (isLikelyWei(backendAmount)) {
              setRaisedAmount(weiToVND(backendAmount, price));
            } else {
              setRaisedAmount(backendAmount);
            }
          }
        } else {
          message.error("Không tìm thấy quỹ!");
          navigate("/funds");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Lỗi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const onFinish = async (values) => {
    if (!walletAccount) {
      setThankMessage("🚨 Vui lòng kết nối ví MetaMask trước khi ủng hộ!");
      return;
    }

    if (ethPrice === 0) {
      setThankMessage("🚨 Không thể lấy tỷ giá ETH. Vui lòng thử lại!");
      return;
    }

    try {
      setProcessing(true);
      const amountVND = values.amount;
      const amountETH = amountVND / ethPrice;
      // Ensure we send a string with 18 decimals max to avoid overflow/underflow issues in parsing
      const amountETHString = amountETH.toFixed(18);

      console.log("Số tiền VND:", amountVND);
      console.log("Tỷ giá ETH:", ethPrice);
      console.log("Số ETH sẽ gửi:", amountETHString);
      console.log("Fund ID (Blockchain):", fund.fundId);

      setThankMessage("⏳ Đang xử lý giao dịch trên blockchain...");

      const receipt = await handleDonation(fund.fundId, amountETHString);

      // Sync logic here if needed (backend usually listens to events)

      setThankMessage(
        `✅ Quyên góp thành công! Transaction hash: ${receipt.hash.slice(
          0,
          10
        )}...`
      );
      form.resetFields();

      // Update local state to reflect donation immediately (optional)
      setRaisedAmount((prev) => prev + amountVND);
    } catch (error) {
      console.error("Lỗi giao dịch:", error);

      let errorMsg = "Không thể thực hiện quyên góp. ";
      if (error.message?.includes("user rejected")) {
        errorMsg += "Bạn đã hủy giao dịch.";
      } else if (error.message?.includes("insufficient funds")) {
        errorMsg += "Số dư ví không đủ.";
      } else if (error.message?.includes("MetaMask")) {
        errorMsg += "Vui lòng kiểm tra kết nối MetaMask.";
      } else {
        errorMsg += error.message || "Vui lòng thử lại sau.";
      }

      setThankMessage(`🚨 ${errorMsg}`);
    } finally {
      setProcessing(false);
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

  if (!fund) return null;

  // Calculate days left
  const endDate = fund.endDate ? new Date(fund.endDate) : new Date();
  const today = new Date();
  const timeDiff = endDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  const progressPercent = Math.min(
    Math.round((raisedAmount / goalAmount) * 100),
    100
  );

  // Image handling
  const coverImage =
    fund.images?.main || "https://via.placeholder.com/800x400?text=No+Image";
  const logo = fund.images?.logo || "https://via.placeholder.com/100?text=Logo";
  const organization =
    fund.creator?.organization || fund.creator?.name || "Tổ chức từ thiện";

  const isGoalReached = raisedAmount >= goalAmount;

  return (
    <>
      <Navbar />

      {(thankMessage || walletError || daysLeft < 0 || isGoalReached) && (
        <div
          style={{
            maxWidth: "1400px",
            margin: "16px auto",
            padding: "12px",
            backgroundColor:
              walletError || thankMessage.includes("🚨") || daysLeft < 0
                ? "#f8d7da"
                : isGoalReached
                ? "#d1ecf1"
                : "#d4edda",
            color:
              walletError || thankMessage.includes("🚨") || daysLeft < 0
                ? "#721c24"
                : isGoalReached
                ? "#0c5460"
                : "#155724",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          {daysLeft < 0
            ? "🚨 Chiến dịch này đã kết thúc. Bạn không thể ủng hộ được nữa."
            : isGoalReached
            ? "🎉 Chiến dịch đã đạt đủ chỉ tiêu! Cảm ơn tấm lòng của mọi người."
            : walletError
            ? `🚨 Lỗi kết nối: ${walletError}`
            : thankMessage}
        </div>
      )}

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        {/* ... existing code ... */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            {/* ... existing code ... */}
          </Col>

          <Col xs={24} md={12}>
            <Card title="Thông tin ủng hộ" style={{ padding: "10px" }}>
              <Form layout="vertical" form={form} onFinish={onFinish}>
                {/* ... existing form items ... */}

                <Form.Item>
                  <Button
                    htmlType="submit"
                    block
                    loading={processing}
                    style={{
                      fontSize: "18px",
                      padding: "12px 0",
                      borderRadius: "8px",
                      background:
                        daysLeft < 0 || isGoalReached
                          ? "#d9d9d9"
                          : "linear-gradient(90deg, #28a745, #7ed957)",
                      color:
                        daysLeft < 0 || isGoalReached
                          ? "rgba(0, 0, 0, 0.25)"
                          : "#fff",
                      border: "none",
                      cursor:
                        daysLeft < 0 || isGoalReached
                          ? "not-allowed"
                          : "pointer",
                    }}
                    onMouseOver={(e) => {
                      if (daysLeft >= 0 && !isGoalReached) {
                        e.currentTarget.style.filter = "brightness(1.1)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (daysLeft >= 0 && !isGoalReached) {
                        e.currentTarget.style.filter = "brightness(1)";
                      }
                    }}
                    disabled={daysLeft < 0 || processing || isGoalReached}
                  >
                    {daysLeft < 0
                      ? "Chiến dịch đã kết thúc"
                      : isGoalReached
                      ? "Đã đạt đủ chỉ tiêu"
                      : processing
                      ? "Đang xử lý..."
                      : "Ủng hộ ngay"}
                  </Button>

                  {isGoalReached && (
                    <Button
                      block
                      style={{
                        marginTop: "10px",
                        fontSize: "16px",
                        padding: "10px 0",
                        borderRadius: "8px",
                        borderColor: "#1e9c45",
                        color: "#1e9c45",
                      }}
                      onClick={() => navigate(`/funds/${id}`)}
                    >
                      Quay về chi tiết quỹ
                    </Button>
                  )}

                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "13px",
                      color: "#155724",
                      textAlign: "center",
                    }}
                  >
                    Ủng hộ của bạn sẽ được chuyển thẳng đến quỹ, hoàn toàn minh
                    bạch
                  </div>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
      <FooterSection />
    </>
  );
};

export default DonatePage;
