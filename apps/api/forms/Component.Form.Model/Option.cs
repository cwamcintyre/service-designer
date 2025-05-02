using System.Text.Json.Serialization;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json;

namespace Component.Form.Model
{
    public class Option
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("label")]
        public string? Label { get; set; }
        [JsonProperty("value")]
        public string? Value { get; set; }

        public static implicit operator Option((string Label, string Value) tuple)
        {
            return new Option
            {
                Label = tuple.Label,
                Value = tuple.Value
            };
        }

        public static implicit operator (string Label, string Value)(Option option)
        {
            return (option.Label, option.Value);
        }

        public static implicit operator Option(KeyValuePair<string, string> pair)
        {
            return new Option
            {
                Label = pair.Key,
                Value = pair.Value
            };
        }

        public static implicit operator KeyValuePair<string, string>(Option option)
        {
            return new KeyValuePair<string, string>(option.Label, option.Value);
        }        
    }

    public static class OptionExtensions
    {
        public static IEnumerable<Option> FromDictionary(this Dictionary<string, string> dictionary)
        {
            return dictionary.Select(pair => (Option)pair).ToList();
        }
    }
}