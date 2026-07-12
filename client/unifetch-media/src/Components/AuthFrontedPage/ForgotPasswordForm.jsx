import { ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";
import "./style/ForgotPasswordForm.css";

export default function ForgotPasswordForm({ setScreen, setVerifyType }) {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
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

    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors({
      email: newErrors.email || "",
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

      setVerifyType("forgot-password");
      setScreen("verify-email");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="uf-forgot-form" onSubmit={handleSubmit} noValidate>
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
        <label htmlFor="email" className="uf-forgot-label">
          Email Address
        </label>

        <input
          id="email"
          type="email"
          name="email"
          className="uf-forgot-input"
          placeholder="Enter your email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      {/* Submit */}

      <button type="submit" className="uf-forgot-submit-btn" disabled={loading}>
        {loading ? "Sending..." : "Send Verification Code"}
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
