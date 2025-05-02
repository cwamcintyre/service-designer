using System.Collections.Generic;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Component.Form.Model
{
    public class FormModel
    {
        // cosmosdb requires an ID with the fieldname "id" to be present in the model...
        [JsonPropertyName("id")]
        [JsonProperty("id")]
        public string Id { get { return FormId; } }

        [JsonPropertyName("formId")]
        [JsonProperty("formId")]
        public string FormId { get; set; }
        [JsonPropertyName("title")]
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonPropertyName("description")]
        [JsonProperty("description")]
        public string Description { get; set; }
        [JsonPropertyName("currentPage")]
        [JsonProperty("currentPage")]
        public int CurrentPage { get; set; }
        [JsonPropertyName("totalPages")]
        [JsonProperty("totalPages")]
        public int TotalPages { get; set; }
        [JsonPropertyName("startPage")]
        [JsonProperty("startPage")]
        public string StartPage { get; set; }
        [JsonPropertyName("pages")]
        [JsonProperty("pages")] 
        public List<PageBase> Pages { get; set; }

        [JsonPropertyName("submission")]
        [JsonProperty("submission")]
        public Submission Submission { get; set; }
    }
}
