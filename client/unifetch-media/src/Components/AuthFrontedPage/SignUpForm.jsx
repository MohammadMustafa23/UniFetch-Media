import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "./style/SignForm.css";
import SocialLogin from "./SocialLogin";

export default function SignUpForm({ setScreen, setVerifyType }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Please accept the Terms & Conditions.";
    }

    setErrors({
      fullName: newErrors.fullName || "",
      email: newErrors.email || "",
      password: newErrors.password || "",
      confirmPassword: newErrors.confirmPassword || "",
      acceptTerms: newErrors.acceptTerms || "",
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Fake API

      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log(formData);

      setVerifyType("signup");
      setScreen("verify-email");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit} noValidate>
      {/* Name */}

      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>

        <input
          id="fullName"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          autoComplete="name"
          required
        />

        {errors.fullName && (
          <span className="error-text">{errors.fullName}</span>
        )}
      </div>

      {/* Email */}

      <div className="form-group">
        <label htmlFor="email">Email Address</label>

        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      {/* Password */}

      <div className="form-group">
        <label htmlFor="password">Password</label>

        <div className="password-box">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button
            type="button"
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

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>

        <div className="password-box">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button
            type="button"
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

      {/* Terms */}

      <div className="remember-row">
        <label>
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
          />
          I agree to the Terms &amp; Conditions and Privacy Policy
        </label>
      </div>

      {errors.acceptTerms && (
        <span className="error-text">{errors.acceptTerms}</span>
      )}

      {/* Button */}

      <button type="submit" className="signup-btn" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Divider */}

      <div className="divider">
        <span>OR</span>
      </div>

      {/* Social Login */}

      <SocialLogin />

      {/* Bottom */}

      <p className="bottom-text">
        Already have an account?
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
