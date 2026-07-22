import {
  getUserPreferences,
  updateUserPreferences,
} from "../service/preferences.service.js";

// GET /api/preferences
export async function getPreferences(req, res) {
  try {
    const preferences = await getUserPreferences(req.user._id);

    res.status(200).json({
      success: true,
      message: "Preferences fetched successfully.",
      data: preferences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// PATCH /api/preferences
export async function updatePreferences(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No preferences provided to update.",
      });
    }

    // Allowed preference sections
    const allowedFields = ["autodownload", "storage", "quality"];
    const requestFields = Object.keys(req.body);
    const invalidFields = requestFields.filter(
      (field) => !allowedFields.includes(field.toLowerCase())
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
      });
    }

    const preferences = await updateUserPreferences(
      req.user._id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully.",
      data: preferences,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update preferences.",
    });
  }
}