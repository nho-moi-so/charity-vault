import React from "react";
import { Typography, Card, Row, Col } from "antd";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";

const { Title, Paragraph, Text } = Typography;

const DieuKhoan = () => {
  return (
    <>
      <Navbar />

      <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "50px 0" }}>
        <Row justify="center">
          <Col xs={22} sm={20} md={18} lg={16}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                padding: 30,
                background: "#fff",
              }}
            >
              <Title level={2} style={{ textAlign: "center", marginBottom: 30 }}>
                Điều khoản sử dụng
              </Title>

              <Paragraph>
                Chào mừng bạn đến với nền tảng <Text strong>Quỹ Quyên Góp Minh Bạch</Text>. 
                Khi sử dụng website này, bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản 
                sử dụng được quy định dưới đây. Vui lòng đọc kỹ trước khi tham gia.
              </Paragraph>

              <Title level={4}>1. Mục đích sử dụng</Title>
              <Paragraph>
                Website được xây dựng nhằm mục tiêu tạo môi trường minh bạch, giúp cộng đồng 
                dễ dàng tiếp cận và đóng góp cho các quỹ thiện nguyện, hỗ trợ người khó khăn 
                và các hoạt động xã hội có ý nghĩa.
              </Paragraph>

              <Title level={4}>2. Quyền và nghĩa vụ của người dùng</Title>
              <Paragraph>
                - Cung cấp thông tin chính xác, đầy đủ khi tham gia gây quỹ hoặc đóng góp. <br />
                - Không sử dụng nền tảng vào các mục đích gian lận, sai trái hoặc vi phạm pháp luật. <br />
                - Người dùng có quyền yêu cầu chỉnh sửa, cập nhật hoặc xóa thông tin cá nhân khi cần thiết.
              </Paragraph>

              <Title level={4}>3. Quyền và trách nhiệm của Ban quản trị</Title>
              <Paragraph>
                - Ban quản trị có quyền kiểm duyệt, tạm dừng hoặc gỡ bỏ các quỹ không tuân thủ quy định. <br />
                - Đảm bảo bảo mật thông tin cá nhân và minh bạch dữ liệu quyên góp. <br />
                - Hỗ trợ người dùng trong việc xác minh, giải đáp thắc mắc hoặc khiếu nại.
              </Paragraph>

              <Title level={4}>4. Bản quyền và nội dung</Title>
              <Paragraph>
                Tất cả hình ảnh, nội dung và tài liệu trên website thuộc quyền sở hữu của 
                Quỹ Quyên Góp Minh Bạch. Mọi hành vi sao chép, phát tán trái phép đều bị nghiêm cấm.
              </Paragraph>

              <Title level={4}>5. Thay đổi điều khoản</Title>
              <Paragraph>
                Chúng tôi có thể điều chỉnh các điều khoản sử dụng bất kỳ lúc nào. Mọi thay đổi sẽ 
                được cập nhật công khai trên website. Người dùng nên thường xuyên kiểm tra để nắm rõ các cập nhật mới nhất.
              </Paragraph>

              <Paragraph>
                Nếu có bất kỳ câu hỏi hoặc yêu cầu hỗ trợ, vui lòng liên hệ qua email:{" "}
                <Text strong>hotro@quyminhbach.vn</Text>.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      <FooterSection />
    </>
  );
};

export default DieuKhoan;
