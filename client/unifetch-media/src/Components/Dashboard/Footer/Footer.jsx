import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="ufm-footer">
      <p>UniFetch Media v2.4.0</p>

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
    </footer>
  );
};

export default Footer;
