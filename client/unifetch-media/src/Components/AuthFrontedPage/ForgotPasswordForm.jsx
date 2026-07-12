import { ArrowLeft, Lock } from "lucide-react";
import "./style/ForgotPasswordForm.css";

export default function ForgotPasswordForm({ setScreen, setVerifyType }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Send Reset OTP API

    setVerifyType("forgot-password");

    setScreen("verify-email");
  };

  return (
    <form className="uf-forgot-form" onSubmit={handleSubmit}>
      {/* Back */}

      <button
        type="button"
        className="uf-forgot-back-btn"
        onClick={() => setScreen("signin")}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Icon */}

      <div className="uf-forgot-icon">
        <Lock size={34} />
      </div>

      {/* Heading */}

      <h2 className="uf-forgot-title">Forgot Password</h2>

      <p className="uf-forgot-description">
        No worries! Enter your email address and we'll send you a verification
        code to reset your password.
      </p>

      {/* Email */}

      <div className="uf-forgot-group">
        <label className="uf-forgot-label">Email Address</label>

        <input
          type="email"
          placeholder="Enter your email"
          className="uf-forgot-input"
          required
        />
      </div>

      {/* Submit */}

      <button type="submit" className="uf-forgot-submit-btn">
        Send Verification Code
      </button>

      {/* Divider */}

      <div className="uf-forgot-divider">
        <span>OR</span>
      </div>

      {/* Footer */}

      <p className="uf-forgot-footer">
        Remember your password?
        <button
          type="button"
          className="uf-forgot-signin-btn"
          onClick={() => setScreen("signin")}
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
