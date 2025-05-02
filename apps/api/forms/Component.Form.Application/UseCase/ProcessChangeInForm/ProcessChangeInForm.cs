using System;
using Component.Core.Application;
using Component.Form.Application.ComponentHandler;
using Component.Form.Application.Helpers;
using Component.Form.Application.PageHandler;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.ProcessForm.Model;
using Microsoft.Extensions.Logging;

namespace Component.Form.Application.UseCase.ProcessChangeInForm;

public class ProcessChangeInForm : IRequestResponseUseCase<ProcessChangeInFormRequestModel, ProcessChangeInFormResponseModel>
{
    private IFormStore _formStore;
    private readonly IFormDataStore _formDataStore;
    private readonly IComponentHandlerFactory _componentHandlerFactory;
    private readonly IPageHandlerFactory _pageHandlerFactory;
    private readonly SafeJsonHelper _safeJsonHelper;
    private ILogger<ProcessChangeInForm> _logger;
    
    public ProcessChangeInForm(
        IPageHandlerFactory pageHandlerFactory, 
        IComponentHandlerFactory componentHandlerFactory, 
        IFormStore formStore, 
        IFormDataStore formDataStore,
        SafeJsonHelper safeJsonHelper,
        ILogger<ProcessChangeInForm> logger)
    {
        _formStore = formStore;
        _formDataStore = formDataStore;
        _componentHandlerFactory = componentHandlerFactory;
        _pageHandlerFactory = pageHandlerFactory;
        _safeJsonHelper = safeJsonHelper;
        _logger = logger;
    }
    
    public async Task<ProcessChangeInFormResponseModel> HandleAsync(ProcessChangeInFormRequestModel request)
    {
        _logger.LogInformation("Processing change in form for formId: {FormId}, pageId: {PageId}, applicantId: {ApplicantId}", request.FormId, request.PageId, request.ApplicantId);

        var form = await _formStore.GetFormAsync(request.FormId);

        if (form == null)
        {
            throw new ArgumentException($"Form {request.FormId} not found");
        }

        var basePage = form.Pages.FirstOrDefault(p => p.PageId == request.PageId);

        if (basePage == null) 
        {
            throw new ArgumentException($"Page {request.PageId} not found");
        }

        var pageHandler = _pageHandlerFactory.GetFor(basePage.PageType);

        _logger.LogInformation($"Fetching existing data for form {request.FormId} and applicant: {request.ApplicantId}");
        var formDataModel = await _formDataStore.GetFormDataAsync(request.ApplicantId);

        var formData = formDataModel.Data;
        
        dynamic data = FormHelper.ParseData(formData, _componentHandlerFactory);

        var response = await pageHandler.ProcessChange(form, basePage, data, request.Form);

        // store the current form data. errors and all...
        _logger.LogInformation($"Saving form data for form {request.FormId} and applicant: {request.ApplicantId}");
        await _formDataStore.SaveFormDataAsync(request.FormId, request.ApplicantId, _safeJsonHelper.SafeSerializeObject(response.Data));
        
        if (response.HasErrors) 
        {
            _logger.LogWarning($"Form {request.FormId} for applicant {request.ApplicantId} has errors. Returning user to the same page: {basePage.PageId}");
            return new ProcessChangeInFormResponseModel
            {
                Data = response.Data,
                NextPageId = basePage.PageId,
                ExtraData = response.ExtraData
            };
        }
        else 
        {
            _logger.LogInformation($"Form {request.FormId} has no errors, walking to next page");
            var walkResult = await FormHelper.WalkToNextInvalidOrUnfilledPageRecursive(_pageHandlerFactory, form, basePage, response.Data, response.ExtraData);

            _logger.LogInformation($"Walking user to next page result: {walkResult.Page.PageId}");
            return new ProcessChangeInFormResponseModel
            {
                Data = response.Data,
                NextPageId = walkResult.Page.PageId,
                ExtraData = walkResult.ExtraData
            };
        }
    }
}
