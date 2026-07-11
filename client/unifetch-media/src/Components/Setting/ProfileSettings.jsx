import "../Dashboard/style/Dashboard.css";
import "./ProfileSettings.css";

import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Topbar from "../Dashboard/Topbar/Topbar";
import Footer from "../Dashboard/Footer/Footer";

import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileCard from "./ProfileCard/ProfileCard";
import Preferences from "./PreferencesPanel/Preferences";

// import { useGSAP } from "@gsap/react";
// import ProfileSettingsAnimation from "../../Animation/ProfileSettingsAnimation";

export default function ProfileSettings() {
  // useGSAP(() => {
  //   return ProfileSettingsAnimation();
  // });

  return (
    <div className="ufm-dashboard">
      <Sidebar />

      <main className="ufm-dashboard-main">
        <Topbar />

        <section className="profile-page">
          <ProfileHeader />

          <div className="profile-grid">
            <ProfileCard />

            <Preferences />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
