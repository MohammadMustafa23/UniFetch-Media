import { Bell, Moon, Download, Shield, FolderOpen, Check } from "lucide-react";

export default function SettingsContent() {
  return (
    <div className="settingsContent">
      {/* Left */}

      <div className="settingsColumn">
        <div className="settingCard">
          <div className="settingInfo">
            <Bell size={20} />
            <div>
              <h4>Notifications</h4>
              <p>Notify when downloads complete.</p>
            </div>
          </div>

          <label className="toggleSwitch">
            <input type="checkbox" defaultChecked />
            <span className="toggleSlider"></span>
          </label>
        </div>

        <div className="settingCard">
          <div className="settingInfo">
            <Moon size={20} />
            <div>
              <h4>Dark Theme</h4>
              <p>Always use dark appearance.</p>
            </div>
          </div>

          <label className="toggleSwitch">
            <input type="checkbox" defaultChecked />
            <span className="toggleSlider"></span>
          </label>
        </div>

        <div className="settingCard">
          <div className="settingInfo">
            <Shield size={20} />
            <div>
              <h4>Safe Downloads</h4>
              <p>Verify downloaded files automatically.</p>
            </div>
          </div>

          <label className="toggleSwitch">
            <input type="checkbox" defaultChecked />
            <span className="toggleSlider"></span>
          </label>
        </div>
      </div>

      {/* Right */}

      <div className="settingsColumn">
        <div className="preferencesCard">
          <h3>Download Preferences</h3>

          <div className="preferenceItem">
            <div>
              <h5>Default Quality</h5>
              <p>Highest Available</p>
            </div>

            <button>Change</button>
          </div>

          <div className="preferenceItem">
            <div>
              <h5>Download Folder</h5>
              <p>~/Downloads/UniFetch</p>
            </div>

            <button>
              <FolderOpen size={16} />
            </button>
          </div>

          <div className="preferenceItem">
            <div>
              <h5>Auto Download</h5>
              <p>Enabled</p>
            </div>

            <span className="enabledBadge">
              <Check size={15} />
              Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
