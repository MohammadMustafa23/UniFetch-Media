import "./style/HowitsWork.css";

import { ArrowRight, Link2, Eye, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Paste Link",
    icon: <Link2 size={22} />,
    description: "Paste any supported YouTube or Instagram link into UniFetch.",
  },
  {
    number: "02",
    title: "Preview",
    icon: <Eye size={22} />,
    description:
      "Instantly preview title, thumbnail and available download formats.",
  },
  {
    number: "03",
    title: "Download",
    icon: <Download size={22} />,
    description:
      "Choose your preferred quality and download your media in seconds.",
  },
];

export default function HowitsWork() {
  return (
    <section className="howItsWork">
      <div className="howItsWork__container">
        <div className="howItsWork__header">
          <div className="howItsWork__label">
            <span></span>
            <p>HOW IT WORKS</p>
          </div>

          <h2 className="howItsWork__title">
            From link to file in three steps
          </h2>
        </div>

        <div className="howItsWork__steps">
          {steps.map((step, index) => (
            <>
              <div className="howItsWork__card" key={step.number}>
                <div className="howItsWork__number">{step.number}</div>

                <div className="howItsWork__icon">{step.icon}</div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </div>

              {index !== steps.length - 1 && (
                <div className="howItsWork__arrow">
                  <ArrowRight size={30} />
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
