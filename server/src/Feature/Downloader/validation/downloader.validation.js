const allowedFields = ["url", "quality", "format"];

const allowedQualities = [
  "best",
  "2160",
  "1440",
  "1080",
  "720",
  "480",
  "360",
  "240",
  "144",
];

const allowedFormats = ["mp4", "webm", "mp3", "m4a"];

export function validateDownload(data) {
  // Empty Body
  if (!data || Object.keys(data).length === 0) {
    return {
      valid: false,
      message: "Request body is required.",
    };
  }

  // Unknown Fields
  const invalidFields = Object.keys(data).filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length) {
    return {
      valid: false,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    };
  }

  // URL Required
  if (!data.url) {
    return {
      valid: false,
      message: "URL is required.",
    };
  }

  // URL Type
  if (typeof data.url !== "string") {
    return {
      valid: false,
      message: "URL must be a string.",
    };
  }

  // Quality
  if (data.quality && !allowedQualities.includes(data.quality)) {
    return {
      valid: false,
      message: "Invalid quality selected.",
    };
  }

  // Format
  if (data.format && !allowedFormats.includes(data.format)) {
    return {
      valid: false,
      message: "Invalid format selected.",
    };
  }

  return {
    valid: true,
  };
}
