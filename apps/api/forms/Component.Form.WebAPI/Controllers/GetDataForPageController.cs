using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.GetDataForPage.Model;
using Component.Core.Application;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GetDataForPageController : ControllerBase
{
    private readonly IRequestResponseUseCase<GetDataForPageRequestModel, GetDataForPageResponseModel> _getDataForPageUseCase;
    private readonly ILogger<GetDataForPageController> _logger;

    public GetDataForPageController(IRequestResponseUseCase<GetDataForPageRequestModel, GetDataForPageResponseModel> getDataForPageUseCase, ILogger<GetDataForPageController> logger)
    {
        _getDataForPageUseCase = getDataForPageUseCase;
        _logger = logger;
    }

    [HttpGet("{formId}/{pageId}/{applicantId}/{*data}")]
    public async Task<IActionResult> GetDataForPage(string formId, string pageId, string applicantId, string? data = null)
    {
        _logger.LogInformation("Processing GetDataForPage request.");
        
        var request = new GetDataForPageRequestModel
        {
            FormId = formId,
            PageId = pageId,
            ApplicantId = applicantId,
            ExtraData = data
        };
        
        var response = await _getDataForPageUseCase.HandleAsync(request);
        return Ok(response);
    }
}
