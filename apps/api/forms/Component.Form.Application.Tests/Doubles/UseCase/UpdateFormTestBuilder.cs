using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.UpdateForm;
using Component.Form.Model;
using Microsoft.Extensions.Logging;
using Moq;

namespace Component.Form.Application.Tests.Doubles.UseCase;

[ExcludeFromCodeCoverage]
public class UpdateFormTestBuilder
{
    private readonly Mock<IFormStore> _mockFormStore;
    private readonly Mock<ILogger<UpdateForm>> _mockLogger;

    public UpdateFormTestBuilder()
    {
        _mockFormStore = new Mock<IFormStore>();
        _mockLogger = new Mock<ILogger<UpdateForm>>();
    }

    public UpdateFormTestBuilder WithSaveFormAsync(string formId, FormModel form)
    {
        _mockFormStore.Setup(store => store.SaveFormAsync(formId, form))
            .Returns(Task.CompletedTask);
        return this;
    }

    public UpdateFormTestBuilder WithSaveFormAsyncThrowing(string formId)
    {
        _mockFormStore.Setup(store => store.SaveFormAsync(formId, It.IsAny<FormModel>()))
            .ThrowsAsync(new ArgumentException($"Failed to save form {formId}"));
        return this;
    }

    public UpdateForm Build()
    {
        return new UpdateForm(_mockFormStore.Object, _mockLogger.Object);
    }
}