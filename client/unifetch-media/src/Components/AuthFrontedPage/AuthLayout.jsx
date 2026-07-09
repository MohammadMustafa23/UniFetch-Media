import AuthLeftPanel from "./AuthLeftPanel";
import AuthRightPanel from "./AuthRightPanel";

import "./style/AuthPage.css";
import './style/AuthLeftPanel.css'
import './style/AuthRightPanel.css'

export default function AuthLayout({ mode, setMode }) {
  return (
    <main className="auth-layout">
      <AuthLeftPanel />

      <AuthRightPanel mode={mode} setMode={setMode} />
    </main>
  );
}
