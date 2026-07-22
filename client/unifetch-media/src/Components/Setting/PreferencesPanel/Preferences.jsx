import "./Preferences.css";
import { Download, HardDrive, Film, ChevronDown } from "lucide-react";

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
            checked={preferences.autoDownload}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                autoDownload: e.target.checked,
              })
            }
          />

          <span className="slider"></span>
        </label>
      </div>

      {/* Storage Location */}

      <div className="pref-item">
        <div className="pref-left">
          <div className="pref-icon">
            <HardDrive size={18} />
          </div>

          <div>
            <h4>Storage Location</h4>
            <p>Choose where downloaded files are stored</p>
          </div>
        </div>

        <div className="quality-select">
          <select
            value={preferences.storage.provider}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                storage: {
                  ...preferences.storage,
                  provider: e.target.value,
                },
              })
            }
          >
            <option value="device">Device</option>
            <option value="cloudinary">Cloud Storage</option>
          </select>

          <ChevronDown size={18} />
        </div>
      </div>

      {/* Video Quality */}

      <div className="pref-item">
        <div className="pref-left">
          <div className="pref-icon">
            <Film size={18} />
          </div>

          <div>
            <h4>Video Quality</h4>
            <p>Preferred quality for new downloads</p>
          </div>
        </div>

        <div className="quality-select">
          <select
            value={preferences.quality}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                quality: e.target.value,
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
