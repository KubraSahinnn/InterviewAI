using InterviewAI.Application.DTOs;
using InterviewAI.Domain.Entities;

namespace InterviewAI.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
}

public interface IUserRepository
{
    Task<int> CreateUserAsync(string name, string email, string passwordHash);
    Task<User?> GetByEmailAsync(string email);
}

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string passwordHash);
}

public interface ITokenGenerator
{
    string GenerateToken(int userId, string email, string name);
}
