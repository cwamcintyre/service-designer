using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.GetForm;
using Component.Form.Model;
using Microsoft.Extensions.Logging;
using Moq;

namespace Component.Form.Application.Tests.Doubles.Infrastructure;

[ExcludeFromCodeCoverage]
public class GetFormTestBuilder
{
    private readonly Mock<IFormStore> _mockFormStore;
    private readonly Mock<ILogger<GetForm>> _mockLogger;

    public GetFormTestBuilder()
    {
        _mockFormStore = new Mock<IFormStore>();
        _mockLogger = new Mock<ILogger<GetForm>>();
    }

    public GetFormTestBuilder WithGetFormAsync(string formId, FormModel form)
    {
        _mockFormStore.Setup(store => store.GetFormAsync(formId))
            .ReturnsAsync(form);
        return this;
    }

    public GetForm Build()
    {
        return new GetForm(_mockFormStore.Object, _mockLogger.Object);
    }
}