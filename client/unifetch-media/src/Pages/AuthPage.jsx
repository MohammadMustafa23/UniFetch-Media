import { useState } from "react";

import AuthLayout from "../Components/AuthFrontedPage/AuthLayout";

import "../Components/AuthFrontedPage/style/AuthPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  return <AuthLayout mode={mode} setMode={setMode} />;
}
