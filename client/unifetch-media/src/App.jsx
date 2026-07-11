import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HeroPageCTA from "./Pages/HeroPageCTA";
import AuthPage from "./Pages/AuthPage";

import Dashboard from "./Pages/Dashboard";
// import Downloads from "./Pages/Downloads/Downloads";
import Queue from "./Components/Queue/Queue";
import History from "./Components/History/History";
// import Favorites from "./Pages/Favorites/Favorites";
// import Analytics from "./Pages/Analytics/Analytics";
// import Storage from "./Pages/Storage/Storage";
// import Automation from "./Pages/Automation/Automation";
// import Settings from "./Pages/Settings/Settings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HeroPageCTA />} />
        <Route path="/authantication-page" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/downloads" element={<Downloads />} /> */}
        <Route path="/queue" element={<Queue />} />
        <Route path="/history" element={<History />}/>
        {/* <Route path="/favorites" element={<Favorites />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/automation" element={<Automation />} />
        <Route path="/settings" element={<Settings />} />  */}
      </Routes>
    </>
  );
}

export default App;
