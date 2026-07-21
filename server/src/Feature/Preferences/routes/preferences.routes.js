import { Router } from "express";
import verifyJWT from "../../Auth/middleware/verifyJWT.js";

import {
  getPreferences,
  updatePreferences,
} from "../controller/preferences.controller.js";
import { preferenceUpdateLimiter } from "../helper/preferenceRateLimiter.js";
const PreferencesRouter = Router();

PreferencesRouter.get("/user/preferences", verifyJWT, getPreferences);

PreferencesRouter.patch(
  "/user/preferences",
  verifyJWT,
  preferenceUpdateLimiter,
  updatePreferences,
);
export default PreferencesRouter;
