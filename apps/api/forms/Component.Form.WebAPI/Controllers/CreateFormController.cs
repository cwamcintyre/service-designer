using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.CreateForm.Model;
using Component.Core.Application;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CreateFormController : ControllerBase
{
    private readonly IRequestResponseUseCase<CreateFormRequestModel, CreateFormResponseModel> _createFormUseCase;
    private readonly ILogger<CreateFormController> _logger;

    public CreateFormController(IRequestResponseUseCase<CreateFormRequestModel, CreateFormResponseModel> createFormUseCase, ILogger<CreateFormController> logger)
    {
        _createFormUseCase = createFormUseCase;
        _logger = logger;
    }

    [HttpPut]
    public async Task<IActionResult> CreateForm([FromBody] CreateFormRequestModel request)
    {
        _logger.LogInformation("Processing CreateForm request.");
        var response = await _createFormUseCase.HandleAsync(request);
        if (response == null)
        {
            return NotFound("Form creation failed.");
        }
        return Ok(response);
    }
}
