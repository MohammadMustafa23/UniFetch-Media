import "./style/PlatformSection.css";
import { PlaySquare, Camera } from "lucide-react";

const platforms = [
  {
    name: "YouTube",
    icon: <PlaySquare size={18} />,
  },
  {
    name: "Instagram",
    icon: <Camera size={18} />,
  },
];

export default function PlatformSection() {
  return (
    <section className="platformSection">
      <div className="platformSection__container">
        <div className="platformSection__header">
          <div className="platformSection__label">
            <span className="platformSection__line"></span>
            <p>SUPPORTED SOURCES</p>
          </div>

          <h2 className="platformSection__title">
            Works with the platforms you already use
          </h2>
        </div>

        <div className="platformSection__grid">
          {platforms.map((platform) => (
            <div className="platformSection__card" key={platform.name}>
              <span className="platformSection__icon">{platform.icon}</span>

              <span className="platformSection__name">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
