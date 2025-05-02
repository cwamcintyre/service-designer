using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Component.Form.Model.ComponentHandler;
using Component.Form.Application.ComponentHandler.Default;
using Component.Form.Model;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.ComponentHandler.Tests;

[ExcludeFromCodeCoverage]
public class DefaultHandlerTests
{
    private readonly DefaultHandler _handler;
    
    public DefaultHandlerTests()
    {
        _handler = new DefaultHandler();
    }

    [Fact]
    public void GetDataType_ReturnsStringType()
    {
        var result = _handler.GetDataType();
        Assert.Equal("System.String, System.Private.CoreLib", result);
    }

    [Fact]
    public async Task Validate_ReturnsEmptyList_WhenNoValidationRules()
    {
        var result = await _handler.Validate("name", new object(), new List<ValidationRule>());
        Assert.Empty(result);
    }
}
