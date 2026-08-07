import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "./env.js";

console.log("📧 ===== MAIL CONFIG =====");
console.log("📧 EMAIL_USER:", EMAIL_USER);
console.log("📧 EMAIL_PASS exists:", !!EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify SMTP connection
(async () => {
  console.log("📧 Starting SMTP verification...");

  try {
    const success = await transporter.verify();

    console.log("✅ SMTP Verify Success");
    console.log(success);
  } catch (error) {
    console.error("❌ SMTP Verify Failed");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
    console.error("Response Code:", error.responseCode);
  }
})();

export default transporter;