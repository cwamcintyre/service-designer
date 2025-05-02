using Component.Core.Application;
using Component.Form.Application.UseCase.GetDataForPage.Model;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.Helpers;
using Component.Form.Application.ComponentHandler;
using Component.Form.Application.PageHandler;
using Microsoft.Extensions.Logging;

namespace Component.Form.Application.UseCase.GetData;

public class GetDataForPage : IRequestResponseUseCase<GetDataForPageRequestModel,GetDataForPageResponseModel>
{
    private readonly IFormStore _formStore;
    private readonly IFormDataStore _formDataStore;
    private readonly IComponentHandlerFactory _componentHandlerFactory;
    private readonly IPageHandlerFactory _pageHandlerFactory;
    private readonly ILogger<GetDataForPage> _logger;

    public GetDataForPage(
        IFormDataStore formDataStore, 
        IFormStore formStore, 
        IPageHandlerFactory pageHandlerFactory,
        IComponentHandlerFactory componentHandlerFactory,
        ILogger<GetDataForPage> logger)
    {
        _formStore = formStore;
        _formDataStore = formDataStore;
        _componentHandlerFactory = componentHandlerFactory;
        _pageHandlerFactory = pageHandlerFactory;
        _logger = logger;
    }   

    // TODO: add form ID to the request model and use it to get the form data for the specific form
    public async Task<GetDataForPageResponseModel> HandleAsync(GetDataForPageRequestModel request)
    {
        _logger.LogInformation($"Getting data for form {request.FormId}, page {request.PageId} and applicant {request.ApplicantId}");

        var formData = await _formDataStore.GetFormDataAsync(request.ApplicantId);
        var form = await _formStore.GetFormAsync(request.FormId);
        
        if (formData == null)
        {
            throw new ArgumentException($"Form data for {request.ApplicantId} not found");
        }

        if (form == null)
        {
            throw new ArgumentException($"Form {request.FormId} not found");
        }

        var page = form.Pages.Find(p => p.PageId == request.PageId);

        if (page == null)
        {
            throw new ArgumentException($"Page {request.PageId} not found");
        }

        var pageHandler = _pageHandlerFactory.GetFor(page.PageType);

        var parsedData = FormHelper.ParseData(formData.Data, _componentHandlerFactory);

        var result = await pageHandler.Get(page, parsedData, request.ExtraData);

        _logger.LogInformation($"Calculating previous page for form {request.FormId}, page {request.PageId} and applicant {request.ApplicantId}");

        // calculate previous page..
        var previousPageModel = await FormHelper.CalculatePreviousPage(
            _pageHandlerFactory, 
            form, 
            request.PageId, 
            parsedData, 
            request.ExtraData);

        _logger.LogInformation($"Calculated previous page. Returning data for form {request.FormId}, page {request.PageId} and applicant {request.ApplicantId}");

        return new GetDataForPageResponseModel
        {
            FormData = result.FormData,
            Errors = result.Errors,
            PreviousPage = previousPageModel.PageId,
            PreviousExtraData = previousPageModel.ExtraData,
            ForceRedirect = previousPageModel.ForceRedirect
        };
    }
}
