import { ArrowLeft, Mail } from "lucide-react";
import { useRef } from "react";
import "./style/VerifyEmailForm.css";

export default function VerifyEmailForm({ setScreen, verifyType }) {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    if (e.target.value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = () => {
    console.log("verifyType =", verifyType);
    if (verifyType === "forgot-password") {
      setScreen("reset-password");
    } else {
      setScreen("verify-success");
    }
  };

  return (
    <div className="uf-verify-form">
      <button
        type="button"
        className="uf-verify-back-btn"
        onClick={() =>
          setScreen(verifyType === "forgot-password" ? "forgot-password" : "signup")
        }
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="uf-verify-icon">
        <Mail size={34} />
      </div>

      <h2 className="uf-verify-title">Verify your email</h2>

      <p className="uf-verify-description">
        We've sent a 6-digit verification code to your email.
      </p>

      <div className="uf-verify-otp-container">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            className="uf-verify-otp-input"
            type="text"
            maxLength={1}
            onChange={(e) => handleChange(e, index)}
          />
        ))}
      </div>

      <button type="button" className="uf-verify-btn" onClick={handleVerify}>
        Verify Email
      </button>

      <p className="uf-verify-footer">
        Didn't receive the code?
        <button type="button" className="uf-verify-resend-btn">
          Resend
        </button>
      </p>
    </div>
  );
}
