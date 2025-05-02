using System;
using Component.Form.Application.Helpers;
using Component.Form.Application.UseCase.GetDataForPage.Model;
using Component.Form.Application.UseCase.ProcessForm.Model;
using Component.Form.Model;

namespace Component.Form.Application.PageHandler;

public interface IPageHandler
{
    bool IsFor(string type);
    Task<ProcessFormResponseModel> Process(PageBase page, dynamic existingData, Dictionary<string, string> formData);
    Task<ProcessChangeInFormResponseModel> ProcessChange(FormModel formModel, PageBase page, dynamic existingData, Dictionary<string, string> formData);
    Task<NextPageIdResult> GetNextPageId(PageBase page, dynamic data, string extraData, string endExtraDataCondition = "");
    Task<WalkResult> WalkToNextInvalidOrUnfilledPage(FormModel formModel, PageBase currentPage, IDictionary<string, object> data, string extraData);
    Task<GetDataForPageResponseModel> Get(PageBase page, dynamic data, string extraData);
    Task<Dictionary<string, object>> GetSubmissionData(PageBase page, IDictionary<string, object> data);
}

public class NextPageIdResult
{
    public string NextPageId { get; set; }
    public string ExtraData { get; set; }
    public bool ForceRedirect { get; set; }
}
