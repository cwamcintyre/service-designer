using System;
using Component.Form.Application.ComponentHandler;
using Component.Form.Application.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Component.Form.Model.ComponentHandler;

public class UkAddressHandler : IComponentHandler
{
    public const string ERR_LINE_1_REQUIRED = "Address Line 1 is required";
    public const string ERR_POSTCODE_REQUIRED = "Postcode is required";

    public string GetDataType()
    {
        return SafeJsonHelper.GetSafeType(typeof(UkAddressModel));
    }

    public bool IsFor(string type)
    {
        return type.Equals("ukaddress", StringComparison.CurrentCultureIgnoreCase);        
    }

    public async Task<List<string>> Validate(string name, object data, List<ValidationRule> validationExpressions, bool repeating = false, string repeatKey = "", int repeatIndex = 0)
    {
        var prefix = repeating ? $"Data.{repeatKey}[{repeatIndex}]" : $"Data";

        var validationRules = new List<ValidationRule>
        {
            new ValidationRule
            {
                Expression = $"{prefix}.{name}.AddressLine1 != null && {prefix}.{name}.AddressLine1.Length > 0",
                ErrorMessage = ERR_LINE_1_REQUIRED
            },
            new ValidationRule
            {
                Expression = $"{prefix}.{name}.Postcode != null && {prefix}.{name}.Postcode.Length > 0",
                ErrorMessage = ERR_POSTCODE_REQUIRED
            }
        };

        if (validationExpressions != null) 
        {
            validationExpressions.AddRange(validationRules);
        }
        else validationExpressions = validationRules;
        
        return await ExpressionHelper.Validate(data, validationExpressions, repeatIndex);
    }
}