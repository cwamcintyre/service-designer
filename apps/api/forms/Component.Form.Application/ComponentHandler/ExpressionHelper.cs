using Microsoft.CodeAnalysis.CSharp.Scripting;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CSharp.RuntimeBinder;
using Component.Form.Model;

namespace Component.Form.Application.ComponentHandler;

public static class ExpressionHelper
{

    public static async Task<List<string>> Validate(dynamic data, List<ValidationRule> validationRules, int repeatIndex = 0)
    {
        var errors = new List<string>();
        if (validationRules == null || validationRules.Count == 0)
        {
            return errors;
        }

        foreach (var rule in validationRules)
        {
            var result = await EvaluateValidation(rule.Expression, data, repeatIndex);
            if (!result)
            {
                errors.Add(rule.ErrorMessage);
            }
        }

        return errors;
    }

    public static async Task<bool> EvaluateValidation(string expression, dynamic data, int repeatIndex = 0)
    {
        var options = ScriptOptions.Default.AddReferences(typeof(object).Assembly)  // System
            .AddReferences("Microsoft.CSharp")
            .AddImports("System", "System.Collections.Generic", "System.Linq", "Microsoft.CSharp.RuntimeBinder");

        var script = CSharpScript.Create<bool>(expression, options, typeof(Globals));
        try 
        {
            var result = await script.RunAsync(new Globals { Data = data, RepeatIndex = repeatIndex });
            return result.ReturnValue;
        }
        catch (FormatException e)
        {
            return false; // A Convert.To<something> failed because the value was not in the correct format.
        }
        catch (RuntimeBinderException e)
        {
            return true; // value did not exist in data because its the first time we've hit the field.
        }
        catch (ArgumentOutOfRangeException e)
        {
            return true; // value did not exist in data because its the first time we've hit the repeat.
        }
    }

    public static async Task<bool> EvaluateCondition(string expression, dynamic data, int repeatIndex = 0)
    {
        var options = ScriptOptions.Default.AddReferences(typeof(object).Assembly)  // System
            .AddReferences("Microsoft.CSharp")
            .AddImports("System", "System.Collections.Generic", "System.Linq", "System.Linq.Expressions", "Microsoft.CSharp.RuntimeBinder");

        var script = CSharpScript.Create<bool>(expression, options, typeof(Globals));
        try 
        {
            var result = await script.RunAsync(new Globals { Data = data, RepeatIndex = repeatIndex });
            return result.ReturnValue;
        }
        catch (RuntimeBinderException e)
        {
            return false; // value did not exist in data because its the first time we've hit the field.
        }
        catch (ArgumentOutOfRangeException e)
        {
            return false; // value did not exist in data because its the first time we've hit the repeat.
        }
    }

    public class Globals
    {
        public dynamic Data { get; set; }
        public int RepeatIndex { get; set; }
    }
}
