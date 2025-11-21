import React, { useState, useEffect } from "react";
import { Table, Card, Pagination, Tooltip, Spin, message } from "antd";
import { donationAPI } from "../services/api";
import { getStoredUser } from "../services/authService";

const Lichsugiaodich = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = getStoredUser();
      if (!user?.address) return;

      try {
        setLoading(true);
        const response = await donationAPI.getUserHistory(user.address, {
          page: currentPage,
          limit: pageSize
        });

        if (response.data?.success) {
          setTransactions(response.data.donations);
          setTotal(response.data.pagination.total);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        message.error("Không thể tải lịch sử giao dịch.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage]);

  const handleChange = (page) => setCurrentPage(page);

  const columns = [
    { 
      title: "Mã giao dịch", 
      dataIndex: "transactionHash", 
      key: "transactionHash", 
      align: "center", 
      width: 150, 
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ fontSize: 12 }}>
            {text ? `${text.substring(0, 6)}...${text.substring(text.length - 4)}` : "N/A"}
          </span>
        </Tooltip>
      )
    },
    { 
      title: "Thời gian", 
      dataIndex: "timestamp", 
      key: "timestamp", 
      align: "center", 
      width: 150,
      render: (text) => <span style={{ fontSize: 12 }}>{new Date(text).toLocaleString()}</span>
    },
    { 
      title: "Quỹ", 
      dataIndex: "fundTitle", 
      key: "fundTitle", 
      align: "center", 
      width: 200,
      render: (text, record) => (
        <Tooltip title={`Fund ID: ${record.fundId}`}>
          <span style={{ fontSize: 12 }}>{text || `Fund #${record.fundId}`}</span>
        </Tooltip>
      )
    },
    { 
      title: "Số tiền", 
      dataIndex: "amount", 
      key: "amount", 
      align: "center",
      width: 160,
      render: (amount) => (
        <span style={{ color: "#52c41a", fontWeight: "bold", fontSize: 12 }}>
          +{parseFloat(amount).toLocaleString()} ETH
        </span>
      )
    },
  ];

  return (
    <Card
      title={<div style={{ textAlign: "center", fontWeight: "bold" }}>Lịch sử giao dịch của tôi</div>}
      style={{ marginTop: 20 }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin />
          </div>
        ) : (
          <>
            <Table
              dataSource={transactions}
              columns={columns}
              pagination={false}
              rowKey="_id"
              bordered
              style={{ tableLayout: "fixed", fontSize: 12 }}
              locale={{ emptyText: "Chưa có giao dịch nào" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handleChange}
                showSizeChanger={false}
                hideOnSinglePage
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default Lichsugiaodich;
