import { findPreferencesByUserId,updatePreferencesByUserId } from "../helper/references.repository.js";

export async function getUserPreferences(userId) {
  return await findPreferencesByUserId(userId);
}

export async function updateUserPreferences(userId, updateData) {
  return await updatePreferencesByUserId(userId, updateData);
}
