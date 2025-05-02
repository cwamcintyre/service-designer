using System;
using System.Threading.Tasks;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.UpdateForm.Model;
using Component.Core.Application;
using Component.Form.Model;
using Microsoft.Extensions.Logging;

namespace Component.Form.Application.UseCase.UpdateForm;

// COPILOT: using ProcessForm as an example, implement UpdateForm which takes a FormModel and uses IFormStore to update the form
// use the IRequestResponse interface and generate UpdateForm request and response models
public class UpdateForm : IRequestResponseUseCase<UpdateFormRequestModel, UpdateFormResponseModel>
{
    private readonly IFormStore _formStore;
    private readonly ILogger<UpdateForm> _logger;

    public UpdateForm(IFormStore formStore, ILogger<UpdateForm> logger)
    {
        _formStore = formStore;
        _logger = logger;
    }

    public async Task<UpdateFormResponseModel> HandleAsync(UpdateFormRequestModel request)
    {
        if (request.Form == null)
        {
            throw new ArgumentNullException(nameof(request.Form));
        }

        _logger.LogInformation("Updating form with ID: {FormId}", request.Form.FormId);
        await _formStore.UpdateFormAsync(request.Form.FormId, request.Form);

        return new UpdateFormResponseModel { Success = true };
    }
}
