import "./style/CTASection.css";
import { ArrowRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTASection({ featuresRef }) {
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
          <h2 className="ctaSection__title">
            Start downloading with UniFetch today.
          </h2>

          <p className="ctaSection__subtitle">
            Download, manage, and organize your media with a fast, simple, and
            reliable experience.
          </p>

          <div className="ctaSection__actions">
            <button
              className="ctaSection__primary"
              onClick={() => navigate("/authantication-page")}
            >
              <Download size={18} />
              Get Started
            </button>

            <button
              className="ctaSection__secondary"
              onClick={() => scrollTo(featuresRef)}
            >
              View Features
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
