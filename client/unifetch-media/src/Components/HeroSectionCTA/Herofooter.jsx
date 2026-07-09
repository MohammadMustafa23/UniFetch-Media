import "./style/Herofooter.css";

import { Download, GitGraph , PlaySquareIcon } from "lucide-react";

export default function HeroFooter() {
  return (
    <footer className="heroFooter">
      <div className="heroFooter__container">
        {/* Top */}

        <div className="heroFooter__top">
          {/* Brand */}

          <div className="heroFooter__brand">
            <div className="heroFooter__logo">
              <Download size={18} />

              <h2>UniFetch</h2>
            </div>

            <p>
              A faster, smarter way to fetch, preview, and manage your media.
            </p>

            <div className="heroFooter__social">
              <a href="#">
                <GitGraph size={18} />
              </a>

              <a href="#">
                <PlaySquareIcon size={18} />
              </a>
            </div>
          </div>

          {/* Links */}

          <div className="heroFooter__links">
            <div>
              <h3>Product</h3>

              <a href="#">Features</a>

              <a href="#">How it works</a>

              <a href="#">Dashboard</a>

              <a href="#">Analytics</a>
            </div>

            <div>
              <h3>Resources</h3>

              <a href="#">Documentation</a>

              <a href="#">API Reference</a>

              <a href="#">Roadmap</a>

              <a href="#">Changelog</a>
            </div>

            <div>
              <h3>Company</h3>

              <a href="#">About</a>

              <a href="#">Blog</a>

              <a href="#">Contact</a>

              <a href="#">Careers</a>
            </div>
          </div>

          {/* Newsletter */}

          <div className="heroFooter__newsletter">
            <h3>Get updates</h3>

            <input type="email" placeholder="you@email.com" />

            <button>Subscribe</button>
          </div>
        </div>

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
