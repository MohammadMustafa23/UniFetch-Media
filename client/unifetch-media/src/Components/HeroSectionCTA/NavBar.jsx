import { useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HeroSectionCTA.css";

export default function NavBar({
  heroRef,
  featuresRef,
  howItWorksRef,
  dashboardRef,
  analyticsRef,
  securityRef,
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setOpen(false);
  };

  const navItems = [
    { label: "Features", ref: featuresRef },
    { label: "How It Works", ref: howItWorksRef },
    { label: "Dashboard", ref: dashboardRef },
    { label: "Insights", ref: analyticsRef },
    { label: "Security", ref: securityRef },
  ];

  return (
    <header className="uf-navbar">
      <div className="uf-nav-container">
        {/* Logo */}
        <button
          type="button"
          className="uf-logo"
          onClick={() => scrollTo(heroRef)}
        >
          <div className="uf-logo-icon">
            <Download size={15} />
          </div>

          <span>UniFetch</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="uf-nav-links">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="uf-nav-link"
              onClick={() => scrollTo(item.ref)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="uf-nav-right">
          <button
            className="uf-signin-btn"
            onClick={() => navigate("/authantication-page")}
          >
            Sign In
          </button>

          <button
            className="uf-download-btn"
            onClick={() => navigate("/authantication-page")}
          >
            Get Started
          </button>

          <button
            className="uf-menu-btn"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`uf-mobile-menu ${open ? "show" : ""}`}>
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className="uf-mobile-link"
            onClick={() => scrollTo(item.ref)}
          >
            {item.label}
          </button>
        ))}

        <button
          className="uf-mobile-download"
          onClick={() => {
            setOpen(false);
            navigate("/authantication-page");
          }}
        >
          Get Started
        </button>
      </div>
    </header>
  );
}
