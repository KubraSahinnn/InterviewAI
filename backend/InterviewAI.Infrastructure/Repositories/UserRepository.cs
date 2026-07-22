using System.Data;
using Dapper;
using InterviewAI.Application.Interfaces;
using InterviewAI.Domain.Entities;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace InterviewAI.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly string _connectionString;

    public UserRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Bağlantı dizesi bulunamadı.");
    }

    private IDbConnection CreateConnection() => new MySqlConnection(_connectionString);

    public async Task<int> CreateUserAsync(string name, string email, string passwordHash)
    {
        using var connection = CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("p_Name", name);
        parameters.Add("p_Email", email);
        parameters.Add("p_PasswordHash", passwordHash);
        parameters.Add("p_NewUserId", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await connection.ExecuteAsync(
            "sp_RegisterUser",
            parameters,
            commandType: CommandType.StoredProcedure);

        return parameters.Get<int>("p_NewUserId");
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        using var connection = CreateConnection();
        var user = await connection.QueryFirstOrDefaultAsync<User>(
            "sp_GetUserByEmail",
            new { p_Email = email },
            commandType: CommandType.StoredProcedure);

        return user;
    }
}
