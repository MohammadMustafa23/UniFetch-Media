import "./ProfileCard.css";
import { User, Mail, Lock } from "lucide-react";

export default function ProfileCard({ profile}) {
  if (!profile) return null;
  return (
    <section className="profile-card">
      <h2>Profile</h2>

      {/* Full Name */}

      <div className="profile-field">
        <label>Full Name</label>

        <div className="profile-input">
          <User size={18} />

          <input
            type="text"
            value={profile.userName}
            onChange={(e) =>
              setProfile({
                ...profile,
                userName: e.target.value,
              })
            }
            readOnly
          />
        </div>
      </div>

      {/* Email */}

      <div className="profile-field">
        <label>Email</label>

        <div className="profile-input">
          <Mail size={18} />

          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({
                ...profile,
                email: e.target.value,
              })
            }
            readOnly
          />
        </div>
      </div>

      {/* Password */}

      <div className="profile-field">
        <label>Password</label>

        <div className="profile-input">
          <Lock size={18} />

          <input type="password" value="********" readOnly />
        </div>
      </div>
    </section>
  );
}
