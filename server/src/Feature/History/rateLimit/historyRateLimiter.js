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
   HISTORY RATE LIMITERS
========================== */

export const historyWriteLimiter = createLimiter(
  60 * 1000, // 1 Minute
  30,
  "Too many history actions. Please slow down.",
);

export const historyDownloadLimiter = createLimiter(
  60 * 1000, // 1 Minute
  10,
  "Too many download requests from history. Please wait a moment.",
);
