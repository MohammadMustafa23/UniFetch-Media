import { LogIn } from "lucide-react";

export default function SocialLogin() {
  return (
    <div className="social-login">
      <button type="button">
        <LogIn size={18} />
        Continue with Google
      </button>
    </div>
  );
}
