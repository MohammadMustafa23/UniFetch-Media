import { useState } from "react";
import { LogIn } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageLoader from "../../common/PageLoader";
import { loginwithGoogle } from "../../service/auth.service.js";

export default function SocialLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async ({ code }) => {
      setLoading(true);

      try {

        const { data } = await loginwithGoogle({ code });
        localStorage.setItem("accessToken", data.accessToken);
        toast.success(`Welcome ${data.userName}!`);

        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message ||
            "Unable to sign in with Google."
        );
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      toast.error("Google sign-in cancelled.");
    },
  });

  return (
    <>
      {loading && <PageLoader text="Signing in with Google..." />}

      <div className="social-login">
        <button type="button" onClick={login} disabled={loading}>
          <LogIn size={18} />
          {loading ? "Signing In..." : "Continue with Google"}
        </button>
      </div>
    </>
  );
}