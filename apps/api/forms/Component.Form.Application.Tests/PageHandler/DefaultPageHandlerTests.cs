using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using Component.Form.Application.ComponentHandler;
using Component.Form.Application.Helpers;
using Component.Form.Application.PageHandler;
using Component.Form.Application.PageHandler.Default;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.Tests.Doubles.PageHandler;
using Component.Form.Model;
using Moq;
using Xunit;

namespace Component.Form.Application.Tests.PageHandler
{
    [ExcludeFromCodeCoverage]
    public class DefaultPageHandlerTests
    {
        private readonly DefaultPageHandlerTestBuilder _builder;
        private readonly DefaultPageTestBuilder _defaultPageBuilder;
        private readonly PageHandlerFactoryTestBuilder _pageHandlerFactoryBuilder;

        public DefaultPageHandlerTests()
        {
            _builder = new DefaultPageHandlerTestBuilder();
            _defaultPageBuilder = new DefaultPageTestBuilder();
            _pageHandlerFactoryBuilder = new PageHandlerFactoryTestBuilder();
        }

        [Fact]
        public void IsFor_ReturnsTrue_ForDefaultType()
        {
            // Arrange
            var handler = _builder.Build();

            // Act
            var result = handler.IsFor("default");

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsFor_ReturnsTrue_ForEmptyType()
        {
            // Arrange
            var handler = _builder.Build();

            // Act
            var result = handler.IsFor(string.Empty);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void IsFor_ReturnsFalse_ForNonDefaultType()
        {
            // Arrange
            var handler = _builder.Build();

            // Act
            var result = handler.IsFor("custom");

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void GetSafeType_ReturnsCorrectType()
        {
            // Act
            var safeType = DefaultPageHandler.GetSafeType();

            // Assert
            Assert.Equal(SafeJsonHelper.GetSafeType(typeof(PageBase)), safeType);
        }

        [Fact]
        public async Task Get_ReturnsEmptyErrors_WhenValidationPasses()
        {
            // Arrange
            var page = _defaultPageBuilder
                .WithPageId("page1")
                .WithPageType("default")
                .WithTitle("Test Page")
                .WithNextPageId("page2")
                .WithComponent("question1", new List<ValidationRule>())
                .Build();

            var data = new ExpandoObject() as IDictionary<string, object>;
            data.Add("question1", "invalid");

            var handler = _builder
                .WithComponentHandlerValidation("question1", new List<string>())
                .Build();

            // Act
            var result = await handler.Get(page, data, string.Empty);

            // Assert
            Assert.Empty(result.Errors);
        }

        [Fact]
        public async Task Get_ReturnsErrors_WhenValidationFails()
        {
            // Arrange
            var page = _defaultPageBuilder
                .WithPageId("page1")
                .WithPageType("default")
                .WithTitle("Test Page")
                .WithNextPageId("page2")
                .WithComponent("question1", new List<ValidationRule>())
                .Build();

            var data = new ExpandoObject() as IDictionary<string, object>;
            data.Add("question1", "invalid");

            var handler = _builder
                .WithComponentHandlerValidation("question1", new List<string> { "Error" })
                .Build();

            // Act
            var result = await handler.Get(page, data, string.Empty);

            // Assert
            Assert.NotEmpty(result.Errors);
            Assert.Contains("question1", result.Errors.Keys);
        }

        [Fact]
        public async Task Process_ReturnsNextPageId_WhenNoValidationErrors()
        {
            // Arrange
            var page = _defaultPageBuilder
                .WithPageId("currentPage")
                .WithPageType("default")
                .WithTitle("Test Page")
                .WithNextPageId("nextPage")
                .WithComponent("question1", new List<ValidationRule>())
                .Build();

            var existingData = new ExpandoObject() as IDictionary<string, object>;
            var formData = new Dictionary<string, string> { { "question1", "valid" } };

            var handler = _builder
                .WithComponentHandlerValidation("question1", new List<string>())
                .Build();

            // Act
            var result = await handler.Process(page, existingData, formData);

            // Assert
            Assert.Equal("nextPage", result.NextPageId);
        }

        [Fact]
        public async Task Process_ReturnsSamePageId_WhenValidationErrors()
        {
            // Arrange
            var page = _defaultPageBuilder
                .WithPageId("currentPage")
                .WithPageType("default")
                .WithTitle("Test Page")
                .WithNextPageId("nextPage")
                .WithComponent("question1", new List<ValidationRule>())
                .Build();

            var existingData = new ExpandoObject() as IDictionary<string, object>;
            var formData = new Dictionary<string, string> { { "question1", "valid" } };

            var handler = _builder
                .WithComponentHandlerValidation("question1", new List<string>() { "invalid" })
                .Build();

            // Act
            var result = await handler.Process(page, existingData, formData);

            // Assert
            Assert.Equal("currentPage", result.NextPageId);
        }

        [Fact]
        public async Task Process_ReturnsConditionalPageId_WhenConditionIsMet()
        {
            // Arrange
            var page = _defaultPageBuilder
                .WithPageId("currentPage")
                .WithPageType("default")
                .WithTitle("Test Page")
                .WithNextPageId("nextPage")
                .WithCondition("Data.question1 == \"valid\"", "conditionalPage")
                .WithComponent("question1", new List<ValidationRule>())
                .Build();

            var existingData = new ExpandoObject() as IDictionary<string, object>;
            var formData = new Dictionary<string, string> { { "question1", "valid" } };

            var handler = _builder
                .WithComponentHandlerValidation("question1", new List<string>())
                .Build();

            // Act
            var result = await handler.Process(page, existingData, formData);

            // Assert
            Assert.Equal("conditionalPage", result.NextPageId);
        }

        [Fact]
        public async Task Process_ReturnsNextPageId_WhenConditionIsNotMet()
        {
            // Arrange
            var page = _defaultPageBuilder
                .WithPageId("currentPage")
                .WithPageType("default")
                .WithTitle("Test Page")
                .WithNextPageId("nextPage")
                .WithCondition("Data.key == \"something else\"", "conditionalPage")
                .WithComponent("question1", new List<ValidationRule>())
                .Build();

            var existingData = new ExpandoObject() as IDictionary<string, object>;
            var formData = new Dictionary<string, string> { { "key", "valid" } };

            var handler = _builder
                .WithComponentHandlerValidation("question1", new List<string>())
                .Build();

            // Act
            var result = await handler.Process(page, existingData, formData);

            // Assert
            Assert.Equal("nextPage", result.NextPageId);
        }
    }
}