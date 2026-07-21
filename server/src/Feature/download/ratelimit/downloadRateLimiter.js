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

export const downloadLimiter = createLimiter(
  60 * 1000,
  10,
  "Too many download requests. Please wait a moment.",
);

export const queueActionLimiter = createLimiter(
  60 * 1000,
  30,
  "Too many queue actions. Please slow down.",
);

export const downloadInfoLimiter = createLimiter(
  60 * 1000, // 1 Minute
  20,
  "Too many video info requests. Please try again in a minute."
);