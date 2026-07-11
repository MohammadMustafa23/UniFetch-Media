import { gsap } from "gsap";

const QueueAnimation = () => {
  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  tl.from(".queue-header", {
    y: -30,
    opacity: 0,
    duration: 0.6,
  })

    .from(
      ".queue-add-btn",
      {
        x: 40,
        opacity: 0,
        duration: 0.45,
      },
      "-=0.35"
    )

    .from(
      ".queue-list",
      {
        y: 35,
        opacity: 0,
        duration: 0.55,
      },
      "-=0.2"
    )

    .from(
      ".queue-item",
      {
        y: 25,
        opacity: 0,
        stagger: 0.12,
        duration: 0.4,
      },
      "-=0.3"
    )

    .from(
      ".queue-status",
      {
        scale: 0.8,
        opacity: 0,
        stagger: 0.08,
        duration: 0.3,
      },
      "-=0.25"
    )

    .from(
      ".queue-actions button",
      {
        scale: 0,
        opacity: 0,
        stagger: 0.04,
        duration: 0.25,
      },
      "-=0.25"
    );

  gsap.from(".queue-progress-fill", {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 1,
    ease: "power2.out",
    delay: 0.8,
  });

  const cards = gsap.utils.toArray(".queue-item");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -5,
        duration: 0.25,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        duration: 0.25,
      });
    });
  });

  return () => tl.kill();
};

export default QueueAnimation;