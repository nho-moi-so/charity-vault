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
import { fundAPI, uploadAPI } from "../services/api";

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

    const handleAuthChange = (event) => {
      const user = event.detail;
      setWalletAddress(user?.address || null);
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
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
      message.error(
        error?.message || "Không thể kết nối ví. Vui lòng thử lại."
      );
    }
  };

  // Define fields for each step to handle validation
  const stepFields = [
    // Step 1 Fields
    [
      "hoTen",
      "ngaySinh",
      "dienThoai",
      "email",
      "social",
      "diaChi",
      "tenNhom",
      "vaiTro",
      "logo",
      "linkGioiThieu",
      "thanhTich",
    ],
    [
      "mucDich",
      "camKetCongKhai",
      "tenQuy",
      "moTaNgan",
      "gioiThieu",
      "anhChinh",
      "anhThumbnail",
      "danhMuc",
      "soTienMucTieu",
      "ngayBatDau",
      "ngayKetThuc",
    ],
  ];

  const next = () => {
    // Validate only fields in the current step
    form
      .validateFields(stepFields[currentStep])
      .then(() => setCurrentStep(currentStep + 1))
      .catch((error) => {
        console.error("Validation failed:", error);
        message.error("Vui lòng nhập đầy đủ thông tin trước khi tiếp tục.");
      });
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const handleFinish = async () => {
    // Validate all fields before submitting
    try {
      const values = await form.validateFields();

      if (!walletAddress) {
        message.error("Vui lòng kết nối ví MetaMask trước khi tạo quỹ!");
        return;
      }

      try {
        setLoading(true);

        // Helper function để lấy URL từ file list
        const getFileUrl = (fileList) => {
          if (fileList && fileList.length > 0 && fileList[0].url) {
            return fileList[0].url;
          }
          return "";
        };

        const getFileUrls = (fileList) => {
          if (fileList && fileList.length > 0) {
            return fileList.map((f) => f.url).filter((url) => url);
          }
          return [];
        };

        // Tạo metadata URI (có thể lưu lên IPFS hoặc backend)
        const metadata = {
          title: values.tenQuy,
          description: values.moTaNgan,
          fullDescription: values.gioiThieu,
          category: values.danhMuc || [],
          goal: values.soTienMucTieu,
          startDate: values.ngayBatDau,
          endDate: values.ngayKetThuc,
          images: {
            main: getFileUrl(values.anhChinh),
            thumbnails: getFileUrls(values.anhThumbnail),
            logo: getFileUrl(values.logo),
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
        message.loading({
          content: "Đang tạo quỹ trên blockchain...",
          key: "creating",
        });

        const receipt = await createFund(values.tenQuy, metadataURI);

        // Lấy fundId từ event
        const { getFundIdFromReceipt } = await import(
          "../services/Web3Service"
        );
        const fundId = await getFundIdFromReceipt(receipt);
        console.log("Fund Created with ID:", fundId);

        // Sync với backend
        if (fundId !== null) {
          try {
            await fundAPI.create({
              fundId,
              title: values.tenQuy,
              metadataURI,
              owner: walletAddress,
              txHash: receipt.hash,
              image: getFileUrl(values.anhChinh),
              thumbnails: getFileUrls(values.anhThumbnail),
              description: values.moTaNgan,
              category: values.danhMuc,
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
          key: "creating",
        });
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Vui lòng kiểm tra lại thông tin.");
    }
  };

  const disabledDate = (current) => {
    // Không cho chọn ngày trước ngày hiện tại
    return current && current.valueOf() < new Date().setHours(0, 0, 0, 0);
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
            Vui lòng điền đầy đủ thông tin cá nhân hoặc đại diện tổ chức của
            bạn.
          </Paragraph>

          <Form.Item
            label="1. Họ và tên"
            name="hoTen"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên..." />
          </Form.Item>

          <Form.Item label="2. Ngày sinh (Tùy chọn)" name="ngaySinh">
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="3. Số điện thoại"
            name="dienThoai"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại..." />
          </Form.Item>

          <Form.Item
            label="4. Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ email" },
              { type: "email", message: "Địa chỉ email không hợp lệ" },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item label="5. Tài khoản mạng xã hội (Tùy chọn)" name="social">
            <Input placeholder="Nhập link tài khoản mạng xã hội..." />
          </Form.Item>

          <Form.Item label="6. Địa chỉ (Tùy chọn)" name="diaChi">
            <Input placeholder="Nhập địa chỉ..." />
          </Form.Item>

          <Form.Item label="7. Tên nhóm (Tùy chọn)" name="tenNhom">
            <Input placeholder="Nhập tên nhóm..." />
          </Form.Item>

          <Form.Item label="8. Vai trò (Tùy chọn)" name="vaiTro">
            <Radio.Group>
              <Radio value="nguoiSangLap">Người sáng lập</Radio>
              <Radio value="caNhan">Cá nhân</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="9. Logo, hình ảnh nhận diện (Tùy chọn)"
            name="logo"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && e.fileList;
            }}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              customRequest={async ({ file, onSuccess, onError }) => {
                try {
                  const response = await uploadAPI.uploadImage(file);
                  if (response.data.success) {
                    file.url = response.data.url;
                    onSuccess(response.data, file);
                    message.success(`${file.name} uploaded successfully`);
                  } else {
                    onError(new Error(response.data.message));
                  }
                } catch (error) {
                  onError(error);
                  message.error(`${file.name} upload failed.`);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="10. Thành tích, khen thưởng (Tùy chọn)"
            name="thanhTich"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && e.fileList;
            }}
          >
            <Upload
              maxCount={5}
              customRequest={async ({ file, onSuccess, onError }) => {
                try {
                  const response = await uploadAPI.uploadImage(file);
                  if (response.data.success) {
                    file.url = response.data.url;
                    onSuccess(response.data, file);
                  } else {
                    onError(new Error(response.data.message));
                  }
                } catch (error) {
                  onError(error);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>
                Tải lên file (PDF, hình ảnh...)
              </Button>
            </Upload>
          </Form.Item>
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

          <Form.Item label="1. Mục đích sử dụng (Tùy chọn)" name="mucDich">
            <Checkbox.Group
              style={{ display: "flex", flexDirection: "column" }}
            >
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
            rules={[
              {
                required: true,
                message: "Vui lòng chọn cam kết",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="dongy">Đồng ý</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="3. Tên quỹ"
            name="tenQuy"
            rules={[{ required: true, message: "Nhập tên quỹ" }]}
          >
            <Input placeholder="Nhập tên quỹ..." />
          </Form.Item>

          <Form.Item
            label="4. Mô tả ngắn"
            name="moTaNgan"
            rules={[{ required: true, message: "Nhập mô tả ngắn" }]}
          >
            <Input placeholder="Nhập mô tả..." />
          </Form.Item>

          <Form.Item
            label="5. Giới thiệu quỹ"
            name="gioiThieu"
            rules={[{ required: true, message: "Nhập giới thiệu quỹ" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Nhập nội dung giới thiệu..."
            />
          </Form.Item>

          <Form.Item
            label="6. Ảnh chính của quỹ"
            name="anhChinh"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && e.fileList;
            }}
            rules={[{ required: true, message: "Tải lên ảnh chính cho quỹ" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              customRequest={async ({ file, onSuccess, onError }) => {
                try {
                  const response = await uploadAPI.uploadImage(file);
                  if (response.data.success) {
                    file.url = response.data.url;
                    onSuccess(response.data, file);
                    message.success("Upload ảnh chính thành công");
                  } else {
                    onError(new Error(response.data.message));
                  }
                } catch (error) {
                  onError(error);
                  message.error("Upload ảnh chính thất bại");
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh chính</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="7. Ảnh chi tiết (Tùy chọn)"
            name="anhThumbnail"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && e.fileList;
            }}
          >
            <Upload
              listType="picture-card"
              multiple
              customRequest={async ({ file, onSuccess, onError }) => {
                try {
                  const response = await uploadAPI.uploadImage(file);
                  if (response.data.success) {
                    file.url = response.data.url;
                    onSuccess(response.data, file);
                  } else {
                    onError(new Error(response.data.message));
                  }
                } catch (error) {
                  onError(error);
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh thumbnail</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="8. Danh mục"
            name="danhMuc"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một danh mục!",
              },
            ]}
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
            rules={[
              { required: true, message: "Vui lòng nhập số tiền mục tiêu" },
            ]}
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
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="11. Ngày kết thúc"
                name="ngayKetThuc"
                rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </Col>
          </Row>
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
            Hãy cùng chúng tôi tạo nên những quỹ thiện nguyện minh bạch, hiệu
            quả và ý nghĩa. Quy trình đăng ký gồm 3 bước đơn giản.
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
            <div
              style={{
                marginBottom: 20,
                textAlign: "center",
                padding: "10px",
                backgroundColor: "#f0f9f4",
                borderRadius: 8,
              }}
            >
              <Paragraph style={{ margin: 0, color: "#1e9c45" }}>
                ✅ Đã kết nối: {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
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

          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: 800, margin: "0 auto", textAlign: "left" }}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                style={{ display: currentStep === index ? "block" : "none" }}
              >
                {step.content}
              </div>
            ))}
          </Form>

          <Row justify="center" gutter={16}>
            {currentStep > 0 && (
              <Col>
                <Button
                  onClick={prev}
                  style={{ borderRadius: 8, padding: "0 30px" }}
                >
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
                  onClick={handleFinish}
                  icon={<CheckCircleOutlined />}
                  loading={loading}
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
