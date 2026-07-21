import rateLimit from "express-rate-limit";

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });

/* ==========================
   NOTIFICATION RATE LIMITER
========================== */

export const notificationActionLimiter = createLimiter(
  60 * 1000, // 1 Minute
  30,
  "Too many notification requests. Please try again in a minute.",
);
