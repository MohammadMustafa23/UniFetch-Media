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
    <form className="forgot-form" onSubmit={handleSubmit}>
      <button
        type="button"
        className="back-btn"
        onClick={() => setScreen("signin")}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="verify-icon">
        <Lock size={34} />
      </div>

      <h2>Forgot Password</h2>

      <p>
        No worries! Enter your email address and we'll send you a verification
        code to reset your password.
      </p>

      <div className="form-group">
        <label>Email Address</label>

        <input type="email" placeholder="Enter your email" required />
      </div>

      <button type="submit" className="verify-btn">
        Send Verification Code
      </button>

      <div className="divider">
        <span>OR</span>
      </div>

      <p className="bottom-text">
        Remember your password?
        <button
          type="button"
          className="switch-btn"
          onClick={() => setScreen("signin")}
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
