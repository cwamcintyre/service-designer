using System;
using System.Diagnostics.CodeAnalysis;
using System.Dynamic;
using Component.Form.Application.Helpers;
using Component.Form.Application.Tests.Doubles.PageHandler;
using Component.Form.Model;

namespace Component.Form.Application.Tests.Helpers;

[ExcludeFromCodeCoverage]
public class FormHelperTests
{
    private readonly DefaultPageHandlerTestBuilder _builder;
    private readonly DefaultPageTestBuilder _defaultPageBuilder;
    private readonly PageHandlerFactoryTestBuilder _pageHandlerFactoryBuilder;

    public FormHelperTests()
    {
        _builder = new DefaultPageHandlerTestBuilder();
        _defaultPageBuilder = new DefaultPageTestBuilder();
        _pageHandlerFactoryBuilder = new PageHandlerFactoryTestBuilder();
    }

    [Fact]
    public async Task WalkToNextInvalidOrUnfilledPageRecursive_ReturnsCurrentPage_WhenDataIsMissing()
    {
        // Arrange
        var page = _defaultPageBuilder
            .WithPageId("page1")
            .WithPageType("default")
            .WithTitle("Test Page")
            .WithNextPageId("page2")
            .WithComponent("question1", new List<ValidationRule>())
            .Build();

        var page2 = _defaultPageBuilder
            .WithPageId("page2")
            .WithPageType("summary")
            .WithTitle("Page 2")
            .WithNextPageId("")
            .Build();

        var formModel = new FormModel
        {
            Pages = new List<PageBase> { page, page2 }
        };

        var data = new ExpandoObject() as IDictionary<string, object>;

        var handler = _builder
            .WithComponentHandlerValidation("question1", new List<string>())
            .Build();

        var pageHandlerFactory = _pageHandlerFactoryBuilder
            .WithHandlerForType("default", handler)
            .Build();

        // Act
        var result = await FormHelper.WalkToNextInvalidOrUnfilledPageRecursive(pageHandlerFactory, formModel, page, data, "");

        // Assert
        Assert.Equal(page, result.Page);
        Assert.True(result.Stop);
    }

    [Fact]
    public async Task WalkToNextInvalidOrUnfilledPageRecursive_ReturnsBranchA_WhenConditionIsMet()
    {
        // Arrange
        var page1 = _defaultPageBuilder
            .WithPageId("page1")
            .WithPageType("default")
            .WithTitle("Page 1")
            .WithNextPageId("page2")
            .WithComponent("question1", new List<ValidationRule>())
            .WithCondition("Data.key == \"branch-a\"", "branchA")
            .Build();

        var branchA = _defaultPageBuilder
            .WithPageId("branchA")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question2", new List<ValidationRule>())
            .Build();

        var branchB = _defaultPageBuilder
            .WithPageId("branchB")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question2", new List<ValidationRule>())
            .Build();

        var page3 = _defaultPageBuilder
            .WithPageId("page3")
            .WithPageType("summary")
            .WithTitle("Page 3")
            .WithNextPageId("page4")
            .Build();

        var formModel = new FormModel
        {
            Pages = new List<PageBase> { page1, branchA, branchB, page3 }
        };

        var data = new ExpandoObject() as IDictionary<string, object>;
        data.Add("question1", "branch-a");

        var handler = _builder
            .WithComponentHandlerValidation("question1", new List<string>())
            .WithComponentHandlerValidation("question2", new List<string>())
            .Build();

        var pageHandlerFactory = _pageHandlerFactoryBuilder
            .WithHandlerForType("default", handler)
            .Build();

        // Act
        var result = await FormHelper.WalkToNextInvalidOrUnfilledPageRecursive(pageHandlerFactory, formModel, page1, data, "");

        // Assert
        Assert.Equal(branchA, result.Page);
        Assert.True(result.Stop);
    }

