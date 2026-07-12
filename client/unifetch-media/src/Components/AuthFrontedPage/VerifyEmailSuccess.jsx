import { CheckCircle2, ArrowRight } from "lucide-react";
import "./style/VerifyEmailSuccess.css";

export default function VerifyEmailSuccess({ setScreen }) {
  return (
    <div className="uf-success">
      {/* Success Icon */}

      <div className="uf-success-icon">
        <CheckCircle2 size={58} />
      </div>

      {/* Content */}

      <span className="uf-success-badge">Email Verified</span>

      <h2 className="uf-success-title">Verification Successful</h2>

      <p className="uf-success-description">
        Your email has been verified successfully. You can now access your
        UniFetch account and start managing your downloads.
      </p>

      {/* Button */}

      <button className="uf-success-btn" onClick={() => setScreen("signin")}>
        Continue to Sign In
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
