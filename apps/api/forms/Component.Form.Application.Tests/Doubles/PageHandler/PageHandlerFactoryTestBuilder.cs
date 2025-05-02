using System;
using System.Diagnostics.CodeAnalysis;
using Component.Form.Application.PageHandler;
using Component.Form.Model;
using Moq;

namespace Component.Form.Application.Tests.Doubles.PageHandler;

[ExcludeFromCodeCoverage]
public class PageHandlerFactoryTestBuilder
{
    private readonly Mock<IPageHandlerFactory> _mockFactory;

    public PageHandlerFactoryTestBuilder()
    {
        _mockFactory = new Mock<IPageHandlerFactory>();
    }

    public PageHandlerFactoryTestBuilder WithHandlerForType(string pageType, IPageHandler handler)
    {
        _mockFactory.Setup(factory => factory.GetFor(pageType)).Returns(handler);
        return this;
    }

    public IPageHandlerFactory Build()
    {
        return _mockFactory.Object;
    }
}
