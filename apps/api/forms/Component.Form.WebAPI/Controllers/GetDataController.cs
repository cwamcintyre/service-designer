using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.GetData.Model;
using Component.Core.Application;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GetDataController : ControllerBase
{
    private readonly IRequestResponseUseCase<GetDataRequestModel, GetDataResponseModel> _getDataUseCase;
    private readonly ILogger<GetDataController> _logger;

    public GetDataController(IRequestResponseUseCase<GetDataRequestModel, GetDataResponseModel> getDataUseCase, ILogger<GetDataController> logger)
    {
        _getDataUseCase = getDataUseCase;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetData([FromRoute] string id)
    {
        _logger.LogInformation("Processing GetData request for id: {Id}", id);
        var request = new GetDataRequestModel { ApplicantId = id };
        var response = await _getDataUseCase.HandleAsync(request);
        return Ok(response);
    }
}
