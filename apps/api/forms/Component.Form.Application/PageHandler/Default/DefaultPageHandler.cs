using Component.Form.Application.ComponentHandler;
using Component.Form.Application.Helpers;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.GetDataForPage.Model;
using Component.Form.Application.UseCase.ProcessForm.Model;
using Component.Form.Model;

namespace Component.Form.Application.PageHandler.Default;

public class DefaultPageHandler : IPageHandler
{
    private readonly IFormStore _formStore;
    private readonly IFormDataStore _formDataStore;
    private readonly IComponentHandlerFactory _componentHandlerFactory;
    
    public DefaultPageHandler(IFormStore formStore, IFormDataStore formDataStore, IComponentHandlerFactory componentHandlerFactory)
    {
        _formStore = formStore;
        _formDataStore = formDataStore;
        _componentHandlerFactory = componentHandlerFactory;
    }

    public bool IsFor(string type)
    {
        return String.IsNullOrEmpty(type) || type.Equals("default", StringComparison.OrdinalIgnoreCase);
    }

    public static string GetSafeType()
    {
        return SafeJsonHelper.GetSafeType(typeof(PageBase));
    }

    public async Task<GetDataForPageResponseModel> Get(PageBase page, dynamic data, string extraData)
    {        
        var parsedDataAsDictionary = (IDictionary<string, object>)data;

        var errors = new Dictionary<string, List<string>>();

        // Loop through questions and validate them
        foreach (var question in page.Components.Where(c => c.IsQuestionType))
        {
            string inputName = question.Name;
            IComponentHandler handler = _componentHandlerFactory.GetFor(question.Type);

            // as we're in the GET side, if the key does not exist its because it's a new page
            if (!parsedDataAsDictionary.ContainsKey(inputName))
            {
                continue;
            }

            List<string> validationResult = await handler.Validate(inputName, parsedDataAsDictionary, question.ValidationRules);
            if (validationResult.Count > 0)
            {
                errors.Add(inputName, validationResult);
            }
        }
  
        var forThisPage = new Dictionary<string, object>();

        foreach (var question in page.Components.Where(c => c.IsQuestionType))
        {
            string inputName = question.Name;

            if (parsedDataAsDictionary.ContainsKey(inputName))
            {
                forThisPage.Add(inputName, parsedDataAsDictionary[inputName]);
            }
        }

        return new GetDataForPageResponseModel
        {
            FormData = forThisPage,
            Errors = errors,
        };
    }

    public async Task<ProcessFormResponseModel> Process(PageBase page, dynamic existingData, Dictionary<string, string> formData)
    {
        var existingDataAsDictionary = (IDictionary<string, object>)existingData;

        var newData = GetData(page, formData, _componentHandlerFactory);

        foreach (var item in newData)
        {
            existingDataAsDictionary[item.Key] = item.Value;
        }

        var errors = new Dictionary<string, List<string>>();

        // Loop through questions and validate them
        foreach (var question in page.Components.Where(c => c.IsQuestionType))
        {
            string inputName = question.Name;
            IComponentHandler handler = _componentHandlerFactory.GetFor(question.Type);

            // Evaluate validation rules
            if (!question?.Optional ?? true)
            {
                var validationResult = await handler.Validate(inputName, existingData, question.ValidationRules);
                if (validationResult.Count > 0)
                {
                    errors.Add(inputName, validationResult);
                }
            }
        }

        // If there are validation errors, return to the same page
        if (errors.Any())
        {
            return new ProcessFormResponseModel
            {
                Data = existingData,
                NextPageId = page.PageId,
            };
        }

        var nextPageIdResult = await GetNextPageId(page, existingData, null);
        return new ProcessFormResponseModel
        {
            Data = existingData,
            NextPageId = nextPageIdResult.NextPageId,
        };
    }

    public async Task<ProcessChangeInFormResponseModel> ProcessChange(FormModel formModel, PageBase page, dynamic existingData, Dictionary<string, string> formData)
    {
        var existingDataAsDictionary = (IDictionary<string, object>)existingData;

        var newData = GetData(page, formData, _componentHandlerFactory);

        foreach (var item in newData)
        {
            existingDataAsDictionary[item.Key] = item.Value;
        }

        var errors = new Dictionary<string, List<string>>();

        // Loop through questions and validate them
        foreach (var question in page.Components.Where(c => c.IsQuestionType))
        {
            string inputName = question.Name;
            IComponentHandler handler = _componentHandlerFactory.GetFor(question.Type);

            // Evaluate validation rules
            if (!question?.Optional ?? true)
            {
                var validationResult = await handler.Validate(inputName, existingData, question.ValidationRules);
                if (validationResult.Count > 0)
                {
                    errors.Add(inputName, validationResult);
                }
            }
        }

        // If there are validation errors, return to the same page
        if (errors.Any())
        {
            return new ProcessChangeInFormResponseModel
            {
                Data = existingData,
                NextPageId = page.PageId,
                HasErrors = true
            };
        }
        
        return new ProcessChangeInFormResponseModel
        {
            Data = existingData
        };
    }

