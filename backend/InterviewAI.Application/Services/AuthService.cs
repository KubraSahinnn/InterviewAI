using InterviewAI.Application.DTOs;
using InterviewAI.Application.Interfaces;

namespace InterviewAI.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenGenerator _tokenGenerator;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ITokenGenerator tokenGenerator)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenGenerator = tokenGenerator;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var existing = await _userRepository.GetByEmailAsync(request.Email);
        if (existing != null)
        {
            throw new InvalidOperationException("Bu e-posta adresiyle kayıtlı bir kullanıcı zaten var.");
        }

        var passwordHash = _passwordHasher.Hash(request.Password);
        var userId = await _userRepository.CreateUserAsync(request.Name, request.Email, passwordHash);
        var token = _tokenGenerator.GenerateToken(userId, request.Email, request.Name);

        return new AuthResponse
        {
            Token = token,
            UserId = userId,
            Name = request.Name,
            Email = request.Email
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("E-posta veya şifre hatalı.");
        }

        var token = _tokenGenerator.GenerateToken(user.Id, user.Email, user.Name);

        return new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Name = user.Name,
            Email = user.Email
        };
    }
}
