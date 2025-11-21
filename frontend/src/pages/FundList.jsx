import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Progress,
  Pagination,
  Dropdown,
  Menu,
  Button,
  Input,
  Spin,
  message,
} from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import { fundAPI } from "../services/api";

const { Search } = Input;

const FundList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState(
    categoryFromQuery || "all"
  );
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [funds, setFunds] = useState([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    setFilterCategory(categoryFromQuery || "all");
    setCurrentPage(1);
  }, [categoryFromQuery]);

  // Fetch funds from API
  useEffect(() => {
    fetchFunds();
  }, [currentPage, filterCategory, searchText]);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
      };

      if (searchText) {
        // Backend có thể cần thêm search endpoint
        // Tạm thời filter ở frontend
      }

      const response = await fundAPI.getAll(params);

      console.log("Data: ", response.data);

      if (response.data.success) {
        // Map data từ backend format sang frontend format
        // Map data từ backend format sang frontend format
        const mappedFunds = response.data.funds.map((fund) => {
          // Tính số ngày còn lại
          const endDate = fund.endDate ? new Date(fund.endDate) : new Date();
          const today = new Date();
          const timeDiff = endDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

          return {
            id: fund.fundId,
            title: fund.title,
            status: daysLeft > 0 ? "ongoing" : "finished",
            category: fund.category && fund.category.length > 0 ? fund.category[0] : "Khác",
            image: fund.images?.main || "https://cdn.pixabay.com/photo/2017/08/06/23/00/charity-2596422_1280.jpg",
            raised: parseFloat(fund.totalReceived || 0),
            goal: fund.goal || 100000000, // Fallback nếu không có goal
            donors: 0, // Tạm thời chưa có số lượng donors trong API list
            daysLeft: daysLeft > 0 ? daysLeft : 0,
            owner: fund.owner,
            balance: fund.balance,
          };
        });

        setFunds(mappedFunds);
        setTotalFunds(response.data.pagination?.total || mappedFunds.length);
      }
    } catch (error) {
      console.error("Error fetching funds:", error);
      message.error("Không thể tải danh sách quỹ. Vui lòng thử lại sau.");
      // Fallback to empty array
      setFunds([]);
      setTotalFunds(0);
    } finally {
      setLoading(false);
    }
  };

  const filteredFunds = funds.filter(
    (fund) =>
      (filterStatus === "all" || fund.status === filterStatus) &&
      (filterCategory === "all" || fund.category === filterCategory) &&
      fund.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFunds = filteredFunds.slice(startIndex, startIndex + pageSize);

  const statusMenu = (
    <Menu>
      <Menu.Item
        key="all"
        onClick={() => {
          setFilterStatus("all");
          setCurrentPage(1);
        }}
      >
        Tất cả trạng thái
      </Menu.Item>
      <Menu.Item
        key="ongoing"
        onClick={() => {
          setFilterStatus("ongoing");
          setCurrentPage(1);
        }}
      >
        Đang thực hiện
      </Menu.Item>
      <Menu.Item
        key="finished"
        onClick={() => {
          setFilterStatus("finished");
          setCurrentPage(1);
        }}
      >
        Đã kết thúc
      </Menu.Item>
    </Menu>
  );

  const categoryMenu = (
    <Menu>
      <Menu.Item
        key="all"
        onClick={() => {
          setFilterCategory("all");
          setCurrentPage(1);
        }}
      >
        Tất cả danh mục
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px 50px", maxWidth: 1500, margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: 50,
            marginTop: 50,
            color: "#52c41a",
          }}
        >
          Danh sách các quỹ gây quỹ
        </h1>
        {/* tim kiem */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Dropdown overlay={statusMenu} placement="bottomLeft">
              <Button style={{ borderColor: "#52c41a", color: "#52c41a" }}>
                {filterStatus === "all"
                  ? "Tất cả trạng thái"
                  : filterStatus === "ongoing"
                  ? "Đang thực hiện"
                  : "Đã kết thúc"}{" "}
                <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown overlay={categoryMenu} placement="bottomLeft">
              <Button style={{ borderColor: "#52c41a", color: "#52c41a" }}>
                {filterCategory === "all" ? "Tất cả danh mục" : filterCategory}{" "}
                <DownOutlined />
              </Button>
            </Dropdown>
          </div>

          <Search
            placeholder="Tìm theo tên quỹ"
            allowClear
            enterButton
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        {/* danh sach quy */}

        {loading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row gutter={[20, 20]}>
              {paginatedFunds.length > 0 ? (
                paginatedFunds.map((fund) => (
                  <Col key={fund.id} xs={24} sm={12} md={8}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/funds/${fund.id}`)}
                      style={{
                        borderColor: "#52c41a",
                        height: 380,
                        borderRadius: 10,
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                      }}
                      bodyStyle={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                      cover={
                        <div
                          style={{
                            position: "relative",
                            borderRadius: 10,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            alt={fund.title}
                            src={fund.image}
                            style={{
                              width: "100%",
                              height: 270,
                              objectFit: "cover",
                              borderRadius: 10,
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: 10,
                              left: 10,
                              right: 10,
                              backgroundColor: "rgba(255,255,255,0.8)",
                              padding: "4px 8px",
                              borderRadius: 4,
                            }}
                          >
                            <Progress
                              percent={Math.min(
                                (fund.raised / fund.goal) * 100,
                                100
                              )}
                              size="small"
                              strokeColor="#52c41a"
                              showInfo={false}
                            />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 12,
                                fontWeight: "bold",
                                color: "#52c41a",
                                marginTop: 2,
                              }}
                            >
                              <span>{fund.raised.toLocaleString()}₫</span>
                              <span>{fund.goal.toLocaleString()}₫</span>
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <h3
                        style={{
                          color: "#52c41a",
                          marginBottom: 10,
                          fontWeight: "bold",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {fund.title}
                      </h3>
                      <Row
                        style={{
                          marginTop: "auto",
                          color: "#888",
                          fontWeight: "normal",
                        }}
                      >
                        <Col span={12}>
                          {fund.donors.toLocaleString()} lượt ủng hộ
                        </Col>
                        <Col span={12} style={{ textAlign: "right" }}>
                          {fund.daysLeft} ngày còn lại
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col
                  span={24}
                  style={{ textAlign: "center", padding: 50, color: "#888" }}
                >
                  Không có quỹ nào phù hợp
                </Col>
              )}
            </Row>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 30,
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredFunds.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                style={{ borderRadius: 6, padding: "2px 8px" }}
              />
            </div>
          </>
        )}
      </div>
      <FooterSection />
    </>
  );
};

export default FundList;
