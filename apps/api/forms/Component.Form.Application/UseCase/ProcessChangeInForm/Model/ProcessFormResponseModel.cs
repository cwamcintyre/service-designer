using System;
using Component.Form.Application.PageHandler;
using Component.Form.Model;

namespace Component.Form.Application.UseCase.ProcessForm.Model;

public class ProcessChangeInFormResponseModel
{
    public dynamic Data { get; set; }
    public string NextPageId { get; set; }
    public string ExtraData { get; set; }
    public bool HasErrors { get; set; }
}

