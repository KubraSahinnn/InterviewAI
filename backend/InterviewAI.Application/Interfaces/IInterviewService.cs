using InterviewAI.Application.DTOs;

namespace InterviewAI.Application.Interfaces;

public interface IInterviewService
{
    Task<List<PositionDto>> GetPositionsAsync();
    Task<SessionResponse> StartSessionAsync(StartSessionRequest request);
    Task SaveAnswerAsync(SubmitAnswerRequest request);
    Task<InterviewReportDto> GenerateReportAsync(int sessionId);
}

public interface IAiAnalysisService
{
    Task<InterviewReportDto> AnalyzeAnswersAsync(int sessionId, List<(string Question, string Answer)> qaPairs);
}

public interface IInterviewSessionRepository
{
    Task<List<PositionDto>> GetPositionsAsync();
    Task<int> CreateSessionAsync(int userId, int positionId);
    Task<List<QuestionDto>> GetQuestionsByPositionAsync(int positionId);
    Task SaveAnswerAsync(SubmitAnswerRequest request);
    Task<List<(string Question, string Answer)>> GetSessionAnswersAsync(int sessionId);
    Task SaveReportAsync(InterviewReportDto report);
}
