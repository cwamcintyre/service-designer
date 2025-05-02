using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Component.Form.Model;

public class ValidationRule
{
    [JsonProperty("id")]
    public string Id { get; set; } = string.Empty;
    [JsonProperty("expression")]
    public string Expression { get; set; } = string.Empty;
    [JsonProperty("errorMessage")]
    public string ErrorMessage { get; set; } = string.Empty;
}
