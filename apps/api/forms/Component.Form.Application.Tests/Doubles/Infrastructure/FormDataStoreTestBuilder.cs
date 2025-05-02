using System;
using System.Threading.Tasks;
using Component.Form.Model;
using Component.Form.Application.Shared.Infrastructure;
using Moq;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.Doubles.Infrastructure;

[ExcludeFromCodeCoverage]
public class FormDataStoreTestBuilder
{
    public readonly Mock<IFormDataStore> MockFormDataStore;

    public FormDataStoreTestBuilder()
    {
        MockFormDataStore = new Mock<IFormDataStore>();
    }

    public FormDataStoreTestBuilder WithGetFormDataAsync(string applicantId, FormData formData)
    {
        MockFormDataStore.Setup(store => store.GetFormDataAsync(applicantId))
            .ReturnsAsync(formData);
        return this;
    }

    public FormDataStoreTestBuilder WithGetFormDataThrowsAsync(string applicantId)
    {
        MockFormDataStore.Setup(store => store.GetFormDataAsync(applicantId))
            .ThrowsAsync(new ArgumentException("Form not found"));
        return this;
    }

    public FormDataStoreTestBuilder WithSaveFormDataAsync(string formId, string applicantId, string formData)
    {
        MockFormDataStore.Setup(store => store.SaveFormDataAsync(formId, applicantId, formData))
            .Returns(Task.CompletedTask);
        return this;
    }

    public void VerifySaveFormDataAsync(string formId, string applicantId, string formData)
    {
        MockFormDataStore.Verify(store => store.SaveFormDataAsync(formId, applicantId, formData), Times.Once);
    }

    public IFormDataStore Build()
    {
        return MockFormDataStore.Object;
    }
}
