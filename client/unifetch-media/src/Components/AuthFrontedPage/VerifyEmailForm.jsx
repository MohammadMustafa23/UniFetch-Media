import { ArrowLeft, Mail } from "lucide-react";
import { useRef, useState } from "react";
import "./style/VerifyEmailForm.css";

export default function VerifyEmailForm({ setScreen, verifyType }) {
  const inputs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===============================
      OTP Change
  =============================== */

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    const updatedOTP = [...otp];
    updatedOTP[index] = value;
    setOtp(updatedOTP);

    setError("");

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  /* ===============================
      Backspace
  =============================== */

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updatedOTP = [...otp];
        updatedOTP[index] = "";
        setOtp(updatedOTP);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  /* ===============================
      Paste OTP
  =============================== */

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedOTP = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedOTP) return;

    const updatedOTP = [...otp];

    pastedOTP.split("").forEach((digit, index) => {
      updatedOTP[index] = digit;
    });

    setOtp(updatedOTP);

    const focusIndex = Math.min(pastedOTP.length - 1, 5);
    inputs.current[focusIndex]?.focus();

    setError("");
  };

  /* ===============================
      Verify
  =============================== */

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      // Temporary API Delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("OTP :", code);
      console.log("Type :", verifyType);

      if (verifyType === "forgot-password") {
        setScreen("reset-password");
      } else {
        setScreen("verify-success");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uf-verify-form">
      {/* Back */}

      <button
        type="button"
        className="uf-verify-back-btn"
        onClick={() =>
          setScreen(
            verifyType === "forgot-password" ? "forgot-password" : "signup",
          )
        }
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Icon */}

      <div className="uf-verify-icon">
        <Mail size={34} />
      </div>

      {/* Title */}

      <h2 className="uf-verify-title">Verify your email</h2>

      <p className="uf-verify-description">
        We've sent a 6-digit verification code to your email.
      </p>

      {/* OTP */}

      <div className="uf-verify-otp-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            className="uf-verify-otp-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
          />
        ))}
      </div>

      {/* Error */}

      {error && <span className="error-text">{error}</span>}

      {/* Verify Button */}

      <button
        type="button"
        className="uf-verify-btn"
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      {/* Footer */}

      <p className="uf-verify-footer">
        Didn't receive the code?
        <button type="button" className="uf-verify-resend-btn">
          Resend
        </button>
      </p>
    </div>
  );
}
