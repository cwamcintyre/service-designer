using System;
using System.Security;
using Newtonsoft.Json.Serialization;

namespace Component.Form.Model;

public class SafeTypeResolver : DefaultSerializationBinder
{
    private readonly HashSet<string> AllowedTypes;

    public SafeTypeResolver(HashSet<string> allowedTypes)
    {
        AllowedTypes = allowedTypes;
    }

    public override Type BindToType(string assemblyName, string typeName)
    {
        if (!AllowedTypes.Contains($"{typeName}, {assemblyName}"))
        {
            throw new SecurityException($"Unauthorized type detected: {typeName} {assemblyName}");
        }
        return Type.GetType($"{typeName}, {assemblyName}");
    }
}
