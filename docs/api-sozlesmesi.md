# API Sözleşmesi (Taslak)

## POST /api/interview/start
İstek gövdesi:
```json
{ "userId": 1, "positionId": 1 }
```
Yanıt:
```json
{ "sessionId": 12, "questions": [{ "questionId": 1, "questionText": "..." }] }
```

## POST /api/interview/answer
İstek gövdesi:
```json
{ "sessionId": 12, "questionId": 1, "answerText": "...", "answerDurationSeconds": 45 }
```

## GET /api/interview/{sessionId}/report
Yanıt:
```json
{
  "sessionId": 12,
  "strengths": "...",
  "areasToImprove": "...",
  "overallScore": 78.5
}
```

Bu doküman geliştirme ilerledikçe güncellenecektir.
