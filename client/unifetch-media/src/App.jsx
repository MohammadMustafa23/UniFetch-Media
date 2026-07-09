import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import HeroPageCTA from "./Pages/HeroPageCTA";
import AuthPage from "./Pages/AuthPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HeroPageCTA />} />
        <Route path="/authantication-page" element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default App;
