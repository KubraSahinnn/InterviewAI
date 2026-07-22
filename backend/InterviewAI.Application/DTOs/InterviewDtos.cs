namespace InterviewAI.Application.DTOs;

public class PositionDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class StartSessionRequest
{
    public int PositionId { get; set; }
}

public class SessionResponse
{
    public int SessionId { get; set; }
    public List<QuestionDto> Questions { get; set; } = new();
}

public class QuestionDto
{
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
}

public class SubmitAnswerRequest
{
    public int SessionId { get; set; }
    public int QuestionId { get; set; }
    public string AnswerText { get; set; } = string.Empty;
    public int AnswerDurationSeconds { get; set; }
}

public class InterviewReportDto
{
    public int SessionId { get; set; }
    public string Strengths { get; set; } = string.Empty;
    public string AreasToImprove { get; set; } = string.Empty;
    public double OverallScore { get; set; }
}
