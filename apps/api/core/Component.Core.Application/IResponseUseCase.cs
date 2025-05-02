using System;

namespace Component.Core.Application;

public interface IResponseUseCase<TResponse>
{
    Task<TResponse> HandleAsync();
}
