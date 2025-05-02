using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Component.Form.Application.ComponentHandler;
using Component.Form.Application.PageHandler.Default;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Model;
using Moq;

namespace Component.Form.Application.Tests.Doubles.PageHandler;

[ExcludeFromCodeCoverage]
public class DefaultPageHandlerTestBuilder
{
        private readonly Mock<IFormStore> _formStoreMock;
        private readonly Mock<IFormDataStore> _formDataStoreMock;
        private readonly Mock<IComponentHandlerFactory> _componentHandlerFactoryMock;

        public DefaultPageHandlerTestBuilder()
        {
            _formStoreMock = new Mock<IFormStore>();
            _formDataStoreMock = new Mock<IFormDataStore>();
            _componentHandlerFactoryMock = new Mock<IComponentHandlerFactory>();
        }

        public DefaultPageHandlerTestBuilder WithComponentHandlerValidation(string inputName, List<string> validationResult, string dataType = "System.String, System.Private.CoreLib")
        {
            var handlerMock = new Mock<IComponentHandler>();
            handlerMock.Setup(h => 
                h.Validate(
                    inputName, 
                    It.IsAny<IDictionary<string, object>>(), 
                    It.IsAny<List<ValidationRule>>(),
                    It.IsAny<bool>(),
                    It.IsAny<string>(),
                    It.IsAny<int>()
                ))
                .Returns(Task.FromResult(validationResult));
            handlerMock.Setup(h => h.GetDataType()).Returns(dataType);

        _componentHandlerFactoryMock.Setup(f => f.GetFor(It.IsAny<string>())).Returns(handlerMock.Object);

            return this;
        }

        public DefaultPageHandler Build()
        {
            return new DefaultPageHandler(
                _formStoreMock.Object,
                _formDataStoreMock.Object,
                _componentHandlerFactoryMock.Object
            );
        }
}