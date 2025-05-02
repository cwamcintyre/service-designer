using System;
using System.Threading.Tasks;
using Component.Form.Application.UseCase.UpdateForm;
using Component.Form.Application.UseCase.UpdateForm.Model;
using Component.Form.Application.Tests.Doubles.UseCase;
using Component.Form.Model;
using Xunit;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.UseCase;

[ExcludeFromCodeCoverage]
public class UpdateFormTests
{
    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentNullException_WhenFormIsNull()
    {
        // Arrange
        var updateForm = new UpdateFormTestBuilder().Build();

        var request = new UpdateFormRequestModel
        {
            Form = null
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => updateForm.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenSaveFormFails()
    {
        // Arrange
        var formId = "form-123";
        var updateForm = new UpdateFormTestBuilder()
            .WithSaveFormAsyncThrowing(formId)
            .Build();

        var request = new UpdateFormRequestModel
        {
            Form = new FormModel { FormId = formId }
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() => updateForm.HandleAsync(request));
        Assert.Contains($"Failed to save form {formId}", exception.Message);
    }

    [Fact]
    public async Task HandleAsync_ShouldUpdateFormSuccessfully()
    {
        // Arrange
        var formId = "form-123";
        var form = new FormModel { FormId = formId };
        var updateForm = new UpdateFormTestBuilder()
            .WithSaveFormAsync(formId, form)
            .Build();

        var request = new UpdateFormRequestModel
        {
            Form = form
        };

        // Act
        var response = await updateForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.True(response.Success);
    }
}