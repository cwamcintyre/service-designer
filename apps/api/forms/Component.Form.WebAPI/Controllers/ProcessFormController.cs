using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.ProcessForm.Model;
using Component.Core.Application;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProcessFormController : ControllerBase
{
    private readonly IRequestResponseUseCase<ProcessFormRequestModel, ProcessFormResponseModel> _processFormUseCase;
    private readonly ILogger<ProcessFormController> _logger;

    public ProcessFormController(IRequestResponseUseCase<ProcessFormRequestModel, ProcessFormResponseModel> processFormUseCase, ILogger<ProcessFormController> logger)
    {
        _processFormUseCase = processFormUseCase;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> ProcessForm([FromBody] ProcessFormRequestModel request)
    {
        _logger.LogInformation("Processing ProcessForm request.");
        var response = await _processFormUseCase.HandleAsync(request);
        return Ok(response);
    }
}
