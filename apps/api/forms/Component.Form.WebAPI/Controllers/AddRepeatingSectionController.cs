using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.AddRepeatingSection.Model;
using Component.Core.Application;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AddRepeatingSectionController : ControllerBase
{
    private readonly IRequestResponseUseCase<AddRepeatingSectionRequestModel, AddRepeatingSectionResponseModel> _addRepeatingSectionUseCase;
    private readonly ILogger<AddRepeatingSectionController> _logger;

    public AddRepeatingSectionController(IRequestResponseUseCase<AddRepeatingSectionRequestModel, AddRepeatingSectionResponseModel> addRepeatingSectionUseCase, ILogger<AddRepeatingSectionController> logger)
    {
        _addRepeatingSectionUseCase = addRepeatingSectionUseCase;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> AddRepeatingSection([FromBody] AddRepeatingSectionRequestModel request)
    {
        _logger.LogInformation("Processing AddRepeatingSection request.");
        var response = await _addRepeatingSectionUseCase.HandleAsync(request);
        return Ok(response);
    }
}
