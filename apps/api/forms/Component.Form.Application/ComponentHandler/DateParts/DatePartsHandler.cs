using Component.Form.Application.ComponentHandler;
using Component.Form.Application.Helpers;
using Component.Form.Model;
using Component.Form.Model.ComponentHandler;
using Newtonsoft.Json.Linq;

namespace Component.Form.Application.ComponentHandler.DateParts;

public class DatePartsHandler : IComponentHandler
{
    public const string ERR_DAY_REQUIRED = "Day is required";
    public const string ERR_MONTH_REQUIRED = "Month is required";
    public const string ERR_YEAR_REQUIRED = "Year is required";

    public const string ERR_DAY_OUT_OF_BOUNDS = "Day is between 1 and 31";
    public const string ERR_MONTH_OUT_OF_BOUNDS = "Month is between 1 and 12";
    public const string ERR_YEAR_OUT_OF_BOUNDS = "Year is between 1900 and 2100";
    
    public string GetDataType()
    {
        return SafeJsonHelper.GetSafeType(typeof(DatePartsModel));
    }

    public bool IsFor(string type)
    {
        return type.Equals("dateparts", StringComparison.OrdinalIgnoreCase);
    }

    public async Task<List<string>> Validate(string name, object data, List<ValidationRule> validationExpressions, bool repeating = false, string repeatKey = "", int repeatIndex = 0)
    {
        var prefix = repeating ? $"Data.{repeatKey}[{repeatIndex}]" : $"Data";

        var validationRules = new List<ValidationRule>
        {
            new ValidationRule
            {
                Expression = $"{prefix}.{name} != null",
                ErrorMessage = "Date is required"
            },
            new ValidationRule
            {
                Expression = $"{prefix}.{name}.Day != null && {prefix}.{name}.Day > 0 && {prefix}.{name}.Day < 32",
                ErrorMessage = ERR_DAY_OUT_OF_BOUNDS
            },
            new ValidationRule
            {
                Expression = $"{prefix}.{name}.Month != null && {prefix}.{name}.Month > 0 && {prefix}.{name}.Month < 13",
                ErrorMessage = ERR_MONTH_OUT_OF_BOUNDS
            },
            new ValidationRule
            {
                Expression = $"{prefix}.{name}.Year != null && {prefix}.{name}.Year > 1899 && {prefix}.{name}.Year < 2101",
                ErrorMessage = ERR_YEAR_OUT_OF_BOUNDS
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
