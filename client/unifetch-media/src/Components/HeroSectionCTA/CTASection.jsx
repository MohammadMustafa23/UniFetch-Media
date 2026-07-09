import "./style/CTASection.css";
import { ArrowRight, Download } from "lucide-react";

export default function CTASection() {
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
            <button className="ctaSection__primary">
              <Download size={18} />
              Get Started Free
            </button>

            <button className="ctaSection__secondary">
              Explore Features
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