    [Fact]
    public async Task WalkToNextInvalidOrUnfilledPageRecursive_ReturnsBranchB_WhenConditionIsNotMet()
    {
        // Arrange
        var page1 = _defaultPageBuilder
            .WithPageId("page1")
            .WithPageType("default")
            .WithTitle("Page 1")
            .WithNextPageId("page2")
            .WithComponent("question1", new List<ValidationRule>())
            .WithCondition("Data.key == \"branch-a\"", "branchA")
            .Build();

        var branchA = _defaultPageBuilder
            .WithPageId("branchA")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question2", new List<ValidationRule>())
            .Build();

        var branchB = _defaultPageBuilder
            .WithPageId("branchB")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question2", new List<ValidationRule>())
            .Build();

        var page3 = _defaultPageBuilder
            .WithPageId("page3")
            .WithPageType("summary")
            .WithTitle("Page 3")
            .WithNextPageId("page4")
            .Build();

        var formModel = new FormModel
        {
            Pages = new List<PageBase> { page1, branchA, branchB, page3 }
        };

        var data = new ExpandoObject() as IDictionary<string, object>;
        data.Add("question1", "NOT BRANCH A");

        var handler = _builder
            .WithComponentHandlerValidation("question1", new List<string>())
            .Build();

        var pageHandlerFactory = _pageHandlerFactoryBuilder
            .WithHandlerForType("default", handler)
            .Build();

        // Act
        var result = await FormHelper.WalkToNextInvalidOrUnfilledPageRecursive(pageHandlerFactory, formModel, page1, data, "");

        // Assert
        Assert.Equal(branchB, result.Page);
        Assert.True(result.Stop);
    }

    [Fact]
    public async Task WalkToNextInvalidOrUnfilledPageRecursive_ReturnsPage2_WhenDataIsMissingFromPage2()
    {
        // Arrange
        var page1 = _defaultPageBuilder
            .WithPageId("page1")
            .WithPageType("default")
            .WithTitle("Page 1")
            .WithNextPageId("page2")
            .WithComponent("question1", new List<ValidationRule>())
            .Build();

        var page2 = _defaultPageBuilder
            .WithPageId("page2")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question2", new List<ValidationRule>())
            .Build();

        var page3 = _defaultPageBuilder
            .WithPageId("page3")
            .WithPageType("summary")
            .WithTitle("Page 3")
            .WithNextPageId("page4")
            .Build();

        var formModel = new FormModel
        {
            Pages = new List<PageBase> { page1, page2 }
        };

        var data = new ExpandoObject() as IDictionary<string, object>;
        data.Add("question1", "valid");

        var handler = _builder
            .WithComponentHandlerValidation("question1", new List<string>())
            .WithComponentHandlerValidation("question2", new List<string>())
            .Build();

        var pageHandlerFactory = _pageHandlerFactoryBuilder
            .WithHandlerForType("default", handler)
            .Build();

        // Act
        var result = await FormHelper.WalkToNextInvalidOrUnfilledPageRecursive(pageHandlerFactory, formModel, page1, data, "");

        // Assert
        Assert.Equal(page2, result.Page);
        Assert.True(result.Stop);
    }

    [Fact]
    public async Task WalkToNextInvalidOrUnfilledPageRecursive_ReturnsPage2_WhenDataIsInvalidInPage2()
    {
        // Arrange
        var page1 = _defaultPageBuilder
            .WithPageId("page1")
            .WithPageType("default")
            .WithTitle("Page 1")
            .WithNextPageId("page2")
            .WithComponent("question1", new List<ValidationRule>())
            .Build();

        var page2 = _defaultPageBuilder
            .WithPageId("page2")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question2", new List<ValidationRule>())
            .Build();

        var page3 = _defaultPageBuilder
            .WithPageId("page3")
            .WithPageType("summary")
            .WithTitle("Page 3")
            .WithNextPageId("page4")
            .Build();

        var formModel = new FormModel
        {
            Pages = new List<PageBase> { page1, page2 }
        };

        var data = new ExpandoObject() as IDictionary<string, object>;
        data.Add("question1", "valid");

        var handler = _builder
            .WithComponentHandlerValidation("question1", new List<string>())
            .WithComponentHandlerValidation("question2", new List<string>() { "invalid data" })
            .Build();

        var pageHandlerFactory = _pageHandlerFactoryBuilder
            .WithHandlerForType("default", handler)
            .Build();

        // Act
        var result = await FormHelper.WalkToNextInvalidOrUnfilledPageRecursive(pageHandlerFactory, formModel, page1, data, "");

        // Assert
        Assert.Equal(page2, result.Page);
        Assert.True(result.Stop);
    }

