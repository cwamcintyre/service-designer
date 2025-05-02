using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.ProcessForm.Model;
using Component.Core.Application;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProcessChangeInFormController : ControllerBase
{
    private readonly IRequestResponseUseCase<ProcessChangeInFormRequestModel, ProcessChangeInFormResponseModel> _processChangeInFormUseCase;
    private readonly ILogger<ProcessChangeInFormController> _logger;

    public ProcessChangeInFormController(IRequestResponseUseCase<ProcessChangeInFormRequestModel, ProcessChangeInFormResponseModel> processChangeInFormUseCase, ILogger<ProcessChangeInFormController> logger)
    {
        _processChangeInFormUseCase = processChangeInFormUseCase;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> ProcessChangeInForm([FromBody] ProcessChangeInFormRequestModel request)
    {
        _logger.LogInformation("Processing ProcessChangeInForm request.");
        var response = await _processChangeInFormUseCase.HandleAsync(request);
        return Ok(response);
    }
}
