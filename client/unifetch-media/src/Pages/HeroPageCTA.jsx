import NavBar from "../Components/HeroSectionCTA/NavBar";
import HeroSection from "../Components/HeroSectionCTA/HeroSection";
import PlatformSection from "../Components/HeroSectionCTA/PlatformSection";
import FeatureSection from "../Components/HeroSectionCTA/FeatureSection";
import HowItsWork from "../Components/HeroSectionCTA/HowitsWork";
import DashboardShowcase from "../Components/HeroSectionCTA/DashBoard/DashBoardShowcase";
import TrustSection from "../Components/HeroSectionCTA/TrustSection";
import AnalyticsSection from "../Components/HeroSectionCTA/AnalyticsSection";
import Review from "../Components/HeroSectionCTA/Review";
import CTASection from "../Components/HeroSectionCTA/CTASection";
import Footer from "../Components/HeroSectionCTA/Herofooter";

import "../Components/HeroSectionCTA/style/HeroSection.css";

export default function HeroPageCTA() {
  return (
    <>
      <NavBar />

       <main className="homepage">
        <HeroSection />

        <PlatformSection />

        <FeatureSection />

        <HowItsWork />

        <DashboardShowcase />

        <TrustSection />

        <AnalyticsSection />

        <Review />  

        <CTASection /> 
      </main>

      <Footer /> 
    </>
  );
}
