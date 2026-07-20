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

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>InterviewAI &mdash; Mülakat Koçu</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!session && !report && (
        <div>
          <label>
            Hedef Pozisyon:{" "}
            <select
              value={selectedPositionId}
              onChange={(e) => setSelectedPositionId(e.target.value)}
            >
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <div style={{ marginTop: 16 }}>
            <button onClick={handleStart} disabled={loading || !selectedPositionId}>
              Mülakatı Başlat
            </button>
          </div>
        </div>
      )}

      {session && !report && (
        <div style={{ marginTop: 16 }}>
          <p style={{ color: "#666" }}>
            Soru {currentIndex + 1} / {session.questions.length}
          </p>
          <h3>{session.questions[currentIndex]?.questionText}</h3>
          <textarea
            rows={5}
            style={{ width: "100%" }}
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Cevabını buraya yaz..."
          />
          <div style={{ marginTop: 12 }}>
            <button onClick={handleNext} disabled={loading || !currentAnswer.trim()}>
              {currentIndex === session.questions.length - 1 ? "Bitir ve Rapor Al" : "Sonraki Soru"}
            </button>
          </div>
        </div>
      )}

      {report && (
        <div style={{ marginTop: 16 }}>
          <h2>Mülakat Raporu</h2>
          <p><strong>Güçlü Yönler:</strong> {report.strengths}</p>
          <p><strong>Geliştirilmesi Gereken Yönler:</strong> {report.areasToImprove}</p>
          <p><strong>Genel Puan:</strong> {report.overallScore}</p>
          <button onClick={handleRestart}>Yeni Mülakat Başlat</button>
        </div>
      )}
    </div>
  );
}
