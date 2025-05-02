using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.GetAllForms.Model;
using Component.Core.Application;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GetAllFormsController : ControllerBase
{
    private readonly IResponseUseCase<GetAllFormsResponseModel> _getAllFormsUseCase;
    private readonly ILogger<GetAllFormsController> _logger;

    public GetAllFormsController(IResponseUseCase<GetAllFormsResponseModel> getAllFormsUseCase, ILogger<GetAllFormsController> logger)
    {
        _getAllFormsUseCase = getAllFormsUseCase;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllForms()
    {
        _logger.LogInformation("Processing GetAllForms request.");
        var response = await _getAllFormsUseCase.HandleAsync();        
        return Ok(response);
    }
}
