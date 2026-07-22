import { useState } from "react";
import InterviewPage from "./pages/InterviewPage";
import AuthPage from "./pages/AuthPage";
import { getToken, getStoredUser } from "./services/authApi";

function App() {
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null));

  if (!user) {
    return <AuthPage onAuthenticated={(result) => setUser(result)} />;
  }

  return <InterviewPage user={user} onLogout={() => setUser(null)} />;
}

export default App;
