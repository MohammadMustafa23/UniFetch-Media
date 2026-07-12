import "./style/Herofooter.css";

import { Download, GitGraph, PlaySquareIcon } from "lucide-react";

export default function HeroFooter() {
  return (
    <footer className="heroFooter">
      <p>UniFetch Media v2.4.0</p>

      <div className="ufm-footer-links">
        <a href="#">Documentation</a>
        <a href="#">Support</a>
        <a href="#">Feedback</a>
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
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
            <a href="#">Terms</a>

            <a href="#">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
