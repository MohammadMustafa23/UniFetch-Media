import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "./style/SignForm.css";
import SocialLogin from "./SocialLogin";

export default function SignUpForm({ setScreen, setVerifyType }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Call Signup API here

    setVerifyType("signup");

    setScreen("verify-email");
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      {/* Name */}

      <div className="form-group">
        <label>Full Name</label>

        <input type="text" placeholder="Enter your full name" />
      </div>

      {/* Email */}

      <div className="form-group">
        <label>Email Address</label>

        <input type="email" placeholder="Enter your email" />
      </div>

      {/* Password */}

      <div className="form-group">
        <label>Password</label>

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}

      <div className="form-group">
        <label>Confirm Password</label>

        <div className="password-box">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Terms */}

      <div className="remember-row">
        <label>
          <input type="checkbox" />I agree to the Terms & Conditions and Privacy
          Policy
        </label>
      </div>

      {/* Button */}

      <button type="submit" className="signup-btn">
        Create Account
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
