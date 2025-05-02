using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Component.Form.Model
{

    public class Condition
    {
        [JsonProperty("id")]
        public string Id { get; set; } = string.Empty;
        [JsonProperty("label")]
        public string Label { get; set; } = string.Empty;
        [JsonProperty("expression")]
        public string Expression { get; set; } = string.Empty;
        [JsonProperty("nextPageId")]
        public string NextPageId { get; set; } = string.Empty;
    }
}
