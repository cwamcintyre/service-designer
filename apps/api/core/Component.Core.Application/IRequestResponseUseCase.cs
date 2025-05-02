namespace Component.Core.Application;

public interface IRequestResponseUseCase<TRequest, TResponse>
{
    Task<TResponse> HandleAsync(TRequest request);
}
