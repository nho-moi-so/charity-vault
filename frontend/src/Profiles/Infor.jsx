import React, { useState, useEffect } from "react";
import { Card, Input, Button, Select, message } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const mapUserToForm = (user) => ({
  name: user?.username || "",
  gender: user?.gender || "",
  birthDate: user?.birthDate || "",
  phone: user?.phone || "",
  email: user?.email || "",
  address: user?.contactAddress || "",
  bio: user?.bio || "",
});

const Infor = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState(mapUserToForm(user));

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(mapUserToForm(user));
  }, [user]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleButtonClick = () => {
    if (editing) {
      if (!onProfileUpdate) return;
      setLoading(true);
      const payload = {
        username: formData.name,
        gender: formData.gender,
        birthDate: formData.birthDate,
        phone: formData.phone,
        email: formData.email,
        contactAddress: formData.address,
        bio: formData.bio,
      };

      onProfileUpdate(payload)
        .then((updated) => {
          setFormData(mapUserToForm(updated));
          message.success("Đã cập nhật thông tin cá nhân!");
          setEditing(false);
        })
        .catch((err) => {
          console.error("Update failed:", err);
          message.error(
            err.message || "Không thể cập nhật thông tin. Vui lòng thử lại."
          );
        })
        .finally(() => setLoading(false));
    } else {
      setEditing(true);
    }
  };

  const fieldStyle = { marginBottom: 15 };

  return (
    <Card
      title={<h2 style={{ fontWeight: "bold" }}>Thông tin cá nhân</h2>}
      style={{ marginBottom: 20 }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={fieldStyle}>
          <label style={{ fontWeight: "bold" }}>Tên tài khoản</label>
          <Input
            placeholder="Tên tài khoản"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={!editing || loading}
          />
        </div>

        <div style={fieldStyle}>
          <label style={{ fontWeight: "bold" }}>Giới tính</label>
          <Select
            placeholder="Giới tính"
            value={formData.gender}
            onChange={(value) => handleChange("gender", value)}
            disabled={!editing || loading}
            style={{ width: "100%" }}
          >
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
            <Option value="Khác">Khác</Option>
          </Select>
        </div>

        <div style={fieldStyle}>
          <label style={{ fontWeight: "bold" }}>Ngày sinh</label>
          <Input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
            disabled={!editing || loading}
          />
        </div>

        <div style={fieldStyle}>
          <label style={{ fontWeight: "bold" }}>Số điện thoại</label>
          <Input
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            disabled={!editing || loading}
          />
        </div>

        <div style={fieldStyle}>
          <label style={{ fontWeight: "bold" }}>Email</label>
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled={!editing || loading}
          />
        </div>

        <div style={fieldStyle}>
          <label style={{ fontWeight: "bold" }}>Địa chỉ</label>
          <Input
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={!editing || loading}
          />
        </div>

        <div style={fieldStyle}>
          <label style={{ fontWeight: "bold" }}>Giới thiệu bản thân</label>
          <TextArea
            rows={3}
            placeholder="Giới thiệu bản thân"
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            disabled={!editing || loading}
          />
        </div>
      </div>

      <Button
        type="primary"
        loading={loading}
        style={{
          marginTop: 20,
          background: "linear-gradient(90deg, #b6eb7a 0%, #52c41a 100%)",
          border: "none",
          color: "#fff",
          fontWeight: 500,
          width: "100%",
        }}
        onClick={handleButtonClick}
      >
        {editing ? "Cập nhật" : "Chỉnh sửa"}
      </Button>
    </Card>
  );
};

export default Infor;
