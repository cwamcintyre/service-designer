using Component.Form.Application.Helpers;
using Component.Form.Model;
using PhoneNumbers;

namespace Component.Form.Application.ComponentHandler.PhoneNumber;

public class PhoneNumberHandler: IComponentHandler
{   
    public string GetDataType()
    {
        return SafeJsonHelper.GetSafeType(typeof(string));
    }

    public bool IsFor(string type)
    {
        return type.Equals("phonenumber", StringComparison.OrdinalIgnoreCase);
    }

    public async Task<List<string>> Validate(string name, object data, List<ValidationRule> validationExpressions, bool repeating = false, string repeatKey = "", int repeatIndex = 0)
    {
        var errors = new List<string>();

        var phoneNumber = "";

        if (repeating)
        {
            var dataList = (IList<object>)((IDictionary<string, object>)data)[repeatKey];
            phoneNumber = ((IDictionary<string, object>)dataList[repeatIndex])[name].ToString();
        }
        else
        {
            phoneNumber = ((IDictionary<string, object>)data)[name].ToString();
        }        

        if (string.IsNullOrEmpty(phoneNumber) || 
            !IsValidPhoneNumber(phoneNumber, "GB") ||
            (!phoneNumber.StartsWith("0") && !phoneNumber.StartsWith("+44")))
        {
            errors.Add($"Enter a UK phone number");
        }

        if (validationExpressions == null || validationExpressions.Count == 0)
        {
            errors.AddRange(await ExpressionHelper.Validate(data, validationExpressions, repeatIndex));
        }

        return errors;
    }

    private static bool IsValidPhoneNumber(string phone, string region)
    {
        try
        {
            var phoneUtil = PhoneNumberUtil.GetInstance();
            var parsedNumber = phoneUtil.Parse(phone, region);
            return phoneUtil.IsValidNumber(parsedNumber);
        }
        catch (NumberParseException)
        {
            return false;
        }
    }
}