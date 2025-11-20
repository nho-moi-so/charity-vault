import React, { useState, useEffect } from "react";
import { Table, Card, Pagination, Tooltip } from "antd";

const Lichsugiaodich = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [
      { key: "1", code: "TX001", date: "2025-11-04 14:30", sender: "NGUYEN HUYNH PHUONG DONG", content: "UNG HO CAO BANG KHAC PHUC THIEN TAI", amount: 500000 },
      { key: "2", code: "TX002", date: "2025-10-28 09:15", sender: "TRAN THI B", content: "UNG HO QUY XAY TRUONG", amount: 30000000 },
      
    ];
    setTransactions(storedTransactions);
  }, []);

  const handleChange = (page) => setCurrentPage(page);

  const columns = [
    { 
      title: "Mã giao dịch", 
      dataIndex: "code", 
      key: "code", 
      align: "center", 
      width: 120, 
      render: (text) => <span style={{ fontSize: 12 }}>{text}</span>
    },
    { 
      title: "Thời gian", 
      dataIndex: "date", 
      key: "date", 
      align: "center", 
      width: 120,
      render: (text) => <span style={{ fontSize: 12 }}>{text}</span>
    },
    { 
      title: "Người chuyển", 
      dataIndex: "sender", 
      key: "sender", 
      align: "center", 
      width: 150,
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ fontSize: 12 }}>{text}</span>
        </Tooltip>
      )
    },
    { 
      title: "Nội dung", 
      dataIndex: "content", 
      key: "content", 
      align: "center", 
      width: 250,
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ fontSize: 12 }}>{text}</span>
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
          +{amount.toLocaleString()} VNĐ
        </span>
      )
    },
  ];

  const paginatedData = transactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card
      title={<div style={{ textAlign: "center", fontWeight: "bold" }}>Lịch sử giao dịch của tôi</div>}
      style={{ marginTop: 20 }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          rowKey="key"
          bordered
          style={{ tableLayout: "fixed", fontSize: 12 }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={transactions.length}
            onChange={handleChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </Card>
  );
};

export default Lichsugiaodich;
