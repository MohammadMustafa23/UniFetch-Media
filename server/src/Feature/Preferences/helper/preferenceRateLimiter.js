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
   PREFERENCE RATE LIMITER
========================== */

export const preferenceUpdateLimiter = createLimiter(
  60 * 1000, // 1 Minute
  20,
  "Too many preference update requests. Please try again in a minute.",
);
