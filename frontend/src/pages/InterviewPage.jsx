import { useEffect, useState } from "react";
import {
  getPositions,
  startDynamicInterview,
  submitDynamicAnswer,
  getInterviewReport,
} from "../services/interviewApi";
import { clearSession } from "../services/authApi";

export default function InterviewPage({ user, onLogout }) {
  const [positions, setPositions] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [session, setSession] = useState(null); // { sessionId, positionId, questionNumber, questionText, totalQuestions }
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [questionStartedAt, setQuestionStartedAt] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getPositions()
      .then((data) => {
        setPositions(data);
        if (data.length > 0) setSelectedPositionId(String(data[0].id));
      })
      .catch(() => setError("Pozisyonlar yüklenemedi. Backend çalışıyor mu?"));
  }, []);

  const handleStart = async () => {
    if (!selectedPositionId) return;
    setLoading(true);
    setLoadingLabel("İlk soru hazırlanıyor…");
    setError("");
    try {
      const positionId = Number(selectedPositionId);
      const result = await startDynamicInterview(positionId);
      setSession({
        sessionId: result.sessionId,
        positionId,
        questionNumber: result.questionNumber,
        questionText: result.questionText,
        totalQuestions: result.totalQuestions,
      });
      setQuestionStartedAt(Date.now());
    } catch (err) {
      setError("Mülakat başlatılamadı: " + err.message);
    } finally {
      setLoading(false);
      setLoadingLabel("");
    }
  };

  const handleNext = async () => {
    if (!session) return;
    const durationSeconds = Math.round((Date.now() - questionStartedAt) / 1000);
    const isLastQuestion = session.questionNumber >= session.totalQuestions;

    setLoading(true);
    setLoadingLabel(isLastQuestion ? "Raporun hazırlanıyor…" : "Sıradaki soru hazırlanıyor…");
    setError("");
    try {
      const result = await submitDynamicAnswer({
        sessionId: session.sessionId,
        positionId: session.positionId,
        questionNumber: session.questionNumber,
        questionText: session.questionText,
        answerText: currentAnswer,
        answerDurationSeconds: durationSeconds,
      });

      if (result.isFinal) {
        const finalReport = await getInterviewReport(session.sessionId);
        setReport(finalReport);
      } else {
        setSession((s) => ({
          ...s,
          questionNumber: result.questionNumber,
          questionText: result.questionText,
        }));
        setCurrentAnswer("");
        setQuestionStartedAt(Date.now());
      }
    } catch (err) {
      setError("Cevap kaydedilemedi: " + err.message);
    } finally {
      setLoading(false);
      setLoadingLabel("");
    }
  };

  const handleRestart = () => {
    setSession(null);
    setReport(null);
    setCurrentAnswer("");
  };

  const selectedPositionTitle = positions.find(
    (p) => String(p.id) === String(selectedPositionId)
  )?.title;

  return (
    <div className="page">
      <div className="profile-bar">
        <div className="profile-bar__identity">
          <span className="profile-bar__avatar">{user?.name?.charAt(0)?.toUpperCase() || "?"}</span>
          <span className="profile-bar__text">
            <span className="profile-bar__name">{user?.name}</span>
            <span className="profile-bar__email">{user?.email}</span>
          </span>
        </div>
        <button
          className="logout-btn"
          onClick={() => {
            clearSession();
            onLogout();
          }}
        >
          Çıkış Yap
        </button>
      </div>

      <header className="masthead">
        <span className="badge-pill">✦ Yapay Zeka Destekli</span>
        <h1 className="masthead__title">
          Interview<em>AI</em>
        </h1>
        <p className="masthead__sub">Mülakatlarda kendine güven, yapay zekanın gücünü yanına al.</p>
      </header>

      <div className="form-card">
        <div className="form-card__header">
          <span className="form-card__label">
            {report ? "Değerlendirme Raporu" : session ? "Mülakat Oturumu" : "Yeni Oturum"}
          </span>
          {session && <span className="form-card__id">№ {session.sessionId}</span>}
        </div>

        <div className="form-card__body">
          {error && <div className="error-banner">{error}</div>}

          {!session && !report && (
            <div>
              <div className="field-group">
                <label className="field-label" htmlFor="position">
                  Hedef Pozisyon
                </label>
                <select
                  id="position"
                  className="field-select"
                  value={selectedPositionId}
                  onChange={(e) => setSelectedPositionId(e.target.value)}
                >
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="primary-btn"
                onClick={handleStart}
                disabled={loading || !selectedPositionId}
              >
                {loading ? loadingLabel || "Başlatılıyor…" : "Mülakatı Başlat"}
              </button>
            </div>
          )}

          {session && !report && (
            <div>
              <div className="punch-track">
                {Array.from({ length: session.totalQuestions }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      "punch" +
                      (i < session.questionNumber - 1 ? " punch--done" : "") +
                      (i === session.questionNumber - 1 ? " punch--current" : "")
                    }
                  />
                ))}
                <span className="punch-count">
                  {session.questionNumber} / {session.totalQuestions} · {selectedPositionTitle}
                </span>
              </div>

              {loading ? (
                <p className="question-text" style={{ opacity: 0.6 }}>
                  {loadingLabel}
                </p>
              ) : (
                <p className="question-text">{session.questionText}</p>
              )}

              <textarea
                className="field-textarea"
                rows={5}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Cevabını buraya yaz…"
                disabled={loading}
              />

              <div style={{ marginTop: 16 }}>
                <button
                  className="primary-btn"
                  onClick={handleNext}
                  disabled={loading || !currentAnswer.trim()}
                >
                  {loading
                    ? loadingLabel || "Kaydediliyor…"
                    : session.questionNumber === session.totalQuestions
                    ? "Bitir ve Rapor Al"
                    : "Sonraki Soru"}
                </button>
              </div>
            </div>
          )}

          {report && (
            <div className="report">
              <div className="seal">
                <span className="seal__score">{Math.round(report.overallScore)}</span>
                <span className="seal__label">/ 100</span>
              </div>

              <div className="report-block report-block--strengths">
                <p className="report-block__label">Güçlü Yönler</p>
                <p className="report-block__text">{report.strengths}</p>
              </div>

              <div className="report-block report-block--improve">
                <p className="report-block__label">Geliştirilmesi Gereken Yönler</p>
                <p className="report-block__text">{report.areasToImprove}</p>
              </div>

              <button className="ghost-btn" onClick={handleRestart}>
                Yeni Mülakat Başlat
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="footer-note">InterviewAI — Yapay Zeka Destekli Mülakat Koçu</p>
    </div>
  );
}
