import { useEffect, useState } from "react";
import "./ProfileCard.css";
import { User, Mail, Lock } from "lucide-react";
import { getprofile } from "../../../service/auth.service";
import { toast } from "sonner";

export default function ProfileCard() {
  const [profile, setProfile] = useState({
    userName: "",
    email: "",
    password: "********",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await getprofile();

      if (data.success) {
        setProfile({
          userName: data.user.userName,
          email: data.user.email,
          password: "********",
        });
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
            readOnly
          />
        </div>
      </div>

      {/* Password */}

      <div className="profile-field">
        <label>Password</label>

        <div className="profile-input">
          <Lock size={18} />

          <input
            type="password"
            value={profile.password}
            readOnly
          />
        </div>
      </div>

      <button className="profile-save-btn">
        Save Changes
      </button>
    </section>
  );
}