// File: pages/TaoQuyMoi.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import {
  Card,
  Typography,
  Button,
  Row,
  Col,
  Steps,
  Form,
  Input,
  InputNumber,
  message,
  Upload,
  Radio,
  DatePicker,
  Checkbox,
  Select,
} from "antd";
import {
  FileTextOutlined,
  FundProjectionScreenOutlined,
  BankOutlined,
  CheckCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createFund } from "../services/Web3Service";
import {
  ensureWalletLogin,
  loginWithWallet,
  getStoredUser,
} from "../services/authService";
import { fundAPI } from "../services/api";

const { Title, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;

const TaoQuyMoi = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    const storedUser = getStoredUser();
    if (storedUser?.address) {
      setWalletAddress(storedUser.address);
      return;
    }
    const user = await ensureWalletLogin();
    if (user?.address) {
      setWalletAddress(user.address);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const user = await loginWithWallet();
      setWalletAddress(user.address);
      message.success("Đã kết nối ví thành công!");
    } catch (error) {
      console.error("Connect wallet error:", error);
      message.error(error?.message || "Không thể kết nối ví. Vui lòng thử lại.");
    }
  };

  const next = () => {
    form
      .validateFields()
      .then(() => setCurrentStep(currentStep + 1))
      .catch(() => {
        message.error("Vui lòng nhập đầy đủ thông tin trước khi tiếp tục.");
      });
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const handleFinish = async (values) => {
    if (!walletAddress) {
      message.error("Vui lòng kết nối ví MetaMask trước khi tạo quỹ!");
      return;
    }

    try {
      setLoading(true);
      
      // Tạo metadata URI (có thể lưu lên IPFS hoặc backend)
      const metadata = {
        title: values.tenQuy,
        description: values.moTaNgan,
        fullDescription: values.gioiThieu,
        category: values.danhMuc || [],
        goal: values.soTienMucTieu,
        startDate: values.ngayBatDau,
        endDate: values.ngayKetThuc,
        bankAccount: {
          accountName: values.chuTaiKhoan,
          accountNumber: values.soTaiKhoan,
          bank: values.nganHang,
          branch: values.chiNhanh,
        },
        creator: {
          name: values.hoTen,
          email: values.email,
          phone: values.dienThoai,
          address: values.diaChi,
          organization: values.tenNhom,
          role: values.vaiTro,
        },
      };

      // Tạm thời dùng JSON string làm metadataURI
      // Trong production nên upload lên IPFS
      const metadataURI = JSON.stringify(metadata);

      // Tạo quỹ trên blockchain
      message.loading({ content: "Đang tạo quỹ trên blockchain...", key: "creating" });
      
      const receipt = await createFund(values.tenQuy, metadataURI);
      
      // Lấy fundId từ event hoặc từ blockchain
      // Event FundCreated sẽ có fundId
      let fundId = null;
      if (receipt.logs && receipt.logs.length > 0) {
        // Parse event để lấy fundId
        // Tạm thời dùng totalFunds - 1
        const { getTotalFunds } = await import("../services/Web3Service");
        const total = await getTotalFunds();
        fundId = total - 1;
      }

      // Sync với backend
      if (fundId !== null) {
        try {
          await fundAPI.create({
            fundId,
            title: values.tenQuy,
            metadataURI,
            owner: walletAddress,
            txHash: receipt.hash,
          });
        } catch (error) {
          console.error("Error syncing with backend:", error);
          // Không block nếu backend sync fail
        }
      }

      message.success({ content: "Tạo quỹ thành công!", key: "creating" });
      navigate("/funds");
    } catch (error) {
      console.error("Error creating fund:", error);
      message.error({ 
        content: error.message || "Không thể tạo quỹ. Vui lòng thử lại.", 
        key: "creating" 
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    // ================= BUOC 1 =================
    {
      title: "Thông tin chung",
      icon: <FileTextOutlined />,
      content: (
        <>
          <Title level={4}>Phần I: Thông tin cá nhân / tổ chức</Title>
          <Paragraph style={{ color: "#555" }}>
            Vui lòng điền đầy đủ thông tin cá nhân hoặc đại diện tổ chức của bạn.
          </Paragraph>

          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: 800, margin: "0 auto", textAlign: "left" }}
          >
            <Form.Item
              label="1. Họ và tên"
              name="hoTen"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input placeholder="Ví dụ: Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              label="2. Ngày/tháng/năm sinh"
              name="ngaySinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="3. Số điện thoại"
              name="dienThoai"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            >
              <Input placeholder="Số điện thoại của bạn..." />
            </Form.Item>

            <Form.Item
              label="4. Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ email" },
                { type: "email", message: "Địa chỉ email không hợp lệ" },
              ]}
            >
              <Input placeholder="Ví dụ: email@example.com" />
          </Form.Item>

            <Form.Item
              label="5. Tài khoản mạng xã hội của bạn (vui lòng gửi đường link)"
              name="social"
              rules={[{ required: true, message: "Vui lòng nhập link tài khoản" }]}
            >
              <Input placeholder="Nhập link tài khoản mạng xã hội..." />
            </Form.Item>

            <Form.Item
              label="6. Địa chỉ thường trú của bạn (phường/xã, quận huyện, thành phố)"
              name="diaChi"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input placeholder="Nhập địa chỉ của bạn..." />
            </Form.Item>

            <Form.Item
              label="7. Tên CLB/Đội/Nhóm/của bạn"
              name="tenNhom"
              rules={[{ required: true, message: "Vui lòng nhập tên nhóm" }]}
            >
              <Input placeholder="Nhập tên nhóm..." />
            </Form.Item>

            <Form.Item
              label="8. Vai trò của bạn trong CLB/Đội/Nhóm"
              name="vaiTro"
              rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
            >
              <Radio.Group>
                <Radio value="nguoiSangLap">Người sáng lập</Radio>
                <Radio value="chiNhiem">Chủ nhiệm</Radio>
                <Radio value="caNhan">Cá nhân</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="9. Logo, hình ảnh nhận diện CLB/Đội/Nhóm thiện nguyện/của bạn (Chấp nhận các file ảnh )"
              name="logo"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: "Vui lòng thêm hình ảnh" }]}
            >
              <Upload beforeUpload={() => false} listType="picture-card">
                <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
              </Upload>
            </Form.Item>

           <Form.Item
              label="10. Link / website mạng xã hội"
              name="linkGioiThieu"
              rules={[{ required: true, message: "Vui lòng nhập link hoặc mô tả hoạt động" }]}
            >
              <Input.TextArea
                placeholder="Nhập link hoặc mô tả hoạt động..."
                rows={3}
              />
          </Form.Item>


            <Form.Item
              label="11. Thành tích, khen thưởng, được ghi nhận trong hoạt động tình nguyện, cộng đồng, xã hội"
              name="thanhTich"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: "Vui lòng tải lên file minh chứng" }]}
            >
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>
                  Tải lên file (PDF, hình ảnh...)
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </>
      ),
    },

    // ================= BUOC 2 =================
    {
      title: "Thông tin quỹ",
      icon: <FundProjectionScreenOutlined />,
      content: (
        <>
          <Title level={4}>Phần II: Thông tin quỹ</Title>
          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: 800, margin: "0 auto", textAlign: "left" }}
          >
            <Form.Item
              label="1. Anh chị/tổ chức cam kết sử dụng TKTT MB cho mục đích nào sau đây?"
              name="mucDich"
              rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 mục đích" }]}
            >
              <Checkbox.Group style={{ display: "flex", flexDirection: "column" }}>
                <Checkbox value="tiepNhan">Vận động, tiếp nhận đóng góp</Checkbox>
                <Checkbox value="phatTrien">
                  Vận động gây quỹ nhóm phát triển cộng đồng
                </Checkbox>
                <Checkbox value="minhBach">
                  Công khai minh bạch đối với tổ chức, người dùng
                </Checkbox>
                <Checkbox value="khac">Mục khác</Checkbox>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              label="2. Cam kết công khai thông tin quỹ"
              name="camKetCongKhai"
              rules={[{ required: true, message: "Vui lòng chọn đồng ý hoặc không" }]}
            >
              <Radio.Group>
                <Radio value="dongy">Đồng ý</Radio>
                <Radio value="khongdongy">Không đồng ý</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="3. Tên quỹ"
              name="tenQuy"
              rules={[{ required: true, message: "Vui lòng nhập tên quỹ" }]}
            >
              <Input placeholder="Ví dụ: Chung tay vì miền Trung" />
            </Form.Item>

            <Form.Item
              label="4. Mô tả ngắn"
              name="moTaNgan"
              rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn" }]}
            >
              <Input placeholder="Nhập mô tả ngắn..." />
            </Form.Item>

            <Form.Item
              label="5. Giới thiệu quỹ"
              name="gioiThieu"
              rules={[{ required: true, message: "Vui lòng nhập giới thiệu quỹ" }]}
            >
              <Input.TextArea rows={3} placeholder="Nhập nội dung giới thiệu..." />
            </Form.Item>

            <Form.Item
              label="6. Ảnh chính của quỹ"
              name="anhChinh"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: "Vui lòng tải lên ảnh chính cho quỹ" }]}
            >
              <Upload beforeUpload={() => false} listType="picture-card" maxCount={1}>
                <Button icon={<UploadOutlined />}>Tải ảnh chính</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="7. Ảnh chi tiết"
              name="anhThumbnail"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: "Vui lòng tải lên ít nhất 1 ảnh chi tiết" }]}
            >
              <Upload beforeUpload={() => false} listType="picture-card" multiple>
                <Button icon={<UploadOutlined />}>Tải ảnh thumbnail</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="8. Danh mục"
              name="danhMuc"
              rules={[{ required: true, message: "Vui lòng chọn ít nhất một danh mục!" }]}
            >
              <Checkbox.Group
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <Checkbox value="Thiên tai">Thiên tai</Checkbox>
                <Checkbox value="Giáo dục">Giáo dục</Checkbox>
                <Checkbox value="Môi trường">Môi trường</Checkbox>
                <Checkbox value="Trẻ em">Trẻ em</Checkbox>
                <Checkbox value="Xóa nghèo">Xóa nghèo</Checkbox>
                <Checkbox value="Người cao tuổi">Người cao tuổi</Checkbox>
                <Checkbox value="Người khuyết tật">Người khuyết tật</Checkbox>
                <Checkbox value="Dân tộc thiểu số">Dân tộc thiểu số</Checkbox>
                <Checkbox value="Khác">Khác</Checkbox>
              </Checkbox.Group>
            </Form.Item>


            <Form.Item
              label="9. Số tiền mục tiêu (VNĐ)"
              name="soTienMucTieu"
              rules={[{ required: true, message: "Vui lòng nhập số tiền mục tiêu" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={100000}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/,/g, "")}
                placeholder="Nhập số tiền mục tiêu..."
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="10. Ngày bắt đầu"
                  name="ngayBatDau"
                  rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
                >
                  <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="11. Ngày kết thúc"
                  name="ngayKetThuc"
                  rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
                >
                  <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      ),
    },

    // ================= BUOC 3 =================
    {
      title: "Tài khoản ngân hàng",
      icon: <BankOutlined />,
      content: (
        <>
          <Title level={4}>Phần III: Thông tin tài khoản ngân hàng</Title>
          <Paragraph style={{ color: "#555" }}>
            Vui lòng nhập chính xác thông tin tài khoản nhận quyên góp.
          </Paragraph>

          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: 800, margin: "0 auto", textAlign: "left" }}
          >
            <Form.Item
              label="1. Tên chủ tài khoản"
              name="chuTaiKhoan"
              rules={[{ required: true, message: "Vui lòng nhập tên chủ tài khoản" }]}
            >
              <Input placeholder="Nhập tên chủ tài khoản..." />
            </Form.Item>

            <Form.Item
              label="2. Số tài khoản"
              name="soTaiKhoan"
              rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }]}
            >
              <Input
                placeholder="Nhập số tài khoản ngân hàng..."
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={20}
              />
            </Form.Item>

            <Form.Item
              label="3. Ngân hàng"
              name="nganHang"
              rules={[{ required: true, message: "Vui lòng chọn ngân hàng" }]}
            >
              <Select placeholder="Chọn ngân hàng">
                <Option value="MB Bank">MB Bank</Option>
                <Option value="Vietcombank">Vietcombank</Option>
                <Option value="BIDV">BIDV</Option>
                <Option value="Techcombank">Techcombank</Option>
                <Option value="Agribank">Agribank</Option>
                <Option value="Sacombank">Sacombank</Option>
                <Option value="ACB">ACB</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="4. Chi nhánh ngân hàng"
              name="chiNhanh"
              rules={[{ required: true, message: "Vui lòng nhập chi nhánh ngân hàng" }]}
            >
              <Input placeholder="Nhập chi nhánh..." />
            </Form.Item>

            <Form.Item
              label="5. Mã QR nhận quyên góp (nếu có)"
              name="qrCode"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <Upload beforeUpload={() => false} listType="picture-card" maxCount={1}>
                <Button icon={<UploadOutlined />}>Tải lên mã QR</Button>
              </Upload>
            </Form.Item>
          </Form>
        </>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1500, margin: "0 auto", padding: "40px 20px" }}>
        <Card
          bordered={false}
          style={{
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            borderRadius: 12,
            padding: "20px 0",
          }}
        >
          <Title level={2} style={{ color: "#1e9c45", marginBottom: 16 }}>
            ĐĂNG KÝ TẠO QUỸ MỚI
          </Title>

          <Paragraph style={{ fontSize: 16, color: "#555", marginBottom: 30 }}>
            Hãy cùng chúng tôi tạo nên những quỹ thiện nguyện minh bạch, hiệu quả và ý nghĩa.
            Quy trình đăng ký gồm 3 bước đơn giản.
          </Paragraph>

          {!walletAddress && (
            <div style={{ marginBottom: 20, textAlign: "center" }}>
              <Button
                type="primary"
                onClick={handleConnectWallet}
                style={{
                  backgroundColor: "#1e9c45",
                  borderColor: "#1e9c45",
                  borderRadius: 8,
                }}
              >
                Kết nối MetaMask Wallet
              </Button>
              <Paragraph style={{ marginTop: 10, color: "#888", fontSize: 14 }}>
                Vui lòng kết nối ví MetaMask để tạo quỹ trên blockchain
              </Paragraph>
            </div>
          )}

          {walletAddress && (
            <div style={{ marginBottom: 20, textAlign: "center", padding: "10px", backgroundColor: "#f0f9f4", borderRadius: 8 }}>
              <Paragraph style={{ margin: 0, color: "#1e9c45" }}>
                ✅ Đã kết nối: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Paragraph>
            </div>
          )}

          <Steps
            current={currentStep}
            labelPlacement="vertical"
            style={{ maxWidth: 750, margin: "0 auto", marginBottom: 40 }}
          >
            {steps.map((item, index) => (
              <Step key={index} title={item.title} icon={item.icon} />
            ))}
          </Steps>

          <div style={{ marginBottom: 30 }}>{steps[currentStep].content}</div>

          <Row justify="center" gutter={16}>
            {currentStep > 0 && (
              <Col>
                <Button onClick={prev} style={{ borderRadius: 8, padding: "0 30px" }}>
                  Quay lại
                </Button>
              </Col>
            )}
            {currentStep < steps.length - 1 && (
              <Col>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#1e9c45",
                    borderColor: "#1e9c45",
                    borderRadius: 8,
                    padding: "0 30px",
                  }}
                  onClick={next}
                >
                  Tiếp theo
                </Button>
              </Col>
            )}
            {currentStep === steps.length - 1 && (
              <Col>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                    borderRadius: 8,
                    padding: "0 40px",
                  }}
                  onClick={() => form.validateFields().then(handleFinish)}
                  icon={<CheckCircleOutlined />}
                  loading={loading}
                  disabled={!walletAddress}
                >
                  Hoàn tất
                </Button>
              </Col>
            )}
          </Row>
        </Card>
      </div>
      <FooterSection />
    </>
  );
};

export default TaoQuyMoi;
