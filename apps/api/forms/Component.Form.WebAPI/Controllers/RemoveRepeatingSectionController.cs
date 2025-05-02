using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.RemoveRepeatingSection.Model;
using Component.Core.Application;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RemoveRepeatingSectionController : ControllerBase
{
    private readonly IRequestResponseUseCase<RemoveRepeatingSectionRequestModel, RemoveRepeatingSectionResponseModel> _removeRepeatingSectionUseCase;
    private readonly ILogger<RemoveRepeatingSectionController> _logger;

    public RemoveRepeatingSectionController(IRequestResponseUseCase<RemoveRepeatingSectionRequestModel, RemoveRepeatingSectionResponseModel> removeRepeatingSectionUseCase, ILogger<RemoveRepeatingSectionController> logger)
    {
        _removeRepeatingSectionUseCase = removeRepeatingSectionUseCase;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> RemoveRepeatingSection([FromBody] RemoveRepeatingSectionRequestModel request)
    {
        _logger.LogInformation("Processing RemoveRepeatingSection request.");
        var response = await _removeRepeatingSectionUseCase.HandleAsync(request);
        return Ok(response);
    }
}
