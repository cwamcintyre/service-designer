using System.Dynamic;
using Component.Core.Application;
using Component.Form.Application.Helpers;
using Component.Form.Application.PageHandler;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.RemoveRepeatingSection.Model;
using Component.Form.Model.PageHandler;
using Microsoft.Extensions.Logging;

namespace Component.Form.Application.UseCase.RemoveRepeatingSection;

public class RemoveRepeatingSection : IRequestResponseUseCase<RemoveRepeatingSectionRequestModel, RemoveRepeatingSectionResponseModel>
{
    private readonly IFormStore _formStore;
    private readonly IFormDataStore _formDataStore;
    private readonly IPageHandlerFactory _pageHandlerFactory;
    private readonly SafeJsonHelper _safeJsonHelper;
    private readonly ILogger<RemoveRepeatingSection> _logger;

    public RemoveRepeatingSection(IFormStore formStore, IFormDataStore formDataStore, IPageHandlerFactory pageHandlerFactory, SafeJsonHelper safeJsonHelper, ILogger<RemoveRepeatingSection> logger)
    {
        _logger = logger;
        _formStore = formStore;
        _formDataStore = formDataStore;
        _pageHandlerFactory = pageHandlerFactory;
        _safeJsonHelper = safeJsonHelper;
    }

    public async Task<RemoveRepeatingSectionResponseModel> HandleAsync(RemoveRepeatingSectionRequestModel request)
    {
        _logger.LogInformation("Removing repeating section for formId: {FormId}, pageId: {PageId}, applicantId: {ApplicantId}", request.FormId, request.PageId, request.ApplicantId);
        
        if (request.FormId == null)
        {
            throw new ArgumentNullException(nameof(request.FormId));
        }

        var form = await _formStore.GetFormAsync(request.FormId);
        if (form == null)
        {
            throw new ArgumentNullException($"Form {request.FormId} not found");
        }

        _logger.LogInformation($"fetching existing data for formId: {request.FormId}, applicantId: {request.ApplicantId}");
        var formDataModel = await _formDataStore.GetFormDataAsync(request.ApplicantId);

        var page = form.Pages.Find(p => p.PageId == request.PageId);

        if (page == null)
        {
            throw new ArgumentException($"Page {request.PageId} not found");
        }

        var formData = _safeJsonHelper.SafeDeserializeObject<ExpandoObject>(formDataModel.Data);
        var formDataDict = formData as IDictionary<string, object>;

        var pageHandler = _pageHandlerFactory.GetFor(page.PageType);

        var repeatingPage = page as InlineRepeatingPageSection;
        if (repeatingPage == null)
        {
            throw new ArgumentException($"Page {request.PageId} is not a repeating page");
        }

        if (formDataDict == null || !formDataDict.ContainsKey(repeatingPage.RepeatKey))
        {
            throw new ArgumentException($"No data found for repeating page {repeatingPage.RepeatKey}");
        }

        var repeatList = formDataDict[repeatingPage.RepeatKey] as List<object>;

        if (repeatList == null)
        {
            throw new ArgumentException($"No data found for repeating page at index {request.Index}");
        }

        if (repeatList.Count <= request.Index) 
        {
            throw new ArgumentOutOfRangeException(nameof(request.Index), $"Index {request.Index} is out of range for repeating section with count {repeatList.Count}");
        }

        _logger.LogInformation($"Removing repeating section at index {request.Index}");
        repeatList.RemoveAt(request.Index);

        var meetsCondition = repeatingPage.DataThatMeetsCondition;
        var doesNotMeetCondition = repeatingPage.DataThatDoesNotMeetCondition;

        _logger.LogInformation($"Resetting condition data for repeating section");
        for (int i = 0; i < repeatList.Count; i++)
        {
            var repeatListData = repeatList[i] as IDictionary<string, object>;
            if (i < repeatList.Count - 1)
            {
                foreach (var kvPair in meetsCondition)
                {
                    if (repeatListData.ContainsKey(kvPair.Key))
                    {
                        repeatListData[kvPair.Key] = kvPair.Value;
                    }
                }
            }
            else
            {
                foreach (var kvPair in doesNotMeetCondition)
                {
                    if (repeatListData.ContainsKey(kvPair.Key))
                    {
                        repeatListData[kvPair.Key] = kvPair.Value;
                    }
                }
            }
        }

        _logger.LogInformation($"Saving form data for formId: {request.FormId}, applicantId: {request.ApplicantId}");
        await _formDataStore.SaveFormDataAsync(request.FormId, request.ApplicantId, _safeJsonHelper.SafeSerializeObject(formDataDict));

        return new RemoveRepeatingSectionResponseModel { Success = true };
    }
}