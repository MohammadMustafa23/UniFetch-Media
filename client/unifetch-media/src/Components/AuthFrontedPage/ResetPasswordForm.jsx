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
    <form className="reset-form" onSubmit={handleSubmit}>
      {/* Back */}

      <button
        type="button"
        className="back-btn"
        onClick={() => setScreen("forgot-password")}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Icon */}

      <div className="verify-icon">
        <LockKeyhole size={34} />
      </div>

      {/* Heading */}

      <h2>Create New Password</h2>

      <p>Your new password must be different from your previous password.</p>

      {/* Password */}

      <div className="form-group">
        <label>New Password</label>

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm */}

      <div className="form-group">
        <label>Confirm Password</label>

        <div className="password-box">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Button */}

      <button type="submit" className="verify-btn">
        Update Password
      </button>

      {/* Bottom */}

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
