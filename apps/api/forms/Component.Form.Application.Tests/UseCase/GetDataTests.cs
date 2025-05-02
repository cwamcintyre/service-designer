using Component.Form.Application.UseCase.GetData;
using Component.Form.Application.UseCase.GetData.Model;
using Component.Form.Application.Tests.Doubles.Infrastructure;
using Component.Form.Application.Tests.Doubles.UseCase;
using Xunit;
using Component.Form.Model;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.UseCase;

[ExcludeFromCodeCoverage]
public class GetDataTests
{
    [Fact]
    public async Task HandleAsync_ShouldThrowApplicationException_WhenGetFormDataFails()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataThrowsAsync("applicant-123");

        var formDataStore = formDataStoreMock.Build();

        var getData = new GetDataTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataRequestModel
        {
            ApplicantId = "applicant-123"
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ApplicationException>(() => getData.HandleAsync(request));
        Assert.Contains("An error occurred while getting form data for applicant applicant-123", exception.Message);
    }

    [Fact]
    public async Task HandleAsync_ShouldReturnFormDataSuccessfully()
    {
        // Arrange
        var formData = new FormData { Data = "{\"key\":\"value\"}" };
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", formData);

        var formDataStore = formDataStoreMock.Build();

        var getData = new GetDataTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataRequestModel
        {
            ApplicantId = "applicant-123"
        };

        // Act
        var response = await getData.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal(formData, response.FormData);
    }
}