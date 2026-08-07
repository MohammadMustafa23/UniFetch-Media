import transporter from "../../../config/mail.js";
import { EMAIL_USER } from "../../../config/env.js";

const sendOTPEmail = async (email, otp) => {
  console.log("📧 1. sendOTPEmail() called");
  console.log("📧 2. Sending to:", email);

  try {
    console.log("📧 3. Before transporter.sendMail()");

    const info = await transporter.sendMail({
      from: `"UniFetch Media" <${EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",

      html: `
        <div style="font-family:Arial,sans-serif;padding:30px">
          <h2>Welcome to UniFetch Media</h2>

          <p>Your verification code is:</p>

          <h1 style="font-size:40px;letter-spacing:8px;color:#2563EB;">
            ${otp}
          </h1>

          <p>This code will expire in <strong>5 minute</strong>.</p>

          <p>If you didn't request this account, you can safely ignore this email.</p>

          <br/>

          <p>— UniFetch Media Team</p>
        </div>
      `,
    });

    console.log("📧 4. transporter.sendMail() completed");
    console.log("📧 Message ID:", info.messageId);
    console.log("📧 Response:", info.response);
  } catch (error) {
    console.error("❌ transporter.sendMail() failed");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
    console.error("Response Code:", error.responseCode);

    throw error;
  }
};

export default sendOTPEmail;
