import React, { useState } from "react";
import { Table, Typography, Card, Row, Col, DatePicker, Input, Space } from "antd";
import { BankOutlined, ArrowDownOutlined, ArrowUpOutlined, SearchOutlined } from "@ant-design/icons";
import FooterSection from "../components/FooterSection";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;

const transactionsData = [
  { key: 1, maGD: 'FT253075499267', time: '03/11/25 - 16:21:00', sender: 'NGUYEN VAN A', content: 'UNG HO CAO BANG KHAC PHUC THIEN TAI', amount: 200000, type: 'Thu' },
  { key: 2, maGD: 'FT253076243261', time: '03/11/25 - 15:25:00', sender: 'TRAN THI B', content: 'UNG HO CAO BANG KHAC PHUC THIEN TAI', amount: 200000, type: 'Thu' },
  { key: 3, maGD: 'FT253072580202', time: '03/11/25 - 14:44:00', sender: 'DO MINH C', content: 'UNG HO CAO BANG KHAC PHUC THIEN TAI', amount: 200000, type: 'Thu' },
  { key: 4, maGD: 'FT253072580203', time: '04/11/25 - 10:00:00', sender: 'LE VAN D', content: 'UNG HO MIEN TRUNG', amount: 150000, type: 'Thu' },
  { key: 5, maGD: 'FT253072580204', time: '04/11/25 - 11:10:00', sender: 'NGUYEN THI E', content: 'UNG HO MIEN TRUNG', amount: 300000, type: 'Thu' },
  { key: 6, maGD: 'FT253072580205', time: '04/11/25 - 12:30:00', sender: 'TRAN VAN F', content: 'UNG HO MIEN TRUNG', amount: 250000, type: 'Thu' },
  { key: 7, maGD: 'FT253072580206', time: '04/11/25 - 13:45:00', sender: 'PHAM THI G', content: 'UNG HO MIEN TRUNG', amount: 200000, type: 'Thu' },
  { key: 8, maGD: 'FT253072580209', time: '04/11/25 - 16:20:00', sender: 'TRAN THI J', content: 'UNG HO MIEN TRUNG', amount: 220000, type: 'Thu' },
  { key: 9, maGD: 'FT253072580210', time: '05/11/25 - 09:10:00', sender: 'DO MINH K', content: 'UNG HO MIEN TRUNG', amount: 180000, type: 'Thu' },
  { key: 10, maGD: 'FT253072580212', time: '05/11/25 - 11:40:00', sender: 'NGUYEN THI M', content: 'UNG HO MIEN TRUNG', amount: 160000, type: 'Thu' },
  { key: 11, maGD: 'FT253072580213', time: '05/11/25 - 12:50:00', sender: 'TRAN VAN N', content: 'UNG HO MIEN TRUNG', amount: 210000, type: 'Thu' },
  { key: 12, maGD: 'FT253072580215', time: '05/11/25 - 14:30:00', sender: 'LE VAN P', content: 'UNG HO MIEN TRUNG', amount: 190000, type: 'Thu' },
  { key: 13, maGD: 'FT253072580216', time: '05/11/25 - 15:45:00', sender: 'NGUYEN VAN Q', content: 'UNG HO MIEN TRUNG', amount: 200000, type: 'Thu' },
  { key: 14, maGD: 'FT253072580218', time: '06/11/25 - 09:15:00', sender: 'DO MINH S', content: 'UNG HO MIEN TRUNG', amount: 170000, type: 'Thu' },
  { key: 15, maGD: 'FT253072580219', time: '06/11/25 - 10:30:00', sender: 'LE VAN T', content: 'UNG HO MIEN TRUNG', amount: 140000, type: 'Thu' },
  { key: 16, maGD: 'FT253072580221', time: '06/11/25 - 12:50:00', sender: 'TRAN VAN V', content: 'UNG HO MIEN TRUNG', amount: 180000, type: 'Thu' },
  { key: 17, maGD: 'FT253072580223', time: '06/11/25 - 14:30:00', sender: 'LE VAN X', content: 'UNG HO MIEN TRUNG', amount: 200000, type: 'Thu' },
  { key: 18, maGD: 'FT253072580224', time: '06/11/25 - 15:45:00', sender: 'NGUYEN VAN Y', content: 'UNG HO MIEN TRUNG', amount: 150000, type: 'Thu' },
  { key: 19, maGD: 'FT253072580226', time: '07/11/25 - 09:15:00', sender: 'DO MINH AA', content: 'UNG HO MIEN TRUNG', amount: 160000, type: 'Thu' },
  { key: 20, maGD: 'FT253072580227', time: '07/11/25 - 10:30:00', sender: 'LE VAN BB', content: 'UNG HO MIEN TRUNG', amount: 170000, type: 'Thu' },
  { key: 21, maGD: 'FT253072580230', time: '07/11/25 - 12:50:00', sender: 'TRAN VAN DD', content: 'UNG HO MIEN TRUNG', amount: 200000, type: 'Thu' },
  { key: 22, maGD: 'FT253072580232', time: '07/11/25 - 14:30:00', sender: 'LE VAN FF', content: 'UNG HO MIEN TRUNG', amount: 180000, type: 'Thu' },
  { key: 23, maGD: 'FT253072580233', time: '07/11/25 - 15:45:00', sender: 'NGUYEN VAN GG', content: 'UNG HO MIEN TRUNG', amount: 190000, type: 'Thu' },
  { key: 24, maGD: 'FT253072580235', time: '08/11/25 - 10:30:00', sender: 'LE VAN JJ', content: 'UNG HO MIEN TRUNG', amount: 170000, type: 'Thu' },
  { key: 25, maGD: 'FT253072580237', time: '08/11/25 - 12:50:00', sender: 'TRAN VAN LL', content: 'UNG HO MIEN TRUNG', amount: 200000, type: 'Thu' },
  { key: 26, maGD: 'FT253072580238', time: '08/11/25 - 13:30:00', sender: 'NGUYEN VAN MM', content: 'UNG HO MIEN TRUNG', amount: 150000, type: 'Thu' },
  { key: 27, maGD: 'FT253072580239', time: '08/11/25 - 14:00:00', sender: 'LE THI NN', content: 'UNG HO MIEN TRUNG', amount: 160000, type: 'Thu' },
  { key: 28, maGD: 'FT253072580240', time: '08/11/25 - 15:15:00', sender: 'TRAN VAN OO', content: 'UNG HO MIEN TRUNG', amount: 180000, type: 'Thu' },
  { key: 29, maGD: 'FT253072580241', time: '08/11/25 - 16:20:00', sender: 'PHAM THI PP', content: 'UNG HO MIEN TRUNG', amount: 200000, type: 'Thu' },
  { key: 30, maGD: 'FT253072580242', time: '09/11/25 - 09:15:00', sender: 'LE VAN QQ', content: 'UNG HO MIEN TRUNG', amount: 170000, type: 'Thu' },
  { key: 31, maGD: 'FT253072580243', time: '09/11/25 - 10:30:00', sender: 'NGUYEN THI RR', content: 'UNG HO MIEN TRUNG', amount: 180000, type: 'Thu' },
  { key: 32, maGD: 'FT253072580244', time: '09/11/25 - 11:40:00', sender: 'TRAN VAN SS', content: 'UNG HO MIEN TRUNG', amount: 190000, type: 'Thu' },
  { key: 33, maGD: 'FT253072580245', time: '09/11/25 - 12:50:00', sender: 'PHAM THI TT', content: 'UNG HO MIEN TRUNG', amount: 200000, type: 'Thu' },
  { key: 34, maGD: 'FT253072580246', time: '09/11/25 - 13:55:00', sender: 'LE VAN UU', content: 'UNG HO MIEN TRUNG', amount: 210000, type: 'Thu' },
  { key: 35, maGD: 'FT253072580247', time: '09/11/25 - 14:30:00', sender: 'NGUYEN VAN VV', content: 'UNG HO MIEN TRUNG', amount: 220000, type: 'Thu' },
  { key: 36, maGD: 'FT253072580248', time: '09/11/25 - 15:45:00', sender: 'LE THI WW', content: 'UNG HO MIEN TRUNG', amount: 230000, type: 'Thu' },
  { key: 37, maGD: 'FT253072580249', time: '09/11/25 - 16:55:00', sender: 'TRAN VAN XX', content: 'UNG HO MIEN TRUNG', amount: 240000, type: 'Thu' },
  { key: 38, maGD: 'FT253072580250', time: '10/11/25 - 09:15:00', sender: 'PHAM THI YY', content: 'UNG HO MIEN TRUNG', amount: 250000, type: 'Thu' },
];


