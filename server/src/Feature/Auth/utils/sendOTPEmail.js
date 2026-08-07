import resend from "../../../config/resend.js";

const sendOTPEmail = async (email, otp) => {
  try {
    console.log("📧 Sending email via Resend...");
    console.log("📧 To:", email);

    const { data, error } = await resend.emails.send({
      from: "UniFetch Media <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family:Arial,sans-serif;padding:30px">
          <h2>Welcome to UniFetch Media</h2>

          <p>Your verification code is:</p>

          <h1 style="font-size:40px;letter-spacing:8px;color:#2563EB;">
            ${otp}
          </h1>

          <p>This code will expire in <strong>5 minutes</strong>.</p>

          <p>If you didn't request this account, you can safely ignore this email.</p>

          <br/>

          <p>— UniFetch Media Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      throw new Error(error.message);
    }

    console.log("✅ Email sent successfully!");
    console.log("📧 Response:", data);

  } catch (err) {
    console.error("❌ Failed to send email");
    console.error(err);
    throw err;
  }
};

export default sendOTPEmail;