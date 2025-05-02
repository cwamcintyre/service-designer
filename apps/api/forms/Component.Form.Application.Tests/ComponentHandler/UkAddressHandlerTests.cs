using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using Component.Form.Model.ComponentHandler;
using Component.Form.Model;
using Component.Form.Application.Helpers;
using System.Dynamic;

namespace Component.Form.Application.ComponentHandler.Tests;

[ExcludeFromCodeCoverage]
public class UkAddressHandlerTests
{
    private readonly UkAddressHandler _handler;

    public UkAddressHandlerTests()
    {
        _handler = new UkAddressHandler();
    }

    [Fact]
    public void GetDataType_ShouldReturnUkAddressModelType()
    {
        var result = _handler.GetDataType();
        Assert.Equal(SafeJsonHelper.GetSafeType(typeof(UkAddressModel)), result);
    }

    [Fact]
    public void IsFor_ShouldReturnTrue_WhenTypeIsUkAddress()
    {
        var result = _handler.IsFor("ukaddress");
        Assert.True(result);
    }

    [Fact]
    public void IsFor_ShouldReturnFalse_WhenTypeIsNotUkAddress()
    {
        var result = _handler.IsFor("email");
        Assert.False(result);
    }

    [Theory]
    [InlineData(null, "Postcode is required")]
    [InlineData("", "Postcode is required")]
    [InlineData("Address Line 1", null)]
    [InlineData("", "")]
    public async Task Validate_ShouldReturnErrors_WhenAddressIsInvalid(string addressLine1, string postcode)
    {
        dynamic ukAddress = new ExpandoObject();
        ukAddress.AddressLine1 = addressLine1;
        ukAddress.Postcode = postcode;

        dynamic data = new ExpandoObject();
        data.address = ukAddress;

        var validationRules = new List<ValidationRule>();
        var result = await _handler.Validate("address", data, validationRules);

        if (string.IsNullOrEmpty(addressLine1))
        {
            Assert.Contains(UkAddressHandler.ERR_LINE_1_REQUIRED, result);
        }

        if (string.IsNullOrEmpty(postcode))
        {
            Assert.Contains(UkAddressHandler.ERR_POSTCODE_REQUIRED, result);
        }
    }

    [Fact]
    public async Task Validate_ShouldReturnNoErrors_WhenAddressIsValid()
    {
        dynamic data = new ExpandoObject();
        data.address = new { AddressLine1 = "123 Test Street", Postcode = "AB12 3CD" };

        var validationRules = new List<ValidationRule>();
        var result = await _handler.Validate("address", data, validationRules);

        Assert.Empty(result);
    }

    [Fact]
    public async Task Validate_ShouldReturnErrors_WhenAddressIsInvalidInRepeatSection()
    {
        dynamic repeatItemData = new ExpandoObject();
        repeatItemData.address = new UkAddressModel { AddressLine1 = "", Postcode = "" };

        dynamic data = new ExpandoObject();
        data.repeat = new List<ExpandoObject> { repeatItemData };

        var validationRules = new List<ValidationRule>();
        var result = await _handler.Validate("address", data, validationRules, true, "repeat", 0);

        Assert.Contains(UkAddressHandler.ERR_LINE_1_REQUIRED, result);
        Assert.Contains(UkAddressHandler.ERR_POSTCODE_REQUIRED, result);
    }

    [Fact]
    public async Task Validate_ShouldReturnNoErrors_WhenAddressIsValidInRepeatSection()
    {
        dynamic repeatItemData = new ExpandoObject();
        repeatItemData.address = new UkAddressModel { AddressLine1 = "123 Test Street", Postcode = "AB12 3CD" };

        dynamic data = new ExpandoObject();
        data.repeat = new List<dynamic> { repeatItemData };

        var validationRules = new List<ValidationRule>();
        var result = await _handler.Validate("address", data, validationRules, true, "repeat", 0);

        Assert.Empty(result);
    }
}