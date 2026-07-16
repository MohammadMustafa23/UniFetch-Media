import "./Preferences.css";
import { Download, Clipboard, Moon, Image, ChevronDown } from "lucide-react";

export default function Preferences({
  preferences,
  setPreferences,
  onSave,
  saving,
}) {
  if (!preferences) return null;

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
          <input
            type="checkbox"
            checked={preferences.download.autoDownload}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                download: {
                  ...preferences.download,
                  autoDownload: e.target.checked,
                },
              })
            }
          />

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
          <input
            type="checkbox"
            checked={preferences.download.autoPaste}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                download: {
                  ...preferences.download,
                  autoPaste: e.target.checked,
                },
              })
            }
          />

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
          <input
            type="checkbox"
            checked={preferences.appearance.theme === "dark"}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                appearance: {
                  ...preferences.appearance,
                  theme: e.target.checked ? "dark" : "light",
                },
              })
            }
          />

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
          <select
            value={preferences.download.quality}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                download: {
                  ...preferences.download,
                  quality: e.target.value,
                },
              })
            }
          >
            <option value="best">Best</option>
            <option value="1080p">1080p</option>
            <option value="720p">720p</option>
            <option value="480p">480p</option>
            <option value="360p">360p</option>
          </select>

          <ChevronDown size={18} />
        </div>
      </div>

      <button className="profile-save-btn" onClick={onSave} disabled={saving}>
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </section>
  );
}
