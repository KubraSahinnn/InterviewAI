using System.Security.Claims;
using InterviewAI.Application.DTOs;
using InterviewAI.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InterviewAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InterviewController : ControllerBase
{
    private readonly IInterviewService _interviewService;

    public InterviewController(IInterviewService interviewService)
    {
        _interviewService = interviewService;
    }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET: api/interview/positions
    [HttpGet("positions")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPositions()
    {
        var positions = await _interviewService.GetPositionsAsync();
        return Ok(positions);
    }

    // POST: api/interview/start
    [HttpPost("start")]
    public async Task<IActionResult> StartSession([FromBody] StartSessionRequest request)
    {
        var session = await _interviewService.StartSessionAsync(CurrentUserId, request);
        return Ok(session);
    }

    // POST: api/interview/answer
    [HttpPost("answer")]
    public async Task<IActionResult> SubmitAnswer([FromBody] SubmitAnswerRequest request)
    {
        await _interviewService.SaveAnswerAsync(request);
        return Ok();
    }

    // GET: api/interview/{sessionId}/report
    [HttpGet("{sessionId:int}/report")]
    public async Task<IActionResult> GetReport(int sessionId)
    {
        try
        {
            var report = await _interviewService.GenerateReportAsync(sessionId);
            return Ok(report);
        }
        catch (Exception ex)
        {
            return StatusCode(502, new { error = "Rapor oluşturulamadı", detail = ex.Message });
        }
    }
}
