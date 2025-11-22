import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import FundList from "./pages/FundList";
import FundDetail from "./pages/FundDetail";
import SaoKeQuy from "./pages/SaoKeQuy";
import DonatePage from "./pages/DonatePage";
import TaoQuyMoi from "./pages/TaoQuyMoi";
import GioiThieuQuy from "./pages/GioiThieuQuy";
import DieuKhoan from "./pages/DieuKhoan";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/funds" element={<FundList />} />
        <Route path="/funds/:id" element={<FundDetail />} />
        <Route path="/saoke-quy" element={<SaoKeQuy />} />
        <Route path="/donate/:id" element={<DonatePage />} />
        <Route path="/tao-quy-moi" element={<TaoQuyMoi />} />
        <Route path="/gioi-thieu-quy" element={<GioiThieuQuy />} />
        <Route path="/dieu-khoan" element={<DieuKhoan />} />
      </Routes>
    </Router>
  );
}

export default App;
