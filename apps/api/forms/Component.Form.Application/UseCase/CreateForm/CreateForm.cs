using System;
using System.Threading.Tasks;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.CreateForm.Model;
using Component.Core.Application;
using Component.Form.Model;
using Microsoft.Extensions.Logging;

namespace Component.Form.Application.UseCase.CreateForm;

public class CreateForm : IRequestResponseUseCase<CreateFormRequestModel, CreateFormResponseModel>
{
    private readonly IFormStore _formStore;
    private readonly ILogger<CreateForm> _logger;

    public CreateForm(IFormStore formStore, ILogger<CreateForm> logger)
    {
        _formStore = formStore;
        _logger = logger;
    }

    public async Task<CreateFormResponseModel> HandleAsync(CreateFormRequestModel request)
    {
        if (request.Form == null)
        {
            throw new ArgumentNullException(nameof(request.Form));
        }

        _logger.LogInformation("Creating a new form with ID: {FormId}", request.Form.FormId);
        await _formStore.CreateFormAsync(request.Form.FormId, request.Form);

        return new CreateFormResponseModel { Success = true, FormId = request.Form.FormId };
    }
}
