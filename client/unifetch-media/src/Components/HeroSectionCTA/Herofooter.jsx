import "./style/Herofooter.css";
import { Link } from "react-router-dom";

export default function HeroFooter() {
  return (
    <footer className="heroFooter">
      <p>UniFetch Media v1.0.0</p>

      <div className="ufm-footer-links">
        <Link to="https://github.com/MohammadMustafa23/UniFetch-Media">Documentation</Link>
        <Link to="/feedback">Feedback</Link>
        <Link to="/terms-of-service">Terms</Link>
        <Link to="/privacy-policy">Privacy</Link>
      </div>

      <div className="heroFooter__container">
        {/* Huge Brand */}
        <div className="heroFooter__watermark">UniFetch</div>

        {/* Bottom */}
        <div className="heroFooter__bottom">
          <p>
            © 2026 UniFetch Media. Portfolio project — built with the MERN
            stack.
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
