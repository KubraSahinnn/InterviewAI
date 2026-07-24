using InterviewAI.Application.DTOs;
using InterviewAI.Domain.Entities;

namespace InterviewAI.Application.Interfaces;

public interface IInterviewService
{
    Task<List<PositionDto>> GetPositionsAsync();
    Task<SessionResponse> StartSessionAsync(int userId, StartSessionRequest request);
    Task SaveAnswerAsync(SubmitAnswerRequest request);
    Task<InterviewReportDto> GenerateReportAsync(int sessionId);

    // Dinamik (yapay zeka tarafından anlık üretilen) mülakat akışı
    Task<DynamicQuestionResponse> StartDynamicSessionAsync(int userId, StartSessionRequest request);
    Task<DynamicQuestionResponse> SubmitDynamicAnswerAsync(SubmitDynamicAnswerRequest request);
}

public interface IAiAnalysisService
{
    Task<InterviewReportDto> AnalyzeAnswersAsync(int sessionId, List<(string Question, string Answer)> qaPairs);
    Task<string> GenerateFirstQuestionAsync(string positionTitle, string positionDescription);
    Task<string> GenerateNextQuestionAsync(string positionTitle, string positionDescription, List<(string Question, string Answer)> history);
}

public interface IInterviewSessionRepository
{
    Task<List<PositionDto>> GetPositionsAsync();
    Task<Position?> GetPositionByIdAsync(int positionId);
    Task<int> CreateSessionAsync(int userId, int positionId);
    Task<List<QuestionDto>> GetQuestionsByPositionAsync(int positionId);
    Task SaveAnswerAsync(SubmitAnswerRequest request);
    Task SaveDynamicAnswerAsync(int sessionId, int questionNumber, string questionText, string answerText, int durationSeconds);
    Task<List<(string Question, string Answer)>> GetSessionAnswersAsync(int sessionId);
    Task SaveReportAsync(InterviewReportDto report);
}
