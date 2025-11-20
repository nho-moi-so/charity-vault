import React from "react";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import Categories from "../components/Categories";
import FeaturedCampaigns from "../components/FeaturedCampaigns";
import CaNhanNoiBat  from "../components/CaNhanNoiBat";
import FooterSection from "../components/FooterSection";

const Home = () => {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "1500px", margin: "20px auto" }}>
        <Slider />
        <Categories />
         <FeaturedCampaigns />
           <CaNhanNoiBat />
      </div>
      <FooterSection />
    </>
  );
};

export default Home;
