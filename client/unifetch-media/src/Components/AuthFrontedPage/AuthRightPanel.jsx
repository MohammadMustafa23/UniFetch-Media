import { useState } from "react";

import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import VerifyEmailForm from "./VerifyEmailForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordSuccess from "./ResetPasswordSuccess.jsx";
import ResetPasswordForm from "./ResetPasswordForm";
export default function AuthRightPanel() {
  const [screen, setScreen] = useState("signin");
  const [verifyType, setVerifyType] = useState("");

  return (
    <section className="auth-right">
      <div className="auth-container">
        {/* Hide header on success page */}
        {screen !== "verify-success" && (
          <>
            <div className="auth-header">
              <span className="badge">
                {screen === "signin"
                  ? "Welcome Back"
                  : screen === "signup"
                    ? "Create Account"
                    : screen === "verify-email"
                      ? "Verify Email"
                      : screen === "forgot-password"
                        ? "Password Recovery"
                        : "Reset Password"}
              </span>

              <h2>
                {screen === "signin" && "Continue your media workflow"}

                {screen === "signup" && "Create your UniFetch account"}

                {screen === "verify-email" && "Verify your email"}

                {screen === "forgot-password" && "Forgot your password?"}

                {screen === "reset-password" && "Create a new password"}
              </h2>

              <p>
                {screen === "signin" &&
                  "Sign in to manage downloads, sync your queue, and access every feature."}

                {screen === "signup" &&
                  "Create an account to securely manage your downloads."}

                {screen === "verify-email" &&
                  "Enter the 6-digit verification code sent to your email."}

                {screen === "forgot-password" &&
                  "Enter your registered email address to receive a verification code."}

                {screen === "reset-password" &&
                  "Choose a strong password to secure your account."}
              </p>
            </div>

            {(screen === "signin" || screen === "signup") && (
              <div className="auth-tabs">
                <button
                  className={screen === "signin" ? "active" : ""}
                  onClick={() => setScreen("signin")}
                >
                  Sign In
                </button>

                <button
                  className={screen === "signup" ? "active" : ""}
                  onClick={() => setScreen("signup")}
                >
                  Create Account
                </button>
              </div>
            )}
          </>
        )}

        {/* Screens */}

        {screen === "signin" && <SignInForm setScreen={setScreen} />}

        {screen === "signup" && (
          <SignUpForm setScreen={setScreen} setVerifyType={setVerifyType} />
        )}

        {screen === "verify-email" && (
          <VerifyEmailForm setScreen={setScreen} verifyType={verifyType} />
        )}

        {screen === "verify-success" && (
          <VerifyEmailSuccess setScreen={setScreen} />
        )}

        {screen === "forgot-password" && (
          <ForgotPasswordForm
            setScreen={setScreen}
            setVerifyType={setVerifyType}
          />
        )}
        {screen === "reset-password" && (
          <ResetPasswordForm setScreen={setScreen} />
        )}
        {screen === "reset-success" && (
          <ResetPasswordSuccess setScreen={setScreen} />
        )}
      </div>
    </section>
  );
}
