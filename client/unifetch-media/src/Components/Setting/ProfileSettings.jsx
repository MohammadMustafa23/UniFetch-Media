import { useEffect, useState } from "react";
import { toast } from "sonner";

import "../Dashboard/style/Dashboard.css";
import "./ProfileSettings.css";

import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Topbar from "../Dashboard/Topbar/Topbar";
import Footer from "../Dashboard/Footer/Footer";

import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileCard from "./ProfileCard/ProfileCard";
import Preferences from "./PreferencesPanel/Preferences";

import PageLoader from "../../common/PageLoader";

import { getCurrentUser } from "../../service/auth.service";

import {
  getPreferences,
  updatePreferences,
} from "../../service/preferences.service";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [profileRes, preferencesRes] = await Promise.all([
        getCurrentUser(),
        getPreferences(),
      ]);

      
      if (profileRes.data.success) {
        setProfile(profileRes.data.user);
      }

      console.log(preferencesRes.data);
      
      if (preferencesRes.data.success) {
        setPreferences(preferencesRes.data.data);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to load profile settings.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
  try {
    setSaving(true);

    const payload = {
      appearance: preferences.appearance,
      download: preferences.download,
      privacy: preferences.privacy,
    };

    const { data } = await updatePreferences(payload);

    if (data.success) {
      setPreferences(data.data);

      toast.success(data.message);
    }
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to update preferences."
    );
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <PageLoader
        title="Loading Profile"
        message="Fetching your account preferences..."
      />
    );
  }

  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <section className="profile-page">
          <ProfileHeader />

          <div className="profile-grid">
            <ProfileCard profile={profile} />

            <Preferences
              preferences={preferences}
              setPreferences={setPreferences}
              onSave={handleSaveChanges}
              saving={saving}
            />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
