using Component.Core.Application;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.ProcessForm.Model;
using Newtonsoft.Json;
using Component.Form.Application.Helpers;
using Component.Form.Application.ComponentHandler;
using Component.Form.Application.PageHandler;
using Microsoft.Extensions.Logging;
namespace Component.Form.Application.UseCase.ProcessForm;

public class ProcessForm : IRequestResponseUseCase<ProcessFormRequestModel, ProcessFormResponseModel>
{
    private IFormStore _formStore;
    private readonly IFormDataStore _formDataStore;
    private readonly IComponentHandlerFactory _componentHandlerFactory;
    private readonly IPageHandlerFactory _pageHandlerFactory;
    private readonly SafeJsonHelper _safeJsonHelper; 
    private readonly ILogger<ProcessForm> _logger;
    
    public ProcessForm(
        IPageHandlerFactory pageHandlerFactory, 
        IComponentHandlerFactory componentHandlerFactory, 
        IFormStore formStore, 
        IFormDataStore formDataStore,
        SafeJsonHelper safeJsonHelper,
        ILogger<ProcessForm> logger)
    {
        _formStore = formStore;
        _formDataStore = formDataStore;
        _componentHandlerFactory = componentHandlerFactory;
        _pageHandlerFactory = pageHandlerFactory;
        _safeJsonHelper = safeJsonHelper;
        _logger = logger;
    }

    public async Task<ProcessFormResponseModel> HandleAsync(ProcessFormRequestModel request)
    {
        _logger.LogInformation("Processing new data in form for formId: {FormId}, pageId: {PageId}, applicantId: {ApplicantId}", request.FormId, request.PageId, request.ApplicantId);

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

        var response = await pageHandler.Process(basePage, data, request.Form);

        // store the current form data. errors and all...
        _logger.LogInformation($"Saving form data for form {request.FormId} and applicant: {request.ApplicantId}");
        await _formDataStore.SaveFormDataAsync(request.FormId, request.ApplicantId, _safeJsonHelper.SafeSerializeObject(response.Data));

        return new ProcessFormResponseModel()
        {
            NextPageId = response.NextPageId,
            ExtraData = response.ExtraData
        };  
    }       
}