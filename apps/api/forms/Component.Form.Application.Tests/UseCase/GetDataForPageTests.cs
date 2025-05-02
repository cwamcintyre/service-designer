using Component.Form.Application.UseCase.GetDataForPage;
using Component.Form.Application.UseCase.GetDataForPage.Model;
using Component.Form.Application.Tests.Doubles.Infrastructure;
using Component.Form.Application.Tests.Doubles.UseCase;
using Component.Form.Application.PageHandler;
using Xunit;
using Component.Form.Application.ComponentHandler;
using Component.Form.Model;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.UseCase;

[ExcludeFromCodeCoverage]
public class GetDataForPageTests
{
    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenFormDataNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, null)
            .Build();

        var formStore = new FormStoreTestBuilder()
            .WithGetFormAsync("test", null)
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormStore(formStore)
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "nonexistent-form",
            PageId = "page1",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => getDataForPage.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenFormNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.EmptyForm })
            .Build();

        var formStore = new FormStoreTestBuilder()
            .WithGetFormAsync("test", null)
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormStore(formStore)
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "nonexistent-form",
            PageId = "page1",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => getDataForPage.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenPageNotFound()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()       
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.EmptyForm })
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "test",
            PageId = "nonexistent-page",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => getDataForPage.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenPageHandlerIsInvalid()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()       
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.EmptyForm })
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "incorrectPageHandlerTest",
            PageId = "what-is-your-name",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<NoPageHandlerException>(() => getDataForPage.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldThrowArgumentException_WhenAnUnknownComponentIsConfigured()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.UnknownComponentData })
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "unknownComponentTest",
            PageId = "what-is-your-name",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act & Assert
        await Assert.ThrowsAsync<NoComponentHandlerFoundException>(() => getDataForPage.HandleAsync(request));
    }

    [Fact]
    public async Task HandleAsync_ShouldReturnEmptyDataSuccessfully()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.EmptyForm })
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "test",
            PageId = "do-you-want-to-fill-in-this-form",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.Empty(response.Errors);
    }

    [Fact]
    public async Task HandleAsync_ShouldReturnValidationErrors_IfDataIsInvalid()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.WhatIsYourName_Invalid } )
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "textComponent",
            PageId = "what-is-your-name",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.Equal(response.FormData["what_is_your_name"].ToString(), FormDataExamples.WhatIsYourName_Form_Invalid["what_is_your_name"]);
        Assert.NotEmpty(response.Errors);
    }

    [Fact]
    public async Task HandleAsync_ReturnsCorrectPreviousPageId_ForNextQuestion()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.WhatIsYourName_Valid })
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "twoQuestionsTest",
            PageId = "what-is-your-quest",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.Empty(response.Errors);
        Assert.Equal("what-is-your-name", response.PreviousPage);
    }

    [Fact]
    public async Task HandleAsync_ReturnsCorrectPreviousPageId_WhenBranchConditionIsMet()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = FormDataExamples.ExistingBranchPreviousLinkData})
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "branchTest",
            PageId = "branch-b-subsequent-q",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.Empty(response.Errors);
        Assert.Equal("branch-b", response.PreviousPage);
    }

    [Fact]
    public async Task HandleAsync_ReturnsCorrectly_ForFirstPageInFirstRepeatingSection()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.EmptyForm})
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.Equal("", response.PreviousPage); // no previous page in this form..
        Assert.Null(response.PreviousExtraData);
    }

    [Fact]
    public async Task HandleAsync_ReturnsValidationErrors_InRepeatingSections()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormDataInvalid_OneEntry})
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = FormDataExamples.ApplicantId,
            ExtraData = "0-how-long-will-it-take"
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.NotEmpty(response.Errors);
        Assert.Equal("tasks-repeat", response.PreviousPage);
        Assert.Equal("", response.PreviousExtraData);
    }

    [Fact]
    public async Task HandleAsync_ReturnsCorrectPreviousPageId_AfterTheFirstQuestionInTheFirstRepeatingSection()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormData_OneEntry})
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = FormDataExamples.ApplicantId,
            ExtraData = "0-how-long-will-it-take"
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.Empty(response.Errors);
        Assert.Equal("tasks-repeat", response.PreviousPage);
        Assert.Equal("", response.PreviousExtraData);
    }

    [Fact]
    public async Task HandleAsync_ReturnsCorrectPreviousPageId_AfterTheSecondQuestionInTheFirstRepeatingSection()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormData_OneEntry})
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "repeatingInlinePage",
            PageId = "tasks-repeat",
            ApplicantId = FormDataExamples.ApplicantId,
            ExtraData = "0-do-you-want-to-add-another-task"
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.Empty(response.Errors);
        Assert.Equal("tasks-repeat", response.PreviousPage);
        Assert.Equal("0-how-long-will-it-take", response.PreviousExtraData);
    }

    [Fact]
    public async Task HandleAsync_ReturnsCorrectPreviousPageId_WhenAfterARepeatingSection()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormDataForTestJson_Three_Entries})
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "test",
            PageId = "what-is-your-address",
            ApplicantId = FormDataExamples.ApplicantId
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.Empty(response.Errors);
        Assert.Equal("tasks-repeat", response.PreviousPage);
        Assert.Equal("2-do-you-want-to-add-another-task", response.PreviousExtraData);
    }

    [Fact]
    public async Task HandleAsync_ReturnsCorrectPreviousPageIdAndRedirects_WhenUserHasUsedTheBackLinkAndChangedTheConditionOnOneSection()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormDataForTestJsonWhereUserWentBackAndSaidNo_Three_Entries})
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "test",
            PageId = "what-is-your-address",
            ApplicantId = FormDataExamples.ApplicantId,
            ExtraData = "2-do-you-want-to-add-another-task"
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.Empty(response.Errors);
        Assert.Equal("tasks-repeat", response.PreviousPage);
        Assert.Equal("0-do-you-want-to-add-another-task", response.PreviousExtraData);
        Assert.True(response.ForceRedirect);
    }

        [Fact]
    public async Task HandleAsync_ReturnsCorrectPreviousPageIdAndRedirects_WhenUserHasUsedTheBackLinkAndChangedTheConditionOnOneSection_ThenUsesTheBackLinkAgain()
    {
        // Arrange
        var formDataStore = new FormDataStoreTestBuilder()
            .WithGetFormDataAsync(FormDataExamples.ApplicantId, new Model.FormData() { Data = RepeatingSectionExamples.ExistingFormDataForTestJsonWhereUserWentBackAndSaidNo_Three_Entries})
            .Build();

        var getDataForPage = new GetDataForPageTestBuilder()
            .WithFormDataStore(formDataStore)
            .Build();

        var request = new GetDataForPageRequestModel
        {
            FormId = "test",
            PageId = "tasks-repeat",
            ApplicantId = FormDataExamples.ApplicantId,
            ExtraData = "2-do-you-want-to-add-another-task"
        };

        // Act
        var response = await getDataForPage.HandleAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotNull(response.FormData);
        Assert.Empty(response.Errors);
        Assert.Equal("tasks-repeat", response.PreviousPage);
        Assert.Equal("0-do-you-want-to-add-another-task", response.PreviousExtraData);
    }
}