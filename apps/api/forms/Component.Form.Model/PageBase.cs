using System;
using System.Text.Json.Serialization;
using Component.Form.Model;
using Newtonsoft.Json;
namespace Component.Form.Model;

public class PageBase
{
    [JsonProperty("pageId")]
    public string PageId { get; set; }
    [JsonProperty("pageType")]
    public string PageType { get; set; }
    [JsonProperty("title")]
    public string? Title { get; set; }
    [JsonProperty("components")]
    public List<Model.Component>? Components { get; set; }
    [JsonProperty("conditions")]
    public List<Condition>? Conditions { get; set; }
    [JsonProperty("data")]
    public Dictionary<string, string>? Data { get; set; }
    [JsonProperty("nextPageId")]
    public string? NextPageId { get; set; }
}
