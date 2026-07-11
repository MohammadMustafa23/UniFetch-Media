import "./Preferences.css";
import { Download, Clipboard, Moon, Image, ChevronDown } from "lucide-react";

export default function Preferences() {
  return (
    <section className="preferences-card">
      <h2>Preferences</h2>

      {/* Auto Download */}

      <div className="pref-item">
        <div className="pref-left">
          <div className="pref-icon">
            <Download size={18} />
          </div>

          <div>
            <h4>Auto Download</h4>
            <p>Fetch matching links automatically</p>
          </div>
        </div>

        <label className="switch">
          <input type="checkbox" defaultChecked />

          <span className="slider"></span>
        </label>
      </div>

      {/* Auto Paste */}

      <div className="pref-item">
        <div className="pref-left">
          <div className="pref-icon">
            <Clipboard size={18} />
          </div>

          <div>
            <h4>Auto Paste</h4>
            <p>Catch copied links automatically</p>
          </div>
        </div>

        <label className="switch">
          <input type="checkbox" />

          <span className="slider"></span>
        </label>
      </div>

      {/* Theme */}

      <div className="pref-item">
        <div className="pref-left">
          <div className="pref-icon">
            <Moon size={18} />
          </div>

          <div>
            <h4>Dark / Light Mode</h4>
            <p>Switch dashboard appearance</p>
          </div>
        </div>

        <label className="switch">
          <input type="checkbox" defaultChecked />

          <span className="slider"></span>
        </label>
      </div>

      {/* Download Quality */}

      <div className="pref-item">
        <div className="pref-left">
          <div className="pref-icon">
            <Image size={18} />
          </div>

          <div>
            <h4>Download Quality</h4>
            <p>Default quality for downloads</p>
          </div>
        </div>

        <div className="quality-select">
          <select>
            <option>1080p</option>
            <option>720p</option>
            <option>480p</option>
            <option>360p</option>
          </select>

          <ChevronDown size={18} />
        </div>
      </div>
    </section>
  );
}
