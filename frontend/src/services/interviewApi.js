const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:5001/api";

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`API hatası: ${response.status}`);
  }
  return response.json();
}

export async function startInterviewSession(userId, positionId) {
  const response = await fetch(`${API_BASE_URL}/interview/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, positionId }),
  });
  return handleResponse(response);
}

export async function submitAnswer(sessionId, questionId, answerText, answerDurationSeconds) {
  const response = await fetch(`${API_BASE_URL}/interview/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, questionId, answerText, answerDurationSeconds }),
  });
  return handleResponse(response);
}

export async function getInterviewReport(sessionId) {
  const response = await fetch(`${API_BASE_URL}/interview/${sessionId}/report`);
  return handleResponse(response);
}
