using System.Net.Mail;
using Component.Form.Application.ComponentHandler;
using Component.Form.Application.Helpers;
using Component.Form.Model;

namespace Component.Form.Application.ComponentHandler.Email;

public class EmailHandler : IComponentHandler
{  
    public string GetDataType()
    {
        return SafeJsonHelper.GetSafeType(typeof(string));
    }

    public bool IsFor(string type)
    {
        return type.Equals("email", StringComparison.OrdinalIgnoreCase);
    }

    public async Task<List<string>> Validate(string name, object data, List<ValidationRule> validationExpressions, bool repeating = false, string repeatKey = "", int repeatIndex = 0)
    {
        var errors = new List<string>();

        var email = ((IDictionary<string, object>)data)[name].ToString();        

        if (string.IsNullOrEmpty(email) || !IsValidEmail(email))
        {
            errors.Add($"Enter an email address in the correct format, like name@example.com");
        }

        if (validationExpressions == null || validationExpressions.Count == 0)
        {
            errors.AddRange(await ExpressionHelper.Validate(data, validationExpressions, repeatIndex));
        }

        return errors;
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new MailAddress(email);
            return addr.Address == email; // Ensures the email wasn't auto-corrected
        }
        catch
        {
            return false; // Invalid email format
        }
    }
}
