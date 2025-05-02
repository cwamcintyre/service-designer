using Newtonsoft.Json.Linq;
using System.Dynamic;
using Component.Form.Application.ComponentHandler.DateParts;
using Component.Form.Model.ComponentHandler;
using Component.Form.Model;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.ComponentHandler.Tests;

[ExcludeFromCodeCoverage]
public class DatePartsHandlerTests
{
    private readonly DatePartsHandler _handler;

    public DatePartsHandlerTests()
    {
        _handler = new DatePartsHandler();
    }

    [Fact]
    public void IsFor_ShouldReturnTrueForDatePartsType()
    {
        var result = _handler.IsFor("dateparts");

        Assert.True(result);
    }

    [Fact]
    public async Task Validate_ShouldReturnValidationErrors()
    {
        var datePartsData = new DatePartsModel { Day = 32, Month = 13, Year = 1800 };
        var validationRules = new List<ValidationRule>();

        dynamic data = new ExpandoObject();
        data.date = datePartsData;

        var result = await _handler.Validate("date", data, validationRules);

        Assert.Contains(DatePartsHandler.ERR_DAY_OUT_OF_BOUNDS, result);
        Assert.Contains(DatePartsHandler.ERR_MONTH_OUT_OF_BOUNDS, result);
        Assert.Contains(DatePartsHandler.ERR_YEAR_OUT_OF_BOUNDS, result);
    }

    [Fact]
    public async Task Validate_ShouldPassForValidData()
    {
        var datePartsData = new DatePartsModel { Day = 15, Month = 8, Year = 2023 };
        var validationRules = new List<ValidationRule>();

        dynamic data = new ExpandoObject();
        data.date = datePartsData;

        var result = await _handler.Validate("date", data, validationRules);

        Assert.Empty(result);
    }

    [Fact]
    public async Task Validate_ShouldReturnValidationErrors_ForRepeatingData()
    {
        var datePartsData = new DatePartsModel { Day = 32, Month = 13, Year = 1800 };

        dynamic data = new ExpandoObject();
        dynamic datePartItemData = new ExpandoObject();
        datePartItemData.date = datePartsData;
        data.repeat = new List<ExpandoObject>()
        {
            datePartItemData
        };

        var result = await _handler.Validate("date", data, null, true, "repeat", 0);

        Assert.Contains(DatePartsHandler.ERR_DAY_OUT_OF_BOUNDS, result);
        Assert.Contains(DatePartsHandler.ERR_MONTH_OUT_OF_BOUNDS, result);
        Assert.Contains(DatePartsHandler.ERR_YEAR_OUT_OF_BOUNDS, result);
    }

    [Fact]
    public async Task Validate_ShouldPassForValidData_ForRepeatingData()
    {
        var datePartsData = new DatePartsModel { Day = 15, Month = 8, Year = 2023 };
        var validationRules = new List<ValidationRule>();

        dynamic data = new ExpandoObject();
        dynamic datePartItemData = new ExpandoObject();
        datePartItemData.date = datePartsData;
        data.repeat = new List<ExpandoObject>()
        {
            datePartItemData
        };

        var result = await _handler.Validate("date", data, validationRules, true, "repeat", 0);

        Assert.Empty(result);
    }
}
