using System;

namespace Component.Form.Application.UseCase.GetDataForPage.Model;

public class GetDataForPageResponseModel
{
    public Dictionary<string, object> FormData { get; set; } = new Dictionary<string, object>();
    public Dictionary<string, List<string>> Errors { get; set; } = new Dictionary<string, List<string>>();
    public string PreviousPage { get; set; }
    public string PreviousExtraData { get; set; }
    public bool ForceRedirect { get; set; }
}
