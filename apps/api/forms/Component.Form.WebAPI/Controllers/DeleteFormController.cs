using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Component.Form.Application.UseCase.DeleteForm.Model;
using Component.Core.Application;
using System.Threading.Tasks;

namespace Component.Form.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeleteFormController : ControllerBase
{
    private readonly IRequestResponseUseCase<DeleteFormRequestModel, DeleteFormResponseModel> _deleteFormUseCase;
    private readonly ILogger<DeleteFormController> _logger;

    public DeleteFormController(IRequestResponseUseCase<DeleteFormRequestModel, DeleteFormResponseModel> deleteFormUseCase, ILogger<DeleteFormController> logger)
    {
        _deleteFormUseCase = deleteFormUseCase;
        _logger = logger;
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteForm([FromRoute] string id)
    {
        _logger.LogInformation("Processing DeleteForm request for ID: {Id}", id);
        var request = new DeleteFormRequestModel { FormId = id };
        var response = await _deleteFormUseCase.HandleAsync(request);
        if (response == null)
        {
            return NotFound("Form deletion failed.");
        }
        return Ok(response);
    }
}
