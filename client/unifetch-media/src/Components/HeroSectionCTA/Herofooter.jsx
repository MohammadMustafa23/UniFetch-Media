import "./style/Herofooter.css";
import { Link } from "react-router-dom";

export default function HeroFooter() {
  return (
    <footer className="heroFooter">
      <p>UniFetch v1.0.0</p>

      <div className="ufm-footer-links">
        <a
          href="https://github.com/MohammadMustafa23/UniFetch-Media"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>

        <Link to="/feedback">Feedback</Link>

        <Link to="/terms-of-service">Terms</Link>

        <Link to="/privacy-policy">Privacy</Link>
      </div>

      <div className="heroFooter__container">
        {/* Brand */}

        <div className="heroFooter__watermark">UniFetch</div>

        {/* Bottom */}

        <div className="heroFooter__bottom">
          <p>
            © 2026 UniFetch. Built with React, Node.js, Express, MongoDB &
            Redis.
          </p>

          <div>
            <Link to="/terms-of-service">Terms</Link>

            <Link to="/privacy-policy">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
