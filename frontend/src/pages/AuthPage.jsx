import { useState } from "react";
import { register, login, saveSession } from "../services/authApi";

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result =
        mode === "login" ? await login(email, password) : await register(name, email, password);
      saveSession(result);
      onAuthenticated(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="masthead">
        <p className="masthead__eyebrow">Aday Değerlendirme Formu</p>
        <h1 className="masthead__title">
          Interview<em>AI</em>
        </h1>
        <p className="masthead__sub">Yapay zeka destekli mülakat koçun</p>
      </header>

      <div className="form-card">
        <div className="form-card__header">
          <span className="form-card__label">
            {mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}
          </span>
        </div>

        <div className="form-card__body">
          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="field-group">
                <label className="field-label" htmlFor="name">Ad Soyad</label>
                <input
                  id="name"
                  className="field-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="field-group">
              <label className="field-label" htmlFor="email">E-posta</label>
              <input
                id="email"
                className="field-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">Şifre</label>
              <input
                id="password"
                className="field-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Gönderiliyor…" : mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </form>

          <button
            className="ghost-btn"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Hesabın yok mu? Kayıt ol" : "Zaten hesabın var mı? Giriş yap"}
          </button>
        </div>
      </div>
    </div>
  );
}
