using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.GetForm.Model;
using Component.Core.Application;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GetFormController : ControllerBase
{
    private readonly IRequestResponseUseCase<GetFormRequestModel, GetFormResponseModel> _getFormUseCase;
    private readonly ILogger<GetFormController> _logger;

    public GetFormController(IRequestResponseUseCase<GetFormRequestModel, GetFormResponseModel> getFormUseCase, ILogger<GetFormController> logger)
    {
        _getFormUseCase = getFormUseCase;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetForm([FromRoute] string id)
    {
        _logger.LogInformation("Processing GetForm request for id: {Id}", id);
        var request = new GetFormRequestModel { FormId = id };
        var response = await _getFormUseCase.HandleAsync(request);
        return Ok(response);
    }
}
