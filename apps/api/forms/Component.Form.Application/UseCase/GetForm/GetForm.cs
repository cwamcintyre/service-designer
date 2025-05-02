using Component.Core.Application;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.GetForm.Model;
using Microsoft.Extensions.Logging;

namespace Component.Form.Application.UseCase.GetForm;

public class GetForm : IRequestResponseUseCase<GetFormRequestModel, GetFormResponseModel>
{
    private readonly IFormStore _formStore;
    private ILogger<GetForm> _logger;

    public GetForm(IFormStore formStore, ILogger<GetForm> logger)
    {
        _logger = logger;
        _formStore = formStore;
    }

    public async Task<GetFormResponseModel> HandleAsync(GetFormRequestModel request)
    {
        _logger.LogInformation($"Getting form {request.FormId}");

        var form = await _formStore.GetFormAsync(request.FormId);
        
        if (form == null) 
        {
            throw new ArgumentException($"Form {request.FormId} not found");
        }

        _logger.LogInformation($"Form {request.FormId} found, returning");

        return new GetFormResponseModel
        {
            Form = form
        };
    }
}