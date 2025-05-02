using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.UpdateForm.Model;
using Component.Core.Application;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UpdateFormController : ControllerBase
{
    private readonly IRequestResponseUseCase<UpdateFormRequestModel, UpdateFormResponseModel> _updateFormUseCase;
    private readonly ILogger<UpdateFormController> _logger;

    public UpdateFormController(IRequestResponseUseCase<UpdateFormRequestModel, UpdateFormResponseModel> updateFormUseCase, ILogger<UpdateFormController> logger)
    {
        _updateFormUseCase = updateFormUseCase;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> UpdateForm([FromBody] UpdateFormRequestModel request)
    {
        _logger.LogInformation("Processing UpdateForm request.");
        var response = await _updateFormUseCase.HandleAsync(request);
        return Ok(response);
    }
}
