import {
  Bell,
  Download,
  FolderOpen,
  Check,
  Clipboard,
  Cloud,
} from "lucide-react";

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
              <p>Get notified when downloads finish.</p>
            </div>
          </div>

          <label className="toggleSwitch">
            <input type="checkbox" defaultChecked />
            <span className="toggleSlider"></span>
          </label>
        </div>

        <div className="settingCard">
          <div className="settingInfo">
            <Clipboard size={20} />
            <div>
              <h4>Auto Paste</h4>
              <p>Detect copied links automatically.</p>
            </div>
          </div>

          <label className="toggleSwitch">
            <input type="checkbox" defaultChecked />
            <span className="toggleSlider"></span>
          </label>
        </div>

        <div className="settingCard">
          <div className="settingInfo">
            <Download size={20} />
            <div>
              <h4>Auto Download</h4>
              <p>Start downloads automatically.</p>
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
              <p>Best Available</p>
            </div>

            <button>Change</button>
          </div>

          <div className="preferenceItem">
            <div>
              <h5>Storage</h5>
              <p>Cloud Storage</p>
            </div>

            <button>
              <Cloud size={16} />
            </button>
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
              <h5>Status</h5>
              <p>Ready to Download</p>
            </div>

            <span className="enabledBadge">
              <Check size={15} />
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
