using System;
using System.Threading.Tasks;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.DeleteForm.Model;
using Component.Core.Application;
using Microsoft.Extensions.Logging;

namespace Component.Form.Application.UseCase.DeleteForm;

public class DeleteForm : IRequestResponseUseCase<DeleteFormRequestModel, DeleteFormResponseModel>
{
    private readonly IFormStore _formStore;
    private readonly ILogger<DeleteForm> _logger;

    public DeleteForm(IFormStore formStore, ILogger<DeleteForm> logger)
    {
        _formStore = formStore;
        _logger = logger;
    }

    public async Task<DeleteFormResponseModel> HandleAsync(DeleteFormRequestModel request)
    {
        if (string.IsNullOrEmpty(request.FormId))
        {
            throw new ArgumentNullException(nameof(request.FormId));
        }

        _logger.LogInformation("Deleting form with ID: {FormId}", request.FormId);
        await _formStore.DeleteFormAsync(request.FormId);

        return new DeleteFormResponseModel { Success = true };
    }
}
