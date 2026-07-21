using System.Text;
using System.Text.Json;
using InterviewAI.Application.DTOs;
using InterviewAI.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace InterviewAI.Infrastructure.AI;

// NOT: Bu servis Google Gemini API'sini kullanır (ücretsiz kotası var).
// API anahtarını appsettings.json'a değil, `dotnet user-secrets` ile saklayın.
public class GeminiAnalysisService : IAiAnalysisService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _model;
    private readonly string _baseUrl;

    public GeminiAnalysisService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["GeminiSettings:ApiKey"] ?? string.Empty;
        _model = configuration["GeminiSettings:Model"] ?? "gemini-2.0-flash";
        _baseUrl = configuration["GeminiSettings:BaseUrl"]
            ?? "https://generativelanguage.googleapis.com/v1beta/models/";
    }

    public async Task<InterviewReportDto> AnalyzeAnswersAsync(int sessionId, List<(string Question, string Answer)> qaPairs)
    {
        var transcript = new StringBuilder();
        foreach (var (question, answer) in qaPairs)
        {
            transcript.AppendLine($"Soru: {question}");
            transcript.AppendLine($"Cevap: {answer}");
            transcript.AppendLine();
        }

        var prompt = $$"""
            Aşağıda bir mülakat oturumunun soru-cevap dökümü var. Bu cevapları
            bir İK uzmanı gözüyle değerlendir ve SADECE aşağıdaki JSON formatında yanıt ver,
            başka hiçbir metin ekleme:

            {
              "strengths": "adayın güçlü yönlerinin özeti",
              "areasToImprove": "adayın geliştirmesi gereken yönlerin özeti",
              "overallScore": 0-100 arası bir sayı
            }

            Döküm:
            {{transcript}}
            """;

        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            }
        };

        var url = $"{_baseUrl}{_model}:generateContent?key={_apiKey}";
        var response = await _httpClient.PostAsync(
            url,
            new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json"));

        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException(
                $"Gemini API hatası ({(int)response.StatusCode}): {responseJson}");
        }

        using var doc = JsonDocument.Parse(responseJson);
        var text = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString() ?? "{}";

        var cleaned = text.Replace("```json", "").Replace("```", "").Trim();
        var parsed = JsonSerializer.Deserialize<GeminiReportResult>(cleaned,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        return new InterviewReportDto
        {
            SessionId = sessionId,
            Strengths = parsed?.Strengths ?? "",
            AreasToImprove = parsed?.AreasToImprove ?? "",
            OverallScore = parsed?.OverallScore ?? 0
        };
    }

    private class GeminiReportResult
    {
        public string Strengths { get; set; } = string.Empty;
        public string AreasToImprove { get; set; } = string.Empty;
        public double OverallScore { get; set; }
    }
}