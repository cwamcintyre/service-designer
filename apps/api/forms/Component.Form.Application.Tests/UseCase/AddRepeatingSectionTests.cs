using Component.Form.Application.UseCase.AddRepeatingSection.Model;
using Component.Form.Application.Tests.Doubles.Infrastructure;
using Component.Form.Application.Tests.Doubles.UseCase;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.UseCase;

[ExcludeFromCodeCoverage]
public class AddRepeatingSectionTests
{
    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenFormNotSupplied()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder().Build();
        var addRepeatingSection = new AddRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new AddRepeatingSectionRequestModel
        {
            FormId = null,
            PageId = null,
            ApplicantId = null
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => addRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenFormNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder().Build();
        var addRepeatingSection = new AddRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new AddRepeatingSectionRequestModel
        {
            FormId = "nonexistent-form",
            PageId = RepeatingSectionExamples.PageId,
            ApplicantId = RepeatingSectionExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => addRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenPageNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder().Build();
        var addRepeatingSection = new AddRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new AddRepeatingSectionRequestModel
        {
            FormId = RepeatingSectionExamples.FormId,
            PageId = "nonexistent-page",
            ApplicantId = RepeatingSectionExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => addRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenPageIsNotRepeating()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(RepeatingSectionExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormData_OneEntry });

        var formDataStore = formDataStoreMock.Build();

        var addRepeatingSection = new AddRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new AddRepeatingSectionRequestModel
        {
            FormId = "textComponent",
            PageId = "what-is-your-name",
            ApplicantId = RepeatingSectionExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => addRepeatingSection.HandleAsync(request));
    }
    
    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenRepeatListIsCorrupt()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(RepeatingSectionExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.CorruptedTasks });

        var formDataStore = formDataStoreMock.Build();

        var addRepeatingSection = new AddRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new AddRepeatingSectionRequestModel
        {
            FormId = RepeatingSectionExamples.FormId,
            PageId = RepeatingSectionExamples.PageId,
            ApplicantId = RepeatingSectionExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => addRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldAddRepeatingSectionWithNoDataSuccessfully()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(RepeatingSectionExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.EmptyForm})
            .WithSaveFormDataAsync(RepeatingSectionExamples.FormId, RepeatingSectionExamples.ApplicantId, RepeatingSectionExamples.EmptyForm_Tasks_Added);
        
        var formDataStore = formDataStoreMock.Build();

        var addRepeatingSection = new AddRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new AddRepeatingSectionRequestModel
        {
            FormId = RepeatingSectionExamples.FormId,
            PageId = RepeatingSectionExamples.PageId,
            ApplicantId = RepeatingSectionExamples.ApplicantId
        };

        // Act
        var response = await addRepeatingSection.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.True(response.Success);
        Assert.Equal(0, response.NewRepeatIndex);
        Assert.Equal("what-do-you-want-to-do-today", response.StartPageId);
        formDataStoreMock.VerifySaveFormDataAsync(RepeatingSectionExamples.FormId, RepeatingSectionExamples.ApplicantId, RepeatingSectionExamples.EmptyForm_Tasks_Added);
    }


    [Fact]
    public async Task HandleAsync_ShouldAddRepeatingSectionToExistingDataSuccessfully()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(RepeatingSectionExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormData_OneEntry })
            .WithSaveFormDataAsync(RepeatingSectionExamples.FormId, RepeatingSectionExamples.ApplicantId, RepeatingSectionExamples.AddRepeatingSectionSaved);
        
        var formDataStore = formDataStoreMock.Build();

        var addRepeatingSection = new AddRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new AddRepeatingSectionRequestModel
        {
            FormId = RepeatingSectionExamples.FormId,
            PageId = RepeatingSectionExamples.PageId,
            ApplicantId = RepeatingSectionExamples.ApplicantId
        };

        // Act
        var response = await addRepeatingSection.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.True(response.Success);
        Assert.Equal(1, response.NewRepeatIndex);
        Assert.Equal("what-do-you-want-to-do-today", response.StartPageId);
        formDataStoreMock.VerifySaveFormDataAsync(RepeatingSectionExamples.FormId, RepeatingSectionExamples.ApplicantId, RepeatingSectionExamples.AddRepeatingSectionSaved);
    }
}