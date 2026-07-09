import { Download, Check, Play, Music2 } from "lucide-react";

export default function AuthLeftPanel() {
  return (
    <section className="auth-left">
      {/* Logo */}

      <div className="brand">
        <div className="brand-icon">
          <Download size={18} />
        </div>

        <h2>UniFetch</h2>
      </div>

      {/* Hero */}

      <div className="hero-content">
        <h1>
          Your media queue,
          <br />
          <span>wherever you sign in.</span>
        </h1>

        <p>
          Fetch, preview, and manage downloads across every device — with Auto
          Paste, Auto Download, and optional two-factor security built in.
        </p>
      </div>

      {/* Features */}

      <div className="features">
        <div className="feature">
          <Check size={18} />

          <span>Auto Paste & Auto Download</span>
        </div>

        <div className="feature">
          <Check size={18} />

          <span>Optional two-factor authentication</span>
        </div>

        <div className="feature">
          <Check size={18} />

          <span>Synced queue across every device</span>
        </div>
      </div>

      {/* Queue Card */}

      <div className="queue-card">
        {/* Item */}

        <div className="queue-item">
          <div className="queue-left">
            <div className="queue-icon">
              <Play size={14} />
            </div>

            <div>
              <h4>Launch_Trailer_Final.mp4</h4>

              <div className="progress">
                <div className="progress-fill" style={{ width: "27%" }} />
              </div>
            </div>
          </div>

          <span>27%</span>
        </div>

        {/* Item */}

        <div className="queue-item">
          <div className="queue-left">
            <div className="queue-icon">
              <Music2 size={14} />
            </div>

            <div>
              <h4>Podcast_Ep42.mp3</h4>

              <div className="progress">
                <div className="progress-fill" style={{ width: "22%" }} />
              </div>
            </div>
          </div>

          <span>22%</span>
        </div>
      </div>

      {/* Review */}

      <div className="review">
        <div className="avatar">RK</div>

        <div>
          <h4>Rhea K. — Video editor</h4>

          <p>"Auto Paste alone saved me hours a week."</p>
        </div>
      </div>
    </section>
  );
}
