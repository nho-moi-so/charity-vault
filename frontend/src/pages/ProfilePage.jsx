import React, { useEffect, useState } from "react";
import { Row, Col, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CoverSection from "../Profiles/CoverSection";
import Infor from "../Profiles/Infor";
import Thongke from "../Profiles/Thongke";
import Lichsugiaodich from "../Profiles/Lichsugiaodich";
import FooterSection from "../components/FooterSection";
import {
  getStoredUser,
  ensureWalletLogin,
  fetchUserProfile,
  updateUserProfile,
} from "../services/authService";
import { donationAPI } from "../services/api";
import { weiToVND } from "../utils/currencyHelper";
import { getCurrentEthPrice } from "../services/Web3Service";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalDonated: 0, totalFunds: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        let stored = getStoredUser();
        let address = stored?.address;

        if (!address) {
          const ensured = await ensureWalletLogin();
          address = ensured?.address;
        }

        if (!address) {
          message.warning("Vui lòng kết nối ví để xem hồ sơ.");
          navigate("/login");
          return;
        }

        const profile = await fetchUserProfile(address);
        setUser(profile);

        // Fetch donation stats
        try {
          const ethPrice = await getCurrentEthPrice();
          // Fetch with large limit to calculate stats
          const donationRes = await donationAPI.getUserHistory(address, {
            limit: 1000,
          });

          if (donationRes.data.success) {
            const donations = donationRes.data.donations;

            // Calculate total donated in VND
            const totalDonatedVND = donations.reduce((sum, d) => {
              return sum + weiToVND(d.amount, ethPrice);
            }, 0);

            // Calculate unique funds
            const uniqueFunds = new Set(donations.map((d) => d.fundId)).size;

            setStats({
              totalDonated: totalDonatedVND,
              totalFunds: uniqueFunds,
            });
          }
        } catch (err) {
          console.error("Error calculating stats:", err);
        }
      } catch (error) {
        console.error("Load profile error:", error);
        message.error(error.message || "Không thể tải thông tin hồ sơ.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleProfileUpdate = async (payload) => {
    if (!user?.address) return null;
    try {
      const updated = await updateUserProfile({
        address: user.address,
        ...payload,
      });
      setUser(updated);
      return updated;
    } catch (error) {
      console.error("Update profile error:", error);
      message.error(error.message || "Không thể cập nhật hồ sơ.");
      throw error;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "120px 0" }}>
          <Spin size="large" />
        </div>
        <FooterSection />
      </>
    );
  }

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <CoverSection user={user} onProfileUpdate={handleProfileUpdate} />
      <div
        style={{ maxWidth: 1500, margin: "0 auto", padding: "10px 20px 40px" }}
      >
        <Row gutter={20}>
          <Col span={8}>
            <Infor user={user} onProfileUpdate={handleProfileUpdate} />
          </Col>
          <Col span={16}>
            <Thongke user={user} stats={stats} />
            <Lichsugiaodich />
          </Col>
        </Row>
      </div>

      <FooterSection />
    </div>
  );
};

export default ProfilePage;
