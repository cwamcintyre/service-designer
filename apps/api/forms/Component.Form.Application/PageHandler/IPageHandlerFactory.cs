using System;

namespace Component.Form.Application.PageHandler;

public interface IPageHandlerFactory
{
    IPageHandler GetFor(string type);
}
