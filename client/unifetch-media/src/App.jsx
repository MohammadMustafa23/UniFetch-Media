import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HeroPageCTA from "./Pages/HeroPageCTA";
import AuthPage from "./Pages/AuthPage";
import { Toaster } from "sonner";
import Dashboard from "./Pages/Dashboard";
import Downloads from "./Components/Downloads/Downloads";
import Queue from "./Components/Queue/Queue";
import History from "./Components/History/History";
import Favorites from "./Components/Favorites/Favorites";
import Analytics from "./Components/Analytics/Analytics";
import Storage from "./Components/Storage/Storage";
import Settings from "./Components/Setting/ProfileSettings";

function App() {
  return (
    <>
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        closeButton
        expand
        visibleToasts={3}
        toastOptions={{
          duration: 3000,
        }}
      />
      <Routes>
        <Route path="/" element={<HeroPageCTA />} />
        <Route path="/authantication-page" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/history" element={<History />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App;
