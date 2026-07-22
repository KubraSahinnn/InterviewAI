import { useEffect, useState } from "react";
import {
  getPositions,
  startInterviewSession,
  submitAnswer,
  getInterviewReport,
} from "../services/interviewApi";

const DEMO_USER_ID = 1; // TODO: gerçek kimlik doğrulama eklendiğinde giriş yapan kullanıcıdan alınacak

export default function InterviewPage() {
  const [positions, setPositions] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [questionStartedAt, setQuestionStartedAt] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setError("");
    try {
      const result = await startInterviewSession(DEMO_USER_ID, Number(selectedPositionId));
      setSession(result);
      setCurrentIndex(0);
      setQuestionStartedAt(Date.now());
    } catch (err) {
      setError("Mülakat başlatılamadı: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!session) return;
    const question = session.questions[currentIndex];
    const durationSeconds = Math.round((Date.now() - questionStartedAt) / 1000);

    setLoading(true);
    setError("");
    try {
      await submitAnswer(session.sessionId, question.questionId, currentAnswer, durationSeconds);

      const isLastQuestion = currentIndex === session.questions.length - 1;
      if (isLastQuestion) {
        const result = await getInterviewReport(session.sessionId);
        setReport(result);
      } else {
        setCurrentIndex((i) => i + 1);
        setCurrentAnswer("");
        setQuestionStartedAt(Date.now());
      }
    } catch (err) {
      setError("Cevap kaydedilemedi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setSession(null);
    setReport(null);
    setCurrentIndex(0);
    setCurrentAnswer("");
  };

  const selectedPositionTitle = positions.find(
    (p) => String(p.id) === String(selectedPositionId)
  )?.title;

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
                {loading ? "Başlatılıyor…" : "Mülakatı Başlat"}
              </button>
            </div>
          )}

          {session && !report && (
            <div>
              <div className="punch-track">
                {session.questions.map((_, i) => (
                  <span
                    key={i}
                    className={
                      "punch" +
                      (i < currentIndex ? " punch--done" : "") +
                      (i === currentIndex ? " punch--current" : "")
                    }
                  />
                ))}
                <span className="punch-count">
                  {currentIndex + 1} / {session.questions.length} · {selectedPositionTitle}
                </span>
              </div>

              <p className="question-text">{session.questions[currentIndex]?.questionText}</p>

              <textarea
                className="field-textarea"
                rows={5}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Cevabını buraya yaz…"
              />

              <div style={{ marginTop: 16 }}>
                <button
                  className="primary-btn"
                  onClick={handleNext}
                  disabled={loading || !currentAnswer.trim()}
                >
                  {loading
                    ? "Kaydediliyor…"
                    : currentIndex === session.questions.length - 1
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

      <p className="footer-note">InterviewAI — Bandırma Onyedi Eylül Üniversitesi Bitirme Projesi</p>
    </div>
  );
}
