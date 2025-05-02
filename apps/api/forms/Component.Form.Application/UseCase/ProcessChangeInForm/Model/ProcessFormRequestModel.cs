using System;

namespace Component.Form.Application.UseCase.ProcessForm.Model;

public class ProcessChangeInFormRequestModel
{
    public string FormId { get; set; }
    public string PageId { get; set; }
    public string ApplicantId { get; set; }
    public Dictionary<string, string> Form { get; set; }
}
