import "./style/Review.css";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Rhea K.",
    role: "Video Editor",
    avatar: "RK",
    review:
      "Auto Paste alone saved me hours every week. The queue handles everything while I keep working.",
  },
  {
    name: "Daniel M.",
    role: "Podcast Producer",
    avatar: "DM",
    review:
      "Resume support is the feature I didn't know I needed. Downloads never fail anymore.",
  },
  {
    name: "Ana S.",
    role: "Content Researcher",
    avatar: "AS",
    review:
      "Clean interface, blazing fast downloads and the history panel is incredibly useful.",
  },
  {
    name: "Rahul P.",
    role: "Student",
    avatar: "RP",
    review:
      "Downloading YouTube lectures has never been easier. Everything feels instant.",
  },
  {
    name: "Sarah W.",
    role: "Creator",
    avatar: "SW",
    review:
      "The UI is beautiful and the download queue feels like a real desktop application.",
  },
  {
    name: "James L.",
    role: "Filmmaker",
    avatar: "JL",
    review:
      "Batch downloading and resume support are game changers for large media projects.",
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
            <p>WHAT PEOPLE SAY</p>
          </div>
        

          <h2 className="reviewSection__title">
            Built for people who fetch media often
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
