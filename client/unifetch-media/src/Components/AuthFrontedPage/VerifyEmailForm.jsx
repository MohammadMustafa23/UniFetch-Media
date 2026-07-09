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
    <div className="verify-form">
      {/* Back */}

      <button
        type="button"
        className="back-btn"
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

      <div className="verify-icon">
        <Mail size={34} />
      </div>

      {/* Heading */}

      <h2>Verify your email</h2>

      <p>We've sent a 6-digit verification code to your email.</p>

      {/* OTP */}

      <div className="otp-container">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            type="text"
            maxLength={1}
            onChange={(e) => handleChange(e, index)}
          />
        ))}
      </div>

      {/* Verify */}

      <button type="button" className="verify-btn" onClick={handleVerify}>
        Verify Email
      </button>

      {/* Footer */}

      <p className="bottom-text">
        Didn't receive the code?
        <button type="button" className="switch-btn">
          Resend
        </button>
      </p>
    </div>
  );
}
