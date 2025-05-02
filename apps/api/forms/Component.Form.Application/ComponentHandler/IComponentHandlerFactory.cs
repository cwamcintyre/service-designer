using System;

namespace Component.Form.Application.ComponentHandler;

public interface IComponentHandlerFactory
{
    IComponentHandler GetFor(string type);
    HashSet<string> GetAllTypes();
}
