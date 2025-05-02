using System.Diagnostics.CodeAnalysis;
using Component.Form.Application.PageHandler;
using Component.Form.Application.Tests.Doubles.Infrastructure;
using Component.Form.Application.Tests.Doubles.UseCase;
using Component.Form.Application.UseCase.ProcessForm.Model;
using Component.Form.Model;

namespace Component.Form.Application.Tests.UseCase;

[ExcludeFromCodeCoverage]
public class ProcessChangeInFormTests
{
    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenFormNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder().Build();
        var processChangeInForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "nonexistent-form",
            PageId = "page1",
            ApplicantId = "applicant-123"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => processChangeInForm.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenPageNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder().Build();
        var processChangeInForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "test",
            PageId = "nonexistent-page",
            ApplicantId = "applicant-123"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => processChangeInForm.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenPageHandlerNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder().Build();
        var processForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "incorrectPageHandlerTest",
            PageId = "what-is-your-name",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<NoPageHandlerException>(() => processForm.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldProcessChangeSuccessfully()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = FormDataExamples.WhatIsYourName_Valid })
            .WithSaveFormDataAsync("textComponent", "applicant-123", FormDataExamples.WhatIsYourNameChanged_Saved);
        
        var formDataStore = formDataStoreMock.Build();

        var processChangeInForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "textComponent",
            PageId = "what-is-your-name",
            ApplicantId = "applicant-123",
            Form = FormDataExamples.WhatIsYourName_Form_Changed
        };

        // Act
        var response = await processChangeInForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("summary", response.NextPageId);
        formDataStoreMock.VerifySaveFormDataAsync("textComponent", "applicant-123", FormDataExamples.WhatIsYourNameChanged_Saved);
    }

    [Fact]
    public async Task HandleAsync_ShouldReturnToPage_When_DataIsInvalid()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = FormDataExamples.WhatIsYourName_Valid })
            .WithSaveFormDataAsync("textComponent", "applicant-123", FormDataExamples.WhatIsYourName_Invalid);
        
        var formDataStore = formDataStoreMock.Build();

        var processChangeInForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "textComponent",
            PageId = "what-is-your-name",
            ApplicantId = "applicant-123",
            Form = FormDataExamples.WhatIsYourName_Form_Invalid
        };

        // Act
        var response = await processChangeInForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("what-is-your-name", response.NextPageId);
        formDataStoreMock.VerifySaveFormDataAsync("textComponent", "applicant-123", FormDataExamples.WhatIsYourName_Invalid);
    }

    [Fact]
    public async Task HandleAsync_ShouldGoToSummary_When_BranchDoesNotChange()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData { Data = FormDataExamples.ExistingBranchChangeData })
            .WithSaveFormDataAsync("branchTest", "applicant-123", FormDataExamples.BranchChangeDataGoesToSummary);
        
        var formDataStore = formDataStoreMock.Build();

        var processChangeInForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "branchTest",
            PageId = "what-is-your-name",
            ApplicantId = "applicant-123",
            Form = FormDataExamples.WhatIsYourName_Form_Changed
        };

        // Act
        var response = await processChangeInForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("summary", response.NextPageId);
        formDataStoreMock.VerifySaveFormDataAsync("branchTest", "applicant-123", FormDataExamples.BranchChangeDataGoesToSummary);
    }

    [Fact]
    public async Task HandleAsync_ShouldGoToIncompletePage_When_BranchDoesChange()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData { Data = FormDataExamples.ExistingBranchChangeData })
            .WithSaveFormDataAsync("branchTest", "applicant-123", FormDataExamples.BranchChangeDataGoesToIncompletePageInDifferentBranch);
        
        var formDataStore = formDataStoreMock.Build();

        var processChangeInForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "branchTest",
            PageId = "do-you-want-branch-a",
            ApplicantId = "applicant-123",
            Form = FormDataExamples.DoYouWantBranchA_No_Form_Changed
        };

        // Act
        var response = await processChangeInForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("branch-b", response.NextPageId);
        formDataStoreMock.VerifySaveFormDataAsync("branchTest", "applicant-123", FormDataExamples.BranchChangeDataGoesToIncompletePageInDifferentBranch);
    }

    [Fact]
    public async Task HandleAsync_ShouldGoToNextRepeatingPage_When_UserChangesFirstRepeatingPage()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormData_OneEntry_AddRepeatSection_Called })
            .WithSaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.WhatAreYouGoingToDoToday_AddedAndSaved);
        
        var formDataStore = formDataStoreMock.Build();

        var processChangeInForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = "applicant-123",
            Form = RepeatingSectionExamples.WhatAreYouGoingToDoToday_Form_AddedData
        };

        // Act
        var response = await processChangeInForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("tasks-repeat", response.NextPageId);
        Assert.Equal("1-how-long-will-it-take", response.ExtraData);
        formDataStoreMock.VerifySaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.WhatAreYouGoingToDoToday_AddedAndSaved);
    }

    [Fact]
    public async Task HandleAsync_ShouldGoToSummary_When_UserChangesLastRepeatingPage()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormData_OneEntry_WhatAreYouGoingToDoToday_Added })
            .WithSaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.HowLongWillItTake_AddedAndSaved);
        
        var formDataStore = formDataStoreMock.Build();

        var processChangeInForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = "applicant-123",
            Form = RepeatingSectionExamples.HowLongWillItTake_Form_AddedData
        };

        // Act
        var response = await processChangeInForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("summary", response.NextPageId);
        formDataStoreMock.VerifySaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.HowLongWillItTake_AddedAndSaved);
    }

    [Fact]
    public async Task HandleAsync_ShouldReturnToRepeatingPage_When_DataIsInvalid()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormData_OneEntry_WhatAreYouGoingToDoToday_Added })
            .WithSaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.HowLongWillItTakeInvalid_AddedAndSaved);
        
        var formDataStore = formDataStoreMock.Build();

        var processChangeInForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = "applicant-123",
            Form = RepeatingSectionExamples.HowLongWillItTakeInvalid_Form_AddedData
        };

        // Act
        var response = await processChangeInForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("1-how-long-will-it-take", response.ExtraData);
        formDataStoreMock.VerifySaveFormDataAsync("repeatingInlinePage", "applicant-123", RepeatingSectionExamples.HowLongWillItTakeInvalid_AddedAndSaved);
    }

    [Fact]
    public async Task HandleAsync_ShouldReturnInvalidPage_When_ChangingBranch()
    {
        // Arrange
        var formDataStoreMock = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync("applicant-123", new Model.FormData() { Data = FormDataExamples.ExistingBranchInvalidChangeData })
            .WithSaveFormDataAsync("repeatingInlinePage", "applicant-123", FormDataExamples.BranchChangeDataGoesToInvalidPage);
        
        var formDataStore = formDataStoreMock.Build();

        var processChangeInForm = new ProcessChangeInFormTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new ProcessChangeInFormRequestModel
        {
            FormId = "branchTest",
            PageId = "do-you-want-branch-a",
            ApplicantId = "applicant-123",
            Form = FormDataExamples.DoYouWantBranchA_Yes_Form_Changed
        };

        // Act
        var response = await processChangeInForm.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.Equal("branch-a", response.NextPageId);
        formDataStoreMock.VerifySaveFormDataAsync("branchTest", "applicant-123", FormDataExamples.BranchChangeDataGoesToInvalidPage);
    }
}