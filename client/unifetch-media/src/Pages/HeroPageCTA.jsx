import { useRef } from "react";

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

  const pageRef = useRef(null);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const dashboardRef = useRef(null);
  const analyticsRef = useRef(null);
  const securityRef = useRef(null);

  return (
    <div ref={pageRef} className="hero-page">

      <NavBar
        heroRef={heroRef}
        featuresRef={featuresRef}
        howItWorksRef={howItWorksRef}
        dashboardRef={dashboardRef}
        analyticsRef={analyticsRef}
        securityRef={securityRef}
      />

      <main className="homepage">

        <section ref={heroRef}>
          <HeroSection />
        </section>

        <section className="platform-section">
          <PlatformSection />
        </section>

        <section
          ref={featuresRef}
          className="feature-section"
        >
          <FeatureSection />
        </section>

        <section
          ref={howItWorksRef}
          className="how-section"
        >
          <HowItsWork />
        </section>

        <section
          ref={dashboardRef}
          className="dashboard-section"
        >
          <DashboardShowcase />
        </section>

        <section
          ref={securityRef}
          className="trust-section"
        >
          <TrustSection />
        </section>

        <section
          ref={analyticsRef}
          className="analytics-section"
        >
          <AnalyticsSection />
        </section>

        <section className="review-section">
          <Review />
        </section>

        <section className="cta-section">
          <CTASection />
        </section>

      </main>

      <Footer />

    </div>
  );
}