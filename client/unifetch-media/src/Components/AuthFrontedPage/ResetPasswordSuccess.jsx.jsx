import { CheckCircle2, ArrowRight } from "lucide-react";
import "./style/VerifyEmailSuccess.css";

export default function ResetPasswordSuccess({ setScreen }) {
  return (
    <div className="uf-reset-success">
      {/* Success Icon */}

      <div className="uf-reset-success-icon">
        <CheckCircle2 size={60} />
      </div>

      {/* Badge */}

      <span className="uf-reset-success-badge">Password Updated</span>

      {/* Title */}

      <h2 className="uf-reset-success-title">Password Updated Successfully!</h2>

      {/* Description */}

      <p className="uf-reset-success-description">
        Your password has been changed successfully. You can now sign in using
        your new password.
      </p>

      {/* Button */}

      <button
        type="button"
        className="uf-reset-success-btn"
        onClick={() => setScreen("signin")}
      >
        Go to Sign In
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
