import UserPreference from "../models/preferences.model.js";

export async function findPreferencesByUserId(userId) {
  return await UserPreference.findOne({ userId });
}

export async function updatePreferencesByUserId(userId, updateData) {
  return await UserPreference.findOneAndUpdate({ userId }, updateData, {
    new: true,
    runValidators: true,
  });
}
