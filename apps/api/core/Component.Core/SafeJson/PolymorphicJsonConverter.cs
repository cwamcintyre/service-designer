using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using Component.Form.Application.Helpers;
using JsonConvert = Newtonsoft.Json.JsonConvert;

namespace Component.Core.SafeJson;

public class PolymorphicJsonConverter<TBase> : JsonConverter<TBase>
{
    public override TBase? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using var doc = JsonDocument.ParseValue(ref reader);
        if (!doc.RootElement.TryGetProperty("$type", out var typeProperty))
        {
            throw new JsonException("Missing $type property for polymorphic deserialization.");
        }

        var typeName = typeProperty.GetString();
        if (typeName == null)
        {
            throw new JsonException("$type property is null.");
        }

        var actualType = Type.GetType(typeName);
        if (actualType == null)
        {
            throw new JsonException($"Unknown type: {typeName}");
        }

        return (TBase?)JsonSerializer.Deserialize(doc.RootElement.GetRawText(), actualType, options);
    }

    public override void Write(Utf8JsonWriter writer, TBase value, JsonSerializerOptions options)
    {
       if (value == null)
        {
            writer.WriteNullValue();
            return;
        }

        // // Get actual runtime type
        // var type = value.GetType();
        // var jsonOptions = new JsonSerializerOptions(options) { Converters = { } }; // Avoid recursive calls

        // writer.WriteStartObject();
        // writer.WriteString("$type", SafeJsonHelper.GetSafeType(type)); // Add type hint

        // // Serialize properties manually
        // foreach (var property in type.GetProperties())
        // {
        //     var propValue = property.GetValue(value);
        //     writer.WritePropertyName(property.Name); 
        //     JsonSerializer.Serialize(writer, propValue, property.PropertyType, jsonOptions);
        // }

        // Get actual runtime type
        var type = value.GetType();

        // Serialize using Newtonsoft.Json to respect JsonProperty attributes
        var json = JsonConvert.SerializeObject(value);
        using var doc = JsonDocument.Parse(json);

        writer.WriteStartObject();
        writer.WriteString("$type", SafeJsonHelper.GetSafeType(type)); // Add type hint

        // Write properties from the serialized JSON
        foreach (var property in doc.RootElement.EnumerateObject())
        {
            property.WriteTo(writer);
        }

        writer.WriteEndObject();
    }
}