    [Fact]
    public async Task WalkToNextInvalidOrUnfilledPageRecursive_ReturnsSummary_WhenDataIsValid()
    {
        // Arrange
        var page1 = _defaultPageBuilder
            .WithPageId("page1")
            .WithPageType("default")
            .WithTitle("Page 1")
            .WithNextPageId("page2")
            .WithComponent("question1", new List<ValidationRule>())
            .Build();

        var page2 = _defaultPageBuilder
            .WithPageId("page2")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question2", new List<ValidationRule>())
            .Build();

        var page3 = _defaultPageBuilder
            .WithPageId("page3")
            .WithPageType("summary")
            .WithTitle("Page 3")
            .WithNextPageId("page4")
            .Build();

        var formModel = new FormModel
        {
            Pages = new List<PageBase> { page1, page2 }
        };

        var data = new ExpandoObject() as IDictionary<string, object>;
        data.Add("question1", "valid");
        data.Add("question2", "valid");

        var handler = _builder
            .WithComponentHandlerValidation("question1", new List<string>())
            .WithComponentHandlerValidation("question2", new List<string>())
            .Build();

        var pageHandlerFactory = _pageHandlerFactoryBuilder
            .WithHandlerForType("default", handler)
            .Build();

        // Act
        var result = await FormHelper.WalkToNextInvalidOrUnfilledPageRecursive(pageHandlerFactory, formModel, page1, data, "");

        // Assert
        Assert.Equal(page3, result.Page);
        Assert.True(result.Stop);
    }

    [Fact]
    public async Task WalkToNextInvalidOrUnfilledPageRecursive_ReturnsSummary_WhenConditionIsMet_AndDataIsValid()
    {
        // Arrange
        var page1 = _defaultPageBuilder
            .WithPageId("page1")
            .WithPageType("default")
            .WithTitle("Page 1")
            .WithNextPageId("page2")
            .WithComponent("question1", new List<ValidationRule>())
            .WithCondition("Data.key == \"branch-a\"", "branchA")
            .Build();

        var branchA = _defaultPageBuilder
            .WithPageId("branchA")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question2", new List<ValidationRule>())
            .Build();

        var branchB = _defaultPageBuilder
            .WithPageId("branchB")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question3", new List<ValidationRule>())
            .Build();

        var page3 = _defaultPageBuilder
            .WithPageId("page3")
            .WithPageType("summary")
            .WithTitle("Page 3")
            .WithNextPageId("page4")
            .Build();

        var formModel = new FormModel
        {
            Pages = new List<PageBase> { page1, branchA, branchB, page3 }
        };

        var data = new ExpandoObject() as IDictionary<string, object>;
        data.Add("question1", "branch-a");
        data.Add("question2", "value");

        var handler = _builder
            .WithComponentHandlerValidation("question1", new List<string>())
            .WithComponentHandlerValidation("question2", new List<string>())
            .WithComponentHandlerValidation("question3", new List<string>())
            .Build();

        var pageHandlerFactory = _pageHandlerFactoryBuilder
            .WithHandlerForType("default", handler)
            .Build();

        // Act
        var result = await FormHelper.WalkToNextInvalidOrUnfilledPageRecursive(pageHandlerFactory, formModel, page1, data, "");

        // Assert
        Assert.Equal(page3, result.Page);
        Assert.True(result.Stop);
    }

    [Fact]
    public async Task WalkToNextInvalidOrUnfilledPageRecursive_ReturnsSummary_WhenConditionIsNotMet_AndDataIsValid()
    {
        // Arrange
        var page1 = _defaultPageBuilder
            .WithPageId("page1")
            .WithPageType("default")
            .WithTitle("Page 1")
            .WithNextPageId("page2")
            .WithComponent("question1", new List<ValidationRule>())
            .WithCondition("Data.key == \"branch-a\"", "branchA")
            .Build();

        var branchA = _defaultPageBuilder
            .WithPageId("branchA")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question2", new List<ValidationRule>())
            .Build();

        var branchB = _defaultPageBuilder
            .WithPageId("branchB")
            .WithPageType("default")
            .WithTitle("Page 2")
            .WithNextPageId("page3")
            .WithComponent("question3", new List<ValidationRule>())
            .Build();

        var page3 = _defaultPageBuilder
            .WithPageId("page3")
            .WithPageType("summary")
            .WithTitle("Page 3")
            .WithNextPageId("page4")
            .Build();

        var formModel = new FormModel
        {
            Pages = new List<PageBase> { page1, branchA, branchB, page3 }
        };

        var data = new ExpandoObject() as IDictionary<string, object>;
        data.Add("question1", "NOT BRANCH A");
        data.Add("question3", "value");

        var handler = _builder
            .WithComponentHandlerValidation("question1", new List<string>())
            .WithComponentHandlerValidation("question2", new List<string>())
            .WithComponentHandlerValidation("question3", new List<string>())
            .Build();

        var pageHandlerFactory = _pageHandlerFactoryBuilder
            .WithHandlerForType("default", handler)
            .Build();

        // Act
        var result = await FormHelper.WalkToNextInvalidOrUnfilledPageRecursive(pageHandlerFactory, formModel, page1, data, "");

        // Assert
        Assert.Equal(page3, result.Page);
        Assert.True(result.Stop);
    }
}
