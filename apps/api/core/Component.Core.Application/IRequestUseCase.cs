using System;

namespace Component.Core.Application;

public interface IRequestUseCase<TRequest>
{
    Task HandleAsync(TRequest request);
}
