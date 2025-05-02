using System;
using System.Threading.Tasks;
using Component.Form.Application.UseCase.GetForm;
using Component.Form.Application.UseCase.GetForm.Model;
using Component.Form.Application.Tests.Doubles.Infrastructure;
using Xunit;
using Component.Form.Model;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.UseCase;

[ExcludeFromCodeCoverage]
public class GetFormTests
{
    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenFormNotFound()
    {
        // Arrange
        var getForm = new GetFormTestBuilder()
            .WithGetFormAsync("nonexistent-form", null)
            .Build();

        var request = new GetFormRequestModel { FormId = "nonexistent-form" };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => getForm.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldReturnFormSuccessfully()
    {
        // Arrange
        var form = new FormModel(); // Replace with actual FormModel initialization
        var getForm = new GetFormTestBuilder()
            .WithGetFormAsync("existing-form", form)
            .Build();

        var request = new GetFormRequestModel { FormId = "existing-form" };

        // Act
        var response = await getForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(form, response.Form);
    }
}