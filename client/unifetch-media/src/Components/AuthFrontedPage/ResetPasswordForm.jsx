import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import "./style/ResetPasswordForm.css";

export default function ResetPasswordForm({ setScreen }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Reset Password API

    setScreen("reset-success");
  };

  return (
    <form className="uf-reset-form" onSubmit={handleSubmit}>
      {/* Back */}

      <button
        type="button"
        className="uf-reset-back-btn"
        onClick={() => setScreen("forgot-password")}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Icon */}

      <div className="uf-reset-icon">
        <LockKeyhole size={34} />
      </div>

      {/* Heading */}

      <h2 className="uf-reset-title">Create New Password</h2>

      <p className="uf-reset-description">
        Your new password must be different from your previous password.
      </p>

      {/* Password */}

      <div className="uf-reset-group">
        <label className="uf-reset-label">New Password</label>

        <div className="uf-reset-password-box">
          <input
            className="uf-reset-input"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
          />

          <button
            type="button"
            className="uf-reset-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}

      <div className="uf-reset-group">
        <label className="uf-reset-label">Confirm Password</label>

        <div className="uf-reset-password-box">
          <input
            className="uf-reset-input"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
          />

          <button
            type="button"
            className="uf-reset-toggle-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit */}

      <button type="submit" className="uf-reset-submit-btn">
        Update Password
      </button>

      {/* Footer */}

      <p className="uf-reset-footer">
        Remember your password?
        <button
          type="button"
          className="uf-reset-signin-btn"
          onClick={() => setScreen("signin")}
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
