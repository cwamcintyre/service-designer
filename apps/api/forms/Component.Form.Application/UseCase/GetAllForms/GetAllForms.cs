using Component.Core.Application;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.GetAllForms.Model;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Component.Form.Application.UseCase.GetAllForms;

public class GetAllForms : IResponseUseCase<GetAllFormsResponseModel>
{
    private readonly IFormStore _formStore;
    private readonly ILogger<GetAllForms> _logger;

    public GetAllForms(IFormStore formStore, ILogger<GetAllForms> logger)
    {
        _formStore = formStore;
        _logger = logger;
    }

    public async Task<GetAllFormsResponseModel> HandleAsync()
    {
        _logger.LogInformation("Getting all forms");

        var forms = await _formStore.GetAllFormsAsync();

        _logger.LogInformation("Returning all forms");

        return new GetAllFormsResponseModel
        {
            Forms = forms
        };
    }
}
