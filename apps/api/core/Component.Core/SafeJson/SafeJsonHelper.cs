using System;
using Component.Form.Model;
using Newtonsoft.Json;

namespace Component.Form.Application.Helpers;

public class SafeJsonHelper
{
    private JsonSerializerSettings _jsonSettings;

    public SafeJsonHelper(HashSet<string> types)
    {
        _jsonSettings = new JsonSerializerSettings
        {
            TypeNameHandling = TypeNameHandling.Objects,
            SerializationBinder = new SafeTypeResolver(types)
        };
    }

    public static string GetSafeType(Type type)
    {
        return $"{type.FullName}, {type.Assembly.GetName().Name}";
    }

    public string SafeSerializeObject(object value)
    {
        return JsonConvert.SerializeObject(value);
    }

    public string SafeSerializeObjectWithTypes(object value)
    {
        return JsonConvert.SerializeObject(value, _jsonSettings);
    }

    public T SafeDeserializeObject<T>(string value)
    {
        return JsonConvert.DeserializeObject<T>(value, _jsonSettings);
    }

    public object SafeDeserializeObject(string value, Type type)
    {
        return JsonConvert.DeserializeObject(value, type, _jsonSettings);
    }
}
