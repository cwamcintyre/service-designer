using Component.Form.Application.UseCase.GetData;
using Component.Form.Application.Shared.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.Doubles.UseCase;

[ExcludeFromCodeCoverage]
public class GetDataTestBuilder
{
    private readonly ServiceCollection _serviceCollection;
    private ServiceProvider _serviceProvider;

    public GetDataTestBuilder()
    {
        _serviceCollection = new ServiceCollection();

        _serviceCollection.AddSingleton(new Mock<ILogger<GetData>>().Object);
        _serviceCollection.AddTransient<GetData>();
    }

    public GetDataTestBuilder WithFormDataStore(IFormDataStore formDataStore)
    {
        _serviceCollection.AddSingleton(formDataStore);
        return this;
    }

    public GetData Build()
    {
        _serviceProvider = _serviceCollection.BuildServiceProvider();
        return _serviceProvider.GetRequiredService<GetData>();
    }
}