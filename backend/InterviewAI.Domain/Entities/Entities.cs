namespace InterviewAI.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class Position
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class InterviewSession
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PositionId { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public string Status { get; set; } = "InProgress";
}

public class InterviewQuestion
{
    public int Id { get; set; }
    public int PositionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string QuestionType { get; set; } = string.Empty;
}

public class InterviewAnswer
{
    public int Id { get; set; }
    public int SessionId { get; set; }
    public int QuestionId { get; set; }
    public string AnswerText { get; set; } = string.Empty;
    public int AnswerDurationSeconds { get; set; }
}

public class InterviewReport
{
    public int Id { get; set; }
    public int SessionId { get; set; }
    public string Strengths { get; set; } = string.Empty;
    public string AreasToImprove { get; set; } = string.Empty;
    public double OverallScore { get; set; }
    public DateTime CreatedAt { get; set; }
}
