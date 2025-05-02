using System;
using System.Threading.Tasks;
using Component.Form.Application.UseCase.RemoveRepeatingSection;
using Component.Form.Application.UseCase.RemoveRepeatingSection.Model;
using Component.Form.Application.Tests.Doubles.Infrastructure;
using Component.Form.Application.Tests.Doubles.UseCase;
using Xunit;
using Component.Form.Model;
using Component.Form.Application.PageHandler;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.UseCase;

[ExcludeFromCodeCoverage]
public class RemoveRepeatingSectionTests
{
    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenFormInRequestIsNull()
    {
        // Arrange
        var removeRepeatingSection = new RemoveRepeatingSectionTestBuilder()
            .Build();

        var request = new RemoveRepeatingSectionRequestModel
        {
            FormId = null,
            PageId = null,
            ApplicantId = null,
            Index = 0
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => removeRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenFormIsNull()
    {
        var formStore = new FormStoreTestBuilder()
            .WithGetFormAsync("test", null)
            .Build();

        // Arrange
        var removeRepeatingSection = new RemoveRepeatingSectionTestBuilder()
            .WithFormStore(formStore)
            .Build();

        var request = new RemoveRepeatingSectionRequestModel
        {
            FormId = "test",
            PageId = null,
            ApplicantId = null,
            Index = 0
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(() => removeRepeatingSection.HandleAsync(request));
    }


    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenPageNotFound()
    {
        // Arrange
        var removeRepeatingSection = new RemoveRepeatingSectionTestBuilder()
            .Build();

        var request = new RemoveRepeatingSectionRequestModel
        {
            FormId = "textComponent",
            PageId = "nonexistent-page",
            ApplicantId = "applicant-id",
            Index = 0
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => removeRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenPageIsNotRepeating()
    {
        // Arrange
        var removeRepeatingSection = new RemoveRepeatingSectionTestBuilder()
            .Build();

        var request = new RemoveRepeatingSectionRequestModel
        {
            FormId = "textComponent",
            PageId = "what-is-your-name",
            ApplicantId = "applicant-id",
            Index = 0
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => removeRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenNoPageHandlerFound()
    {
        // Arrange
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(RepeatingSectionExamples.ApplicantId, new FormData { Data = FormDataExamples.EmptyForm });

        var removeRepeatingSection = new RemoveRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStoreMock.Build())
            .Build();

        var request = new RemoveRepeatingSectionRequestModel
        {
            FormId = "incorrectPageHandlerTest",
            PageId = "what-is-your-name",
            ApplicantId = RepeatingSectionExamples.ApplicantId,
            Index = 0
        };

        // Act & Assert
        await Assert.ThrowsAsync<NoPageHandlerException>(() => removeRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenDataIsEmpty()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(RepeatingSectionExamples.ApplicantId, new FormData { Data = FormDataExamples.EmptyForm });

        var removeRepeatingSection = new RemoveRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStoreMock.Build())
            .Build();

        var request = new RemoveRepeatingSectionRequestModel
        {
            FormId = RepeatingSectionExamples.FormId,
            PageId = RepeatingSectionExamples.PageId,
            ApplicantId = RepeatingSectionExamples.ApplicantId,
            Index = 0
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => removeRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenDataDoesNotContainKey()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(RepeatingSectionExamples.ApplicantId, new FormData { Data = RepeatingSectionExamples.FormWithNoRepeatSection });

        var removeRepeatingSection = new RemoveRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStoreMock.Build())
            .Build();

        var request = new RemoveRepeatingSectionRequestModel
        {
            FormId = RepeatingSectionExamples.FormId,
            PageId = RepeatingSectionExamples.PageId,
            ApplicantId = RepeatingSectionExamples.ApplicantId,
            Index = 0
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => removeRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenDataIsCorrupt()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(RepeatingSectionExamples.ApplicantId, new FormData { Data = RepeatingSectionExamples.CorruptedTasks });

        var removeRepeatingSection = new RemoveRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStoreMock.Build())
            .Build();

        var request = new RemoveRepeatingSectionRequestModel
        {
            FormId = RepeatingSectionExamples.FormId,
            PageId = RepeatingSectionExamples.PageId,
            ApplicantId = RepeatingSectionExamples.ApplicantId,
            Index = 0
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => removeRepeatingSection.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenDataIndexIsOutOfRange()
    {
        // Arrange
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(RepeatingSectionExamples.ApplicantId, new FormData { Data = RepeatingSectionExamples.ExistingFormData_OneEntry });

        var removeRepeatingSection = new RemoveRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStoreMock.Build())
            .Build();

        var request = new RemoveRepeatingSectionRequestModel
        {
            FormId = RepeatingSectionExamples.FormId,
            PageId = RepeatingSectionExamples.PageId,
            ApplicantId = RepeatingSectionExamples.ApplicantId,
            Index = 1
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => removeRepeatingSection.HandleAsync(request));
    }

    [Theory]
    [InlineData(RepeatingSectionExamples.ExistingFormData_OneEntry, 0, RepeatingSectionExamples.EmptyTasks)]
    [InlineData(RepeatingSectionExamples.ExistingFormData_Three_Entries, 0, RepeatingSectionExamples.RemovedFromThreeEntries_StartSaved)]
    [InlineData(RepeatingSectionExamples.ExistingFormData_Three_Entries, 1, RepeatingSectionExamples.RemovedFromThreeEntries_MiddleSaved)]
    [InlineData(RepeatingSectionExamples.ExistingFormData_Three_Entries, 2, RepeatingSectionExamples.RemovedFromThreeEntries_EndSaved)]
    public async Task HandleAsync_ShouldRemoveRepeatingSectionSuccessfully(string existingData, int index, string resultData)
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(RepeatingSectionExamples.ApplicantId, new FormData { Data = existingData })
            .WithSaveFormDataAsync(RepeatingSectionExamples.FormId, RepeatingSectionExamples.ApplicantId, resultData);

        var removeRepeatingSection = new RemoveRepeatingSectionTestBuilder()
            .WithFormDataStore(formDataStoreMock.Build())
            .Build();

        var request = new RemoveRepeatingSectionRequestModel
        {
            FormId = RepeatingSectionExamples.FormId,
            PageId = RepeatingSectionExamples.PageId,
            ApplicantId = RepeatingSectionExamples.ApplicantId,
            Index = index
        };

        // Act
        var response = await removeRepeatingSection.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.True(response.Success);
        formDataStoreMock.VerifySaveFormDataAsync(
            RepeatingSectionExamples.FormId,
            RepeatingSectionExamples.ApplicantId, 
            resultData);
    }
}