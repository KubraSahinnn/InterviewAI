using InterviewAI.Application.DTOs;
using InterviewAI.Application.Interfaces;

namespace InterviewAI.Application.Services;

public class InterviewService : IInterviewService
{
    private readonly IInterviewSessionRepository _repository;
    private readonly IAiAnalysisService _aiAnalysisService;

    public InterviewService(IInterviewSessionRepository repository, IAiAnalysisService aiAnalysisService)
    {
        _repository = repository;
        _aiAnalysisService = aiAnalysisService;
    }

    public Task<List<PositionDto>> GetPositionsAsync()
    {
        return _repository.GetPositionsAsync();
    }

    public async Task<SessionResponse> StartSessionAsync(int userId, StartSessionRequest request)
    {
        var sessionId = await _repository.CreateSessionAsync(userId, request.PositionId);
        var questions = await _repository.GetQuestionsByPositionAsync(request.PositionId);

        return new SessionResponse
        {
            SessionId = sessionId,
            Questions = questions
        };
    }

    public Task SaveAnswerAsync(SubmitAnswerRequest request)
    {
        return _repository.SaveAnswerAsync(request);
    }

    public async Task<InterviewReportDto> GenerateReportAsync(int sessionId)
    {
        var qaPairs = await _repository.GetSessionAnswersAsync(sessionId);
        var report = await _aiAnalysisService.AnalyzeAnswersAsync(sessionId, qaPairs);
        await _repository.SaveReportAsync(report);
        return report;
    }
}
