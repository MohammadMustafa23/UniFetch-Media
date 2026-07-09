import { CheckCircle2, ArrowRight } from "lucide-react";
import "./style/VerifyEmailSuccess.css";

export default function ResetPasswordSuccess({ setScreen }) {
  return (
    <div className="verify-form success-form">
      <div className="success-icon">
        <CheckCircle2 size={65} />
      </div>

      <h2>Password Updated!</h2>

      <p>
        Your password has been changed successfully. You can now sign in using
        your new password.
      </p>

      <button
        type="button"
        className="verify-btn"
        onClick={() => setScreen("signin")}
      >
        Go to Sign In
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
