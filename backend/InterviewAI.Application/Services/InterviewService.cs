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

    private const int TotalDynamicQuestions = 5;

    public async Task<DynamicQuestionResponse> StartDynamicSessionAsync(int userId, StartSessionRequest request)
    {
        var position = await _repository.GetPositionByIdAsync(request.PositionId)
            ?? throw new InvalidOperationException("Pozisyon bulunamadı.");

        var sessionId = await _repository.CreateSessionAsync(userId, request.PositionId);
        var questionText = await _aiAnalysisService.GenerateFirstQuestionAsync(position.Title, position.Description);

        return new DynamicQuestionResponse
        {
            SessionId = sessionId,
            QuestionNumber = 1,
            QuestionText = questionText,
            IsFinal = false,
            TotalQuestions = TotalDynamicQuestions
        };
    }

    public async Task<DynamicQuestionResponse> SubmitDynamicAnswerAsync(SubmitDynamicAnswerRequest request)
    {
        await _repository.SaveDynamicAnswerAsync(
            request.SessionId,
            request.QuestionNumber,
            request.QuestionText,
            request.AnswerText,
            request.AnswerDurationSeconds);

        if (request.QuestionNumber >= TotalDynamicQuestions)
        {
            return new DynamicQuestionResponse
            {
                SessionId = request.SessionId,
                QuestionNumber = request.QuestionNumber,
                IsFinal = true,
                TotalQuestions = TotalDynamicQuestions
            };
        }

        var position = await _repository.GetPositionByIdAsync(request.PositionId)
            ?? throw new InvalidOperationException("Pozisyon bulunamadı.");
        var history = await _repository.GetSessionAnswersAsync(request.SessionId);

        var nextQuestion = await _aiAnalysisService.GenerateNextQuestionAsync(
            position.Title, position.Description, history);

        return new DynamicQuestionResponse
        {
            SessionId = request.SessionId,
            QuestionNumber = request.QuestionNumber + 1,
            QuestionText = nextQuestion,
            IsFinal = false,
            TotalQuestions = TotalDynamicQuestions
        };
    }
}
