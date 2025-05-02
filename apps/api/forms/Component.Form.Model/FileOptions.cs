using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Component.Form.Model
{
    public class FileOptions
    {
        [JsonPropertyName("maxSizeMB")]
        public required int MaxSizeMB { get; set; }
        [JsonPropertyName("acceptedFormats")]
        public required List<string> AcceptedFormats { get; set; }
        [JsonPropertyName("uploadEndpoint")]
        public required string UploadEndpoint { get; set; }
    }
}
