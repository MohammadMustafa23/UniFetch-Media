import "./style/HowitsWork.css";

import { ArrowRight, Link2, Eye, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Paste a Media Link",
    icon: <Link2 size={22} />,
    description:
      "Paste a supported YouTube or Instagram URL. UniFetch instantly detects the media and retrieves its information.",
  },
  {
    number: "02",
    title: "Preview & Choose",
    icon: <Eye size={22} />,
    description:
      "Preview the thumbnail, title, duration, and available formats, then choose your preferred quality and settings.",
  },
  {
    number: "03",
    title: "Add to Queue",
    icon: <Download size={22} />,
    description:
      "Start the download instantly or add it to the smart download queue with live progress, pause, and resume support.",
  },
];

export default function HowitsWork() {
  return (
    <section className="howItsWork">
      <div className="howItsWork__container">
        <div className="howItsWork__header">
          <div className="platformSection__label">
            <span className="uf-section-line"></span>
            <p>HOW IT WORKS</p>
          </div>

          <h2 className="howItsWork__title">
            Download media in three simple steps
          </h2>
        </div>

        <div className="howItsWork__steps">
          {steps.map((step, index) => (
            <div key={step.number} style={{ display: "contents" }}>
              <div className="howItsWork__card">
                <div className="howItsWork-combine">
                  <div className="howItsWork__number">{step.number}</div>

                  <div className="howItsWork__icon">{step.icon}</div>
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </div>

              {index !== steps.length - 1 && (
                <div className="howItsWork__arrow">
                  <ArrowRight size={30} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
