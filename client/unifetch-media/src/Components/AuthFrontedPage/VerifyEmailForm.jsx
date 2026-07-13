import {
  ArrowLeft,
  Mail,
  Clock3,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import "./style/VerifyEmailForm.css";
import { toast } from "sonner";
import { verifyOTP, resendOTP } from "../../service/auth.service";

export default function VerifyEmailForm({ setScreen, verifyType, email }) {
  const inputs = useRef([]);
  const OTP_LENGTH = 6;
  const OTP_EXPIRE_TIME = 60;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [timer, setTimer] = useState(OTP_EXPIRE_TIME);

  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0",
    )}:${String(secs).padStart(2, "0")}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1);

    const updatedOTP = [...otp];

    updatedOTP[index] = value;

    setOtp(updatedOTP);

    if (error) setError("");

    if (value && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  /* ==========================================
     KEYBOARD EVENTS
  ========================================== */

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updatedOTP = [...otp];

        updatedOTP[index] = "";

        setOtp(updatedOTP);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  /* ==========================================
     PASTE OTP
  ========================================== */

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedOTP = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedOTP) return;

    const updatedOTP = Array(OTP_LENGTH).fill("");

    pastedOTP.split("").forEach((digit, index) => {
      updatedOTP[index] = digit;
    });

    setOtp(updatedOTP);

    setError("");

    inputs.current[Math.min(pastedOTP.length - 1, OTP_LENGTH - 1)]?.focus();
  };
  /* ==========================================
     VERIFY OTP
  ========================================== */

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await verifyOTP({
        email,
        otp: code,
      });

      if (data.success) {
        if (verifyType === "forgot-password") {
          setScreen("reset-password");
        } else {
          setScreen("verify-success");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      setError("");

      const { data } = await resendOTP({ email });

      if (data.success) {
        // Clear OTP inputs
        setOtp(Array(6).fill(""));

        // Restart timer
        setTimer(OTP_EXPIRE_TIME); // 60
        setCanResend(false);

        // Focus first input
        inputs.current[0]?.focus();

        // Success Toast
        toast.success("OTP resent successfully.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend OTP.");
    }
  };

  /* ==========================================
     JSX
  ========================================== */

  return (
    <div className="uf-verify-form">
      <button
        type="button"
        className="uf-verify-back-btn"
        onClick={() =>
          setScreen(
            verifyType === "forgot-password" ? "forgot-password" : "signup",
          )
        }
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="uf-verify-icon">
        <Mail size={34} />
      </div>

      <h2 className="uf-verify-title">Verify your email</h2>

      <p className="uf-verify-description">
        We've sent a 6-digit verification code to
      </p>

      <div className="uf-verify-email">{email}</div>

      <div className="uf-verify-timer">
        <div className="uf-verify-timer-left">
          <Clock3 size={18} />

          <span className="uf-verify-timer-label">Code expires in</span>
        </div>

        <span className="uf-verify-time">{formatTime(timer)}</span>
      </div>

      <div className="uf-verify-otp-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            className="uf-verify-otp-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            disabled={loading}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
          />
        ))}
      </div>

      {error && (
        <div className="uf-verify-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <button
        type="button"
        className="uf-verify-btn"
        disabled={loading}
        onClick={handleVerify}
      >
        {loading ? (
          <>
            <LoaderCircle size={18} className="spin" />
            Verifying...
          </>
        ) : (
          "Verify Email"
        )}
      </button>

      <div className="uf-verify-footer">
        {canResend ? (
          <>
            <span>Didn't receive the code?</span>

            <button
              type="button"
              className="uf-verify-resend-btn"
              onClick={handleResend}
            >
              Resend Code
            </button>
          </>
        ) : (
          <>
            <span>Resend available in</span>

            <strong>{formatTime(timer)}</strong>
          </>
        )}
      </div>
    </div>
  );
}
