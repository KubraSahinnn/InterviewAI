import { useState } from "react";
import { startInterviewSession, submitAnswer, getInterviewReport } from "../services/interviewApi";

export default function InterviewPage() {
  const [session, setSession] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      // TODO: userId ve positionId gerçek kullanıcı seçiminden gelecek
      const result = await startInterviewSession(1, 1);
      setSession(result);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const result = await getInterviewReport(session.sessionId);
      setReport(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <h1>InterviewAI &mdash; Mülakat Koçu</h1>

      {!session && (
        <button onClick={handleStart} disabled={loading}>
          Mülakatı Başlat
        </button>
      )}

      {session && !report && (
        <div>
          <p>Oturum #{session.sessionId} başladı. Sorular burada listelenecek.</p>
          <button onClick={handleFinish} disabled={loading}>
            Mülakatı Bitir ve Rapor Al
          </button>
        </div>
      )}

      {report && (
        <div>
          <h2>Mülakat Raporu</h2>
          <p><strong>Güçlü Yönler:</strong> {report.strengths}</p>
          <p><strong>Geliştirilmesi Gereken Yönler:</strong> {report.areasToImprove}</p>
          <p><strong>Genel Puan:</strong> {report.overallScore}</p>
        </div>
      )}
    </div>
  );
}
