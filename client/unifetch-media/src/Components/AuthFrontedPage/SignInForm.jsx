import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import SocialLogin from "./SocialLogin";
import "./style/SignForm.css";

export default function SignInForm({ setScreen }) {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors({
      email: newErrors.email || "",
      password: newErrors.password || "",
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Temporary API Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log(formData);

      // Later:
      // await loginUser(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="signin-form" onSubmit={handleSubmit} noValidate>
      {/* Email */}

      <div className="form-group">
        <label htmlFor="email">Email Address</label>

        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      {/* Password */}

      <div className="form-group">
        <div className="label-row">
          <label htmlFor="password">Password</label>

          <button
            type="button"
            className="forgot-btn"
            onClick={() => setScreen("forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        <div className="password-box">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
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

      {/* Button */}

      <button type="submit" className="signin-btn" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </button>

      {/* Divider */}

      <div className="divider">
        <span>OR</span>
      </div>

      {/* Social Login */}

      <SocialLogin />

      {/* Bottom */}

      <p className="bottom-text">
        Don't have an account?
        <button
          type="button"
          className="switch-btn"
          onClick={() => setScreen("signup")}
        >
          Create Account
        </button>
      </p>
    </form>
  );
}
