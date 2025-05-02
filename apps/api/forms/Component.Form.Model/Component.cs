using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Component.Form.Model
{
    public class Component
    {
        [JsonProperty("questionId")]
        public string? QuestionId { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("label")]
        public string? Label { get; set; }
        [JsonProperty("name")]
        public string? Name { get; set; }
        [JsonProperty("hint")]
        public string? Hint { get; set; }
        [JsonProperty("required")]
        public bool? Required { get; set; }
        [JsonProperty("labelIsPageTitle")]
        public bool? LabelIsPageTitle { get; set; }
        [JsonProperty("answer")]
        public object? Answer { get; set; }
        [JsonProperty("options")]
        public List<Option>? Options { get; set; }
        [JsonProperty("fileOptions")]
        public FileOptions? FileOptions { get; set; }
        [JsonProperty("content")]
        public string? Content { get; set; }
        [JsonProperty("optional")]
        public bool? Optional { get; set; }
        [JsonProperty("validationRules")]
        public List<ValidationRule>? ValidationRules { get; set; }
        [Newtonsoft.Json.JsonIgnore]
        public bool IsQuestionType { get { return Type != "html" && Type != "summary"; } }

        /// <summary>
        /// Creates a shallow copy of the current component.
        /// </summary>
        /// <returns>Component</returns>
        public Component Clone()
        {
            return new Component
            {
                QuestionId = this.QuestionId,
                Type = this.Type,
                Label = this.Label,
                Name = this.Name,
                Required = this.Required,
                LabelIsPageTitle = this.LabelIsPageTitle,
                Options = this.Options,
                FileOptions = this.FileOptions,
                Content = this.Content,
                Optional = this.Optional,
                ValidationRules = this.ValidationRules
            };
        }
    }
}