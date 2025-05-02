using Component.Form.Application.UseCase.ProcessForm.Model;
using Component.Form.Application.Tests.Doubles.Infrastructure;
using Component.Form.Application.Tests.Doubles.UseCase;
using Component.Form.Application.PageHandler;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.UseCase;

[ExcludeFromCodeCoverage]
public class ProcessFormTests
{
    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenFormNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder().Build();
        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "nonexistent-form",
            PageId = "page1",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => processForm.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenPageNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder().Build();
        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "test",
            PageId = "nonexistent-page",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => processForm.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenPageHandlerNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder().Build();
        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "incorrectPageHandlerTest",
            PageId = "what-is-your-name",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<NoPageHandlerException>(() => processForm.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldProcessFormSuccessfully()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.EmptyForm })
            .WithSaveFormDataAsync("test", FormDataExamples.ApplicantId, FormDataExamples.WhatIsYourName_Valid)
            .Build();

        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "textComponent",
            PageId = "what-is-your-name",
            ApplicantId = FormDataExamples.ApplicantId,
            Form = FormDataExamples.WhatIsYourName_Form_Valid
        };

        // Act
        var response = await processForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("summary", response.NextPageId);
    }

    [Fact]
    public async Task HandleAsync_Should_ProcessFormSuccessfully_WhenDataInvalid()
    {
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.EmptyForm })
            .WithSaveFormDataAsync("test", FormDataExamples.ApplicantId, FormDataExamples.WhatIsYourName_Invalid)
            .Build();

        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "textComponent",
            PageId = "what-is-your-name",
            ApplicantId = FormDataExamples.ApplicantId,
            Form = FormDataExamples.WhatIsYourName_Form_Invalid
        };

        // Act
        var response = await processForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("what-is-your-name", response.NextPageId);
    }

    [Fact]
    public async Task HandleAsync_Should_ProcessFormSuccessfully_WhenConditionIsMet()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.EmptyForm })
            .WithSaveFormDataAsync("test", FormDataExamples.ApplicantId, FormDataExamples.DoYouWantToFillInThisFormAnswered_Yes)
            .Build();

        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "test",
            PageId = "do-you-want-to-fill-in-this-form",
            ApplicantId = FormDataExamples.ApplicantId,
            Form = FormDataExamples.DoYouWantToFillInThisForm_Form_Yes
        };

        // Act
        var response = await processForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("what-is-your-name", response.NextPageId);
    }

    [Fact]
    public async Task HandleAsync_Should_ProcessFormSuccessfully_WhenConditionIsNotMet()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.EmptyForm })
            .WithSaveFormDataAsync("test", FormDataExamples.ApplicantId, FormDataExamples.DoYouWantToFillInThisFormAnswered_No)
            .Build();

        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "test",
            PageId = "do-you-want-to-fill-in-this-form",
            ApplicantId = FormDataExamples.ApplicantId,
            Form = FormDataExamples.DoYouWantToFillInThisForm_Form_No
        };

        // Act
        var response = await processForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("stop", response.NextPageId);
    }

    [Fact]
    public async Task HandleAsync_ShouldGoToNextRepeatingPage_When_UserFillsInFirstRepeatPage()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = RepeatingSectionExamples.EmptyForm })
            .WithSaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.WhatAreYouGoingToDoToday_Saved);
        
        var formDataStore = formDataStoreMock.Build();

        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = "applicant-123",
            Form = RepeatingSectionExamples.WhatAreYouGoingToDoToday_Form_Data
        };

        // Act
        var response = await processForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("tasks-repeat", response.NextPageId);
        Assert.Equal("0-how-long-will-it-take", response.ExtraData);
        formDataStoreMock.VerifySaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.WhatAreYouGoingToDoToday_Saved);
    }

    [Fact]
    public async Task HandleAsync_ShouldGoToNextRepeatingPage_When_UserFillsInNextPage()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = RepeatingSectionExamples.WhatAreYouGoingToDoToday_Saved })
            .WithSaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.HowLongWillItTake_Saved);
        
        var formDataStore = formDataStoreMock.Build();

        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = "applicant-123",
            Form = RepeatingSectionExamples.HowLongWillItTake_Form_Data
        };

        // Act
        var response = await processForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("tasks-repeat", response.NextPageId);
        Assert.Equal("0-do-you-want-to-add-another-task", response.ExtraData);
        formDataStoreMock.VerifySaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.HowLongWillItTake_Saved);
    }

    [Fact]
    public async Task HandleAsync_ShouldStayOnRepeatingPage_When_UserFillsInNextPage()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = RepeatingSectionExamples.WhatAreYouGoingToDoToday_Saved })
            .WithSaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.HowLongWillItTakeInvalid_Saved);
        
        var formDataStore = formDataStoreMock.Build();

        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = "applicant-123",
            Form = RepeatingSectionExamples.HowLongWillItTakeInvalid_Form_Data
        };

        // Act
        var response = await processForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("tasks-repeat", response.NextPageId);
        Assert.Equal("0-how-long-will-it-take", response.ExtraData);
        formDataStoreMock.VerifySaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.HowLongWillItTakeInvalid_Saved);
    }

    [Fact]
    public async Task HandleAsync_ShouldGoToNextPage_When_UserFillsInConditionPageAndMeetsCondition()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = RepeatingSectionExamples.HowLongWillItTake_Saved })
            .WithSaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.DoYouWantToAddAnother_Yes_Saved);
        
        var formDataStore = formDataStoreMock.Build();

        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = "applicant-123",
            Form = RepeatingSectionExamples.DoYouWantToAddAnother_Yes_Form_Data
        };

        // Act
        var response = await processForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("tasks-repeat", response.NextPageId);
        Assert.Equal("1-what-do-you-want-to-do-today", response.ExtraData);
        formDataStoreMock.VerifySaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.DoYouWantToAddAnother_Yes_Saved);
    }

[Fact]
    public async Task HandleAsync_ShouldGoToNextPage_When_UserMeetsConditionAndFillsInTheNextPage()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = RepeatingSectionExamples.Processed_Yes_Saved })
            .WithSaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.WhatAreYouGoingToDoToday_ProcessedConditionAndSaved);
        
        var formDataStore = formDataStoreMock.Build();

        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = "applicant-123",
            Form = RepeatingSectionExamples.WhatAreYouGoingToDoToday_Form_AddedData
        };

        // Act
        var response = await processForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("tasks-repeat", response.NextPageId);
        Assert.Equal("1-how-long-will-it-take", response.ExtraData);
        formDataStoreMock.VerifySaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.WhatAreYouGoingToDoToday_ProcessedConditionAndSaved);
    }

    [Fact]
    public async Task HandleAsync_ShouldGoToNextPage_When_UserFillsInConditionPageAndDoesNotMeetCondition()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = RepeatingSectionExamples.HowLongWillItTake_Saved })
            .WithSaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.DoYouWantToAddAnother_No_Saved);
        
        var formDataStore = formDataStoreMock.Build();

        var processForm = new ProcessFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessFormRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = "applicant-123",
            Form = RepeatingSectionExamples.DoYouWantToAddAnother_No_Form_Data
        };

        // Act
        var response = await processForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("summary", response.NextPageId);
        Assert.Null(response.ExtraData);
        formDataStoreMock.VerifySaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.DoYouWantToAddAnother_No_Saved);
    }
}