    public async Task<NextPageIdResult> GetNextPageId(PageBase page, dynamic data, string extraData, string endExtraDataCondition = "")
    {
        var conditionMetResult = await MeetsCondition(page, data);
        if (conditionMetResult.MetCondition)
        {
            return new NextPageIdResult
            {
                NextPageId = conditionMetResult.NextPageId,
                ExtraData = null
            };
        }

        return new NextPageIdResult
        {
            NextPageId = page.NextPageId,
            ExtraData = null
        };
    }

    private Dictionary<string, object> GetData(PageBase currentPage, Dictionary<string, string> newData, IComponentHandlerFactory _componentHandlerFactory) 
    {
        var data = new Dictionary<string, object>();

        foreach (var question in currentPage.Components.Where(c => c.IsQuestionType))
        {
            string inputName = question.Name;

            if (newData.ContainsKey(inputName))
            {
                IComponentHandler handler = _componentHandlerFactory.GetFor(question.Type);

                if (handler.GetDataType().Equals(SafeJsonHelper.GetSafeType(typeof(string)))) 
                {
                    data[inputName] = newData[inputName];
                }
                else 
                {
                    data[inputName] = FormHelper.ParseData(newData[inputName], _componentHandlerFactory);
                }
            }
        }

        return data;
    }

    private async Task<ConditionResult> MeetsCondition(PageBase currentPage, IDictionary<string, object> data)
    {
        if (currentPage.Conditions != null)
        {
            var nextPageId = "";
            bool metCondition = false;

            foreach (var condition in currentPage.Conditions)
            {
                if (await ExpressionHelper.EvaluateCondition(condition.Expression, data))
                {
                    nextPageId = condition.NextPageId;
                    metCondition = true;
                }
            }

            if (metCondition)
            {
                return new ConditionResult()
                {
                    MetCondition = true,
                    NextPageId = nextPageId
                };
            }
        }

        return new ConditionResult { MetCondition = false };
    }

    public async Task<WalkResult> WalkToNextInvalidOrUnfilledPage(FormModel formModel, PageBase currentPage, IDictionary<string, object> data, string extraData)
    {
        // if data does not exist, return the current page and stop
        // if data is invalid, return the current page and stop
        foreach (var question in currentPage.Components.Where(c => c.IsQuestionType))
        {
            string inputName = question.Name;
            if (!data.ContainsKey(inputName))
            {
                return new WalkResult
                {
                    Page = currentPage,
                    Stop = true
                };
            }

            IComponentHandler handler = _componentHandlerFactory.GetFor(question.Type);

            if (!question?.Optional ?? true)
            {
                var validationResult = await handler.Validate(inputName, data, question.ValidationRules);
                if (validationResult.Count > 0)
                {
                    return new WalkResult
                    {
                        Page = currentPage,
                        Stop = true
                    };
                }
            }
        }

        // if there are conditions check whether we have met them. If so, return the next conditional page..
        if (currentPage.Conditions != null)
        {
            foreach (var condition in currentPage.Conditions)
            {
                if (await ExpressionHelper.EvaluateCondition(condition.Expression, data))
                {
                    return new WalkResult
                    {
                        Page = formModel.Pages.FirstOrDefault(p => p.PageId == condition.NextPageId),
                        Stop = false
                    };
                }
            }
        }

        // go to tne next page and continue..
        return new WalkResult
        {
            Page = formModel.Pages.FirstOrDefault(p => p.PageId == currentPage.NextPageId),
            Stop = false
        };
    }

    public async Task<Dictionary<string, object>> GetSubmissionData(PageBase page, IDictionary<string, object> data)
    {
        var submissionData = new Dictionary<string, object>();

        foreach (var question in page.Components.Where(c => c.IsQuestionType))
        {
            string inputName = question.Name;
            if (data.ContainsKey(inputName))
            {
                submissionData.Add(inputName, data[inputName]);
            }
        }

        return submissionData;
    }
}