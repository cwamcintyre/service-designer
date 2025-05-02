using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Component.Form.Model
{
    public class Submission
    {
        [JsonPropertyName("method")]
        public required string Method { get; set; }
        [JsonPropertyName("endpoint")]
        public required string Endpoint { get; set; }
    }
}
