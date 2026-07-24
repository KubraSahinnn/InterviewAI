using System.Data;
using Dapper;
using InterviewAI.Application.DTOs;
using InterviewAI.Application.Interfaces;
using InterviewAI.Domain.Entities;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace InterviewAI.Infrastructure.Repositories;

public class InterviewSessionRepository : IInterviewSessionRepository
{
    private readonly string _connectionString;

    public InterviewSessionRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Bağlantı dizesi bulunamadı.");
    }

    private IDbConnection CreateConnection() => new MySqlConnection(_connectionString);

    public async Task<List<PositionDto>> GetPositionsAsync()
    {
        using var connection = CreateConnection();
        var rows = await connection.QueryAsync<PositionDto>(
            "sp_GetPositions",
            commandType: CommandType.StoredProcedure);

        return rows.ToList();
    }

    public async Task<Position?> GetPositionByIdAsync(int positionId)
    {
        using var connection = CreateConnection();
        var position = await connection.QueryFirstOrDefaultAsync<Position>(
            "sp_GetPositionById",
            new { p_PositionId = positionId },
            commandType: CommandType.StoredProcedure);

        return position;
    }

    public async Task<int> CreateSessionAsync(int userId, int positionId)
    {
        using var connection = CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("p_UserId", userId);
        parameters.Add("p_PositionId", positionId);
        parameters.Add("p_NewSessionId", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "sp_CreateInterviewSession",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("p_NewSessionId");
    }

    public async Task<List<QuestionDto>> GetQuestionsByPositionAsync(int positionId)
    {
        using var connection = CreateConnection();
        var rows = await connection.QueryAsync<QuestionDto>(
            "sp_GetQuestionsByPosition",
            new { p_PositionId = positionId },
            commandType: CommandType.StoredProcedure);

        return rows.ToList();
    }

    public async Task SaveAnswerAsync(SubmitAnswerRequest request)
    {
        using var connection = CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("p_SessionId", request.SessionId);
        parameters.Add("p_QuestionId", request.QuestionId);
        parameters.Add("p_AnswerText", request.AnswerText);
        parameters.Add("p_DurationSeconds", request.AnswerDurationSeconds);

        await connection.ExecuteAsync(
            "sp_SaveAnswer",
            parameters,
            commandType: CommandType.StoredProcedure);
    }

    public async Task SaveDynamicAnswerAsync(int sessionId, int questionNumber, string questionText, string answerText, int durationSeconds)
    {
        using var connection = CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("p_SessionId", sessionId);
        parameters.Add("p_QuestionNumber", questionNumber);
        parameters.Add("p_QuestionText", questionText);
        parameters.Add("p_AnswerText", answerText);
        parameters.Add("p_DurationSeconds", durationSeconds);

        await connection.ExecuteAsync(
            "sp_SaveDynamicAnswer",
            parameters,
            commandType: CommandType.StoredProcedure);
    }

    public async Task<List<(string Question, string Answer)>> GetSessionAnswersAsync(int sessionId)
    {
        using var connection = CreateConnection();
        var rows = await connection.QueryAsync<(string Question, string Answer)>(
            "sp_GetSessionAnswers",
            new { p_SessionId = sessionId },
            commandType: CommandType.StoredProcedure);

        return rows.ToList();
    }

    public async Task SaveReportAsync(InterviewReportDto report)
    {
        using var connection = CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("p_SessionId", report.SessionId);
        parameters.Add("p_Strengths", report.Strengths);
        parameters.Add("p_AreasToImprove", report.AreasToImprove);
        parameters.Add("p_OverallScore", report.OverallScore);

        await connection.ExecuteAsync(
            "sp_InsertReport",
            parameters,
            commandType: CommandType.StoredProcedure);
    }
}
