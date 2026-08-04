import "./style/Review.css";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Beta User",
    role: "Student",
    avatar: "BU",
    review:
      "The download queue is simple to use and pause & resume works smoothly.",
  },
  {
    name: "Beta User",
    role: "Content Creator",
    avatar: "BU",
    review:
      "Previewing media before downloading saves time and avoids unnecessary downloads.",
  },
  {
    name: "Beta User",
    role: "Developer",
    avatar: "BU",
    review:
      "The dashboard is clean, responsive, and makes managing downloads very easy.",
  },
  {
    name: "Beta User",
    role: "Video Editor",
    avatar: "BU",
    review:
      "Cloud storage support and download history make organizing files much easier.",
  },
  {
    name: "Beta User",
    role: "YouTube User",
    avatar: "BU",
    review:
      "Auto Paste detects copied links instantly and speeds up my workflow.",
  },
  {
    name: "Beta User",
    role: "Daily User",
    avatar: "BU",
    review:
      "A modern interface with fast downloads and an easy-to-use queue manager.",
  },
];

export default function Review() {
  return (
    <section className="reviewSection">
      <div className="reviewSection__container">
        {/* Header */}

        <div className="reviewSection__header">
          <div className="platformSection__label">
            <span className="uf-section-line"></span>
            <p>USER FEEDBACK</p>
          </div>

          <h2 className="reviewSection__title">
            Designed for a better download experience
          </h2>
        </div>

        {/* Slider */}

        <div className="reviewSlider">
          <div className="reviewTrack">
            {[...reviews, ...reviews].map((item, index) => (
              <div className="reviewCard" key={index}>
                <div className="reviewStars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#FFD54A" color="#FFD54A" />
                  ))}
                </div>

                <p className="reviewText">"{item.review}"</p>

                <div className="reviewUser">
                  <div className="reviewAvatar">{item.avatar}</div>

                  <div>
                    <h4>{item.name}</h4>

                    <span>{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
