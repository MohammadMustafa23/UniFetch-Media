import "./style/CTASection.css";
import { ArrowRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef,useState } from "react";

export default function CTASection({featuresRef}) {
  const navigate = useNavigate();
  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="ctaSection">
      <div className="ctaSection__container">
        <div className="ctaSection__glow ctaSection__glow--left"></div>
        <div className="ctaSection__glow ctaSection__glow--right"></div>

        <div className="ctaSection__content">
          <h2 className="ctaSection__title">Download smarter, not harder.</h2>

          <p className="ctaSection__subtitle">
            Save time with faster downloads, auto detection, queue management,
            and support for YouTube & Instagram.
          </p>

          <div className="ctaSection__actions">
            <button
              className="ctaSection__primary"
              onClick={() => navigate("/authantication-page")}
            >
              <Download size={18} />
              Get Started Free
            </button>

            <button className="ctaSection__secondary"  onClick={() => scrollTo(featuresRef)} >
              Explore Features
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