const SaoKeQuy = () => {
  const [dates, setDates] = useState([dayjs('2025-10-03'), dayjs('2025-11-03')]);
  const [searchText, setSearchText] = useState("");

  const tongThu = transactionsData.filter(t => t.type === 'Thu').reduce((sum, t) => sum + t.amount, 0);
  const tongChi = transactionsData.filter(t => t.type === 'Chi').reduce((sum, t) => sum + t.amount, 0);
  const soDu = tongThu - tongChi;

  const formatMoney = (num) => num.toLocaleString("vi-VN") + " VND";

  const filteredData = transactionsData.filter(item =>
    item.maGD.toLowerCase().includes(searchText.toLowerCase()) ||
    item.sender.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: 'Mã giao dịch', dataIndex: 'maGD', key: 'maGD' },
    { title: 'Thời gian', dataIndex: 'time', key: 'time' },
    { title: 'Người chuyển', dataIndex: 'sender', key: 'sender' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content' },
    { 
      title: 'Số tiền', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (value, record) => (
        <span style={{ color: record.type === 'Thu' ? '#52c41a' : '#ff4d4f', fontWeight: "bold" }}>
          {record.type === 'Thu' ? '+' : '-'}{formatMoney(value)}
        </span>
      ) 
    },
  ];

  return (
    <>
      <Navbar />
    <div style={{ maxWidth: 1500, margin: "0 auto", padding: 20 }}>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img src="https://vn-test-11.slatic.net/shop/ef696bbfa65b218629e1ee20923b731e.jpeg" alt="Logo Quỹ" style={{ width: 80, marginBottom: 10 }} />
        <Title level={3} style={{ color: "#52c41a" }}>THỐNG KÊ TÀI KHOẢN THIỆN NGUYỆN MINH BẠCH</Title>
        <div>Số tài khoản: 2065, Tên tài khoản: HOI CHU THAP DO TINH CAO BANG</div>
        <div>Ngân hàng Thương mại Cổ phần Quân đội (MBBank)</div>
      </div>

      <Row gutter={[16,16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ textAlign: "center" }}>
            <BankOutlined style={{ fontSize: 28, color: "#52c41a", marginRight: 8 }} />
            <div style={{ fontSize: 22, fontWeight: "bold", color: "#52c41a" }}>{formatMoney(soDu)}</div>
            <div>Số dư tài khoản</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ textAlign: "center" }}>
            <ArrowDownOutlined style={{ fontSize: 28, color: "#1890ff", marginRight: 8 }} />
            <div style={{ fontSize: 22, fontWeight: "bold", color: "#1890ff" }}>{formatMoney(tongThu)}</div>
            <div>Tổng thu</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ textAlign: "center" }}>
            <ArrowUpOutlined style={{ fontSize: 28, color: "#ff4d4f", marginRight: 8 }} />
            <div style={{ fontSize: 22, fontWeight: "bold", color: "#ff4d4f" }}>{formatMoney(tongChi)}</div>
            <div>Tổng chi</div>
          </Card>
        </Col>
      </Row>

    <div 
    style={{ 
        marginBottom: 20, 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
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
      />

      <FooterSection />
      
    </div>
    </>
  );
};

export default SaoKeQuy;
