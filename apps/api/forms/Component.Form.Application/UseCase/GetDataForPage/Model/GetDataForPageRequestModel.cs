using System;
using Component.Form.Application.PageHandler;

namespace Component.Form.Application.UseCase.GetDataForPage.Model;

public class GetDataForPageRequestModel
{
    public string FormId { get; set; }
    public string ApplicantId { get; set; }
    public string PageId { get; set; }  
    public string ExtraData { get; set; }
}
