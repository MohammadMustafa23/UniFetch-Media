import { useState } from "react";
import { Download, Menu, X } from "lucide-react";
import "./HeroSectionCTA.css";
import {useNavigate} from 'react-router-dom'

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const navItems = [
    "Features",
    "How it works",
    "Product",
    "Analytics",
    "Security",
  ];

  return (
    <header className="uf-navbar">
      <div className="uf-nav-container">
        {/* Logo */}
        <a href="/" className="uf-logo">
          <div className="uf-logo-icon">
            <Download size={15} />
          </div>

          <span>UniFetch</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="uf-nav-links">
          {navItems.map((item) => (
            <a href="/" key={item}>
              {item}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="uf-nav-right">
          <button className="uf-signin-btn" onClick={()=>{navigate('/authantication-page')}} >Sign in</button>

          <button className="uf-download-btn" onClick={()=>{navigate('/authantication-page')}}>Get Start</button>

          <button className="uf-menu-btn" onClick={() => setOpen(!open)}>
            {open ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`uf-mobile-menu ${open ? "show" : ""}`}>
        {navItems.map((item) => (
          <a href="/" key={item}>
            {item}
          </a>
        ))}

        <button className="uf-mobile-signin" onClick={()=>{navigate('/authantication-page')}} >Sign in</button>

        <button className="uf-mobile-download" onClick={()=>{navigate('/authantication-page')}} >Get Start</button>
      </div>
    </header>
  );
}
