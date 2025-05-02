using Component.Form.Application.Helpers;
using Component.Form.Model;

namespace Component.Form.Application.ComponentHandler.Default;

public class DefaultHandler : IComponentHandler
{
    public string GetDataType()
    {
        return SafeJsonHelper.GetSafeType(typeof(string));
    }

    public bool IsFor(string type)
    {
        return String.IsNullOrEmpty(type) || 
            type.Equals("text") ||
            type.Equals("select") ||
            type.Equals("multilineText") ||
            type.Equals("radio") ||
            type.Equals("checkbox") ||
            type.Equals("yesno") ||
            type.Equals("email") ||
            type.Equals("phonenumber") ||
            type.Equals("fileupload");    
    }

    public async Task<List<string>> Validate(string name, dynamic data, List<ValidationRule> validationRules, bool repeating = false, string repeatKey = "", int repeatIndex = 0)
    {
        if (validationRules == null || validationRules.Count == 0)
        {
            return new List<string>();
        }
        
        return await ExpressionHelper.Validate(data, validationRules, repeatIndex);
    }
}
