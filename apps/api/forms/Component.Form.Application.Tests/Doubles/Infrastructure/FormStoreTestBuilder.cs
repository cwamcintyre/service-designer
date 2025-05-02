using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Model;
using Microsoft.Extensions.Logging;
using Moq;

namespace Component.Form.Application.Tests.Doubles.Infrastructure;

[ExcludeFromCodeCoverage]
public class FormStoreTestBuilder
{
    private readonly Mock<IFormStore> _mockFormStore;

    public FormStoreTestBuilder()
    {
        _mockFormStore = new Mock<IFormStore>();
    }

    public FormStoreTestBuilder WithGetFormAsync(string formId, FormModel form)
    {
        _mockFormStore.Setup(store => store.GetFormAsync(formId))
            .ReturnsAsync(form);
        return this;
    }

    public IFormStore Build()
    {
        return _mockFormStore.Object;
    }
}