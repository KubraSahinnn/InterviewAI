import { getToken } from "./authApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const detail = data?.detail || data?.error || `API hatası: ${response.status}`;
    throw new Error(detail);
  }

  return data;
}

export async function getPositions() {
  const response = await fetch(`${API_BASE_URL}/interview/positions`);
  return handleResponse(response);
}

export async function startInterviewSession(positionId) {
  const response = await fetch(`${API_BASE_URL}/interview/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ positionId }),
  });
  return handleResponse(response);
}

export async function submitAnswer(sessionId, questionId, answerText, answerDurationSeconds) {
  const response = await fetch(`${API_BASE_URL}/interview/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ sessionId, questionId, answerText, answerDurationSeconds }),
  });
  return handleResponse(response);
}

export async function getInterviewReport(sessionId) {
  const response = await fetch(`${API_BASE_URL}/interview/${sessionId}/report`, {
    headers: { ...authHeaders() },
  });
  return handleResponse(response);
}

// ---- Dinamik (yapay zeka tarafından anlık üretilen) mülakat akışı ----

export async function startDynamicInterview(positionId) {
  const response = await fetch(`${API_BASE_URL}/interview/dynamic/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ positionId }),
  });
  return handleResponse(response);
}

export async function submitDynamicAnswer({
  sessionId,
  positionId,
  questionNumber,
  questionText,
  answerText,
  answerDurationSeconds,
}) {
  const response = await fetch(`${API_BASE_URL}/interview/dynamic/next`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({
      sessionId,
      positionId,
      questionNumber,
      questionText,
      answerText,
      answerDurationSeconds,
    }),
  });
  return handleResponse(response);
}
