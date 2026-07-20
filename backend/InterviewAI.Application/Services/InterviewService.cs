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

    public async Task<SessionResponse> StartSessionAsync(StartSessionRequest request)
    {
        var sessionId = await _repository.CreateSessionAsync(request.UserId, request.PositionId);

        // TODO: pozisyona göre soru havuzundan sorular çekilecek (sp_GetQuestionsByPosition)
        return new SessionResponse
        {
            SessionId = sessionId,
            Questions = new List<QuestionDto>()
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
