import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import "./style/ResetPasswordForm.css";

export default function ResetPasswordForm({ setScreen }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  /* ===============================
      Handle Change
  =============================== */

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ===============================
      Validation
  =============================== */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "New password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors({
      password: newErrors.password || "",
      confirmPassword: newErrors.confirmPassword || "",
    });

    return Object.keys(newErrors).length === 0;
  };

  /* ===============================
      Submit
  =============================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Temporary API Delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log(formData);

      // Later:
      // await resetPassword(formData);

      setScreen("reset-success");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="uf-reset-form" onSubmit={handleSubmit} noValidate>
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

      {/* New Password */}

      <div className="uf-reset-group">
        <label htmlFor="password" className="uf-reset-label">
          New Password
        </label>

        <div className="uf-reset-password-box">
          <input
            id="password"
            className="uf-reset-input"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter new password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="uf-reset-toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={loading}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password && (
          <span className="error-text">{errors.password}</span>
        )}
      </div>

      {/* Confirm Password */}

      <div className="uf-reset-group">
        <label htmlFor="confirmPassword" className="uf-reset-label">
          Confirm Password
        </label>

        <div className="uf-reset-password-box">
          <input
            id="confirmPassword"
            className="uf-reset-input"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="uf-reset-toggle-btn"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            disabled={loading}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.confirmPassword && (
          <span className="error-text">{errors.confirmPassword}</span>
        )}
      </div>

      {/* Submit */}

      <button type="submit" className="uf-reset-submit-btn" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
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
