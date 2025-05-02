using System;

namespace Component.Form.Application.PageHandler;

public class PageHandlerFactory : IPageHandlerFactory
{
    private readonly IEnumerable<IPageHandler> _handlers;

    public PageHandlerFactory(IEnumerable<IPageHandler> handlers)
    {
        _handlers = handlers;
    }

    public IPageHandler GetFor(string type) 
    {
        foreach (var handler in _handlers)
        {
            if (handler.IsFor(type))
            {
                return handler;
            }
        }

        throw new NoPageHandlerException($"No handler found for type {type}");
    }
}

public class NoPageHandlerException : Exception
{
    public NoPageHandlerException(string message) : base(message)
    {
    }
}
