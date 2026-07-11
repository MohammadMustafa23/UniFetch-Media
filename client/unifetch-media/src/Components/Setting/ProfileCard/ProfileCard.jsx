import "./ProfileCard.css";
import { User, Mail, Lock } from "lucide-react";

export default function ProfileCard() {
  return (
    <section className="profile-card">
      <h2>Profile</h2>

      {/* Full Name */}

      <div className="profile-field">
        <label>Full Name</label>

        <div className="profile-input">
          <User size={18} />

          <input type="text" defaultValue="Mohammad Mustafa" />
        </div>
      </div>

      {/* Email */}

      <div className="profile-field">
        <label>Email</label>

        <div className="profile-input">
          <Mail size={18} />

          <input type="email" defaultValue="mustafa@email.com" />
        </div>
      </div>

      {/* Password */}

      <div className="profile-field">
        <label>Password</label>

        <div className="profile-input">
          <Lock size={18} />

          <input type="password" defaultValue="123456789" />
        </div>
      </div>

      <button className="profile-save-btn">Save Changes</button>
    </section>
  );
}
