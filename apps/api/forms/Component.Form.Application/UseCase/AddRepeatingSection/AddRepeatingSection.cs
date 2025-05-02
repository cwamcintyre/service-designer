using System.Dynamic;
using Component.Core.Application;
using Component.Form.Application.Helpers;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.AddRepeatingSection.Model;
using Component.Form.Model.PageHandler;
using Microsoft.Extensions.Logging;

namespace Component.Form.Application.UseCase.AddRepeatingSection;

public class AddRepeatingSection : IRequestResponseUseCase<AddRepeatingSectionRequestModel, AddRepeatingSectionResponseModel>
{
    private readonly IFormStore _formStore;
    private readonly IFormDataStore _formDataStore;
    private readonly SafeJsonHelper _safeJsonHelper;
    private readonly ILogger<AddRepeatingSection> _logger;

    public AddRepeatingSection(IFormStore formStore, IFormDataStore formDataStore, SafeJsonHelper safeJsonHelper, ILogger<AddRepeatingSection> logger)
    {
        _logger = logger;
        _formStore = formStore;
        _formDataStore = formDataStore;
        _safeJsonHelper = safeJsonHelper;
    }

    public async Task<AddRepeatingSectionResponseModel> HandleAsync(AddRepeatingSectionRequestModel request)
    {
        _logger.LogInformation($"Adding repeating section for form {request.FormId}, page {request.PageId} and applicant {request.ApplicantId}");

        if (request.FormId == null)
        {
            throw new ArgumentNullException(nameof(request.FormId));
        }

        var form = await _formStore.GetFormAsync(request.FormId);
        var formDataModel = await _formDataStore.GetFormDataAsync(request.ApplicantId);

        if (form == null)
        {
            throw new ArgumentException($"Form {request.FormId} not found");
        }

        var page = form.Pages.Find(p => p.PageId == request.PageId);

        if (page == null)
        {
            throw new ArgumentException($"Page {request.PageId} not found in form {request.FormId}");
        }

        var formData = _safeJsonHelper.SafeDeserializeObject<ExpandoObject>(formDataModel.Data);
        var formDataDict = formData as IDictionary<string, object>;

        var repeatingPage = page as InlineRepeatingPageSection;
        if (repeatingPage == null)
        {
            throw new ArgumentException($"Page {request.PageId} in form {request.FormId} is not a repeating page");
        }

        if (!formDataDict.ContainsKey(repeatingPage.RepeatKey))
        {
            formDataDict[repeatingPage.RepeatKey] = new List<object>();
        }

        var repeatList = formDataDict[repeatingPage.RepeatKey] as List<object>;

        if (repeatList == null)
        {
            throw new ArgumentException($"Invalid data structure for repeating page {repeatingPage.RepeatKey} in form {request.FormId} for {request.ApplicantId}");
        }

        if (repeatList.Count > 0)
        {
            var lastItem = repeatList[^1] as IDictionary<string, object>;
            foreach (var kvPair in repeatingPage.DataThatMeetsCondition)
            {
                if (lastItem != null && lastItem.ContainsKey(kvPair.Key))
                {
                    lastItem[kvPair.Key] = kvPair.Value;
                }
            }
        }

        var newItem = new ExpandoObject();
        var newItemDict = newItem as IDictionary<string, object>;
        foreach (var kvPair in repeatingPage.DataThatDoesNotMeetCondition)
        {
            newItemDict[kvPair.Key] = kvPair.Value;
        }

        repeatList.Add(newItem);

        await _formDataStore.SaveFormDataAsync(request.FormId, request.ApplicantId, _safeJsonHelper.SafeSerializeObject(formDataDict));

        _logger.LogInformation($"Added repeating section for form {request.FormId}, page {request.PageId} and applicant {request.ApplicantId}");

        return new AddRepeatingSectionResponseModel { Success = true, NewRepeatIndex = repeatList.Count - 1, StartPageId = repeatingPage.RepeatingPages.Find(p => p.RepeatStart).PageId };
    }
}