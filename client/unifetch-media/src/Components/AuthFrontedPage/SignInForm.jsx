import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import SocialLogin from "./SocialLogin";
import "./style/SignForm.css";

export default function SignInForm({ setScreen }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Login API

    // Temporary
    alert("Login Successful!");

    // Later
    // navigate("/dashboard");
  };

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      {/* Email */}

      <div className="form-group">
        <label>Email Address</label>

        <input type="email" placeholder="Enter your email" required />
      </div>

      {/* Password */}

      <div className="form-group">
        <div className="label-row">
          <label>Password</label>

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
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Remember */}

      <div className="remember-row">
        <label>
          <input type="checkbox" />
          Remember me
        </label>
      </div>

      {/* Button */}

      <button type="submit" className="signin-btn">
        Sign In
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
