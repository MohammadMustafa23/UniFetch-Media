import { useNavigate } from "react-router-dom";
import "./style/HeroSection.css";
import {
  ArrowRight,
  Check,
  Download,
  Play,
  Shield,
  Zap,
  Search,
  Music2,
  Video,
  LayoutGrid,
  User,
  BarChart3,
  PlusSquare,
} from "lucide-react";
export default function HeroSection({dashboardRef}) {
  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  };
  const navigate = useNavigate();
  return (
    <section className="hero">
      {/* Background */}

      <div className="hero-grid"></div>

      <div className="hero-gradient-left"></div>
      <div className="hero-gradient-right"></div>
      <div className="hero-gradient-bottom"></div>

      <div className="container hero-wrapper">
        {/* LEFT */}

        <div className="hero-left">
          <div className="hero-badge">
            <span className="dot"></span>
            Smart Multi-Platform Media Downloader
          </div>

          <h1>
            Download, organize,
            <br />
            and <span>manage</span>
            <br />
            your media.
          </h1>

          <p>
            UniFetch is a modern media downloader that lets you download videos, audio from multiple platforms with smart queue management, cloud storage, download history, pause & resume, real-time progress tracking, and secure account management.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={()=>{navigate('/authantication-page')}} >Get Started</button>

            <button className="secondary-btn"  onClick={() => scrollTo(dashboardRef)}>
              View Dashboard
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="hero-features">
            <div className="feature-chip">
              <Zap size={15} />
              Smart Queue
            </div>

            <div className="feature-chip">
              <Shield size={15} />
              Cloud Storage
            </div>

            <div className="feature-chip">
              <Download size={15} />
              Real time Progress
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="hero-right">
          <div className="dashboard">
            {/* Sidebar */}

            <div className="sidebar">
              <div className="side-logo"></div>

              <LayoutGrid size={18} />
              <PlusSquare size={18} />
              <BarChart3 size={18} />
              <User size={18} />
            </div>

            {/* Main */}

            <div className="dashboard-content">
              <div className="dashboard-header">
                <h3>Queue</h3>

                <div className="search-box">
                  <Search size={15} />

                  <input placeholder="https://source.example/media/x8" />
                </div>
              </div>

              <div className="dashboard-body">
                {/* Preview */}

                <div className="preview-card">
                  <div className="preview-image">
                    <div className="play-btn">
                      <Play size={18} fill="white" />
                    </div>
                  </div>

                  <h4>Studio Session — Full Take</h4>

                  <span>by CreatorStudio · 04:12</span>

                  <div className="tags">
                    <span>1080p</span>

                    <span>720p</span>

                    <span>MP3</span>
                  </div>

                  <button className="download-btn">Download</button>
                </div>

                {/* Active Downloads */}

                <div className="download-panel">
                  <h5>ACTIVE DOWNLOADS</h5>

                  <div className="download-item">
                    <div>
                      <Video size={16} />
                      Launch_Trailer_Final.mp4
                    </div>

                    <small>64%</small>
                  </div>

                  <div className="progress">
                    <span style={{ width: "64%" }}></span>
                  </div>

                  <div className="download-item">
                    <div>
                      <Music2 size={16} />
                      Podcast_Ep42.mp3
                    </div>

                    <small>31%</small>
                  </div>

                  <div className="progress">
                    <span style={{ width: "31%" }}></span>
                  </div>

                  <div className="stats">
                    <div>
                      <h3>12</h3>
                      <span>Queued</span>
                    </div>

                    <div>
                      <h3>3</h3>
                      <span>Active</span>
                    </div>

                    <div>
                      <h3>0</h3>
                      <span>Failed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
