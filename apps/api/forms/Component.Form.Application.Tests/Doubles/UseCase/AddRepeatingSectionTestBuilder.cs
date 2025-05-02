using Component.Form.Application.UseCase.AddRepeatingSection;
using Component.Form.Application.Shared.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Component.Form.Infrastructure.Fake;
using Component.Form.Application.PageHandler;
using Component.Form.Application.PageHandler.Default;
using Component.Form.Application.PageHandler.InlineRepeating;
using Component.Form.Application.Helpers;
using Microsoft.Extensions.Configuration;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.Doubles.UseCase;

[ExcludeFromCodeCoverage]
public class AddRepeatingSectionTestBuilder
{
    private readonly ServiceCollection _serviceCollection;
    private ServiceProvider _serviceProvider;

    public AddRepeatingSectionTestBuilder()
    {
        _serviceCollection = new ServiceCollection();

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string>
            {
            { "FakeFormDirectory", @"d:\development\component-library\Forms\Component.Form.Infrastructure.Fake" }
            })
            .Build();

        _serviceCollection.AddSingleton<IConfiguration>(configuration);

        _serviceCollection.AddSingleton<IFormStore, FakeFormStore>();
        _serviceCollection.AddSingleton<IPageHandlerFactory, PageHandlerFactory>();
        _serviceCollection.AddSingleton(new Mock<ILogger<AddRepeatingSection>>().Object);
        _serviceCollection.AddSingleton(serviceProvider => {
            var allTypes = new HashSet<string>
            {
                // will have to do the page handlers manually as they have SafeJsonHelper injected in them...
                DefaultPageHandler.GetSafeType(),
                InlineRepeatingPageHandler.GetSafeType()
            };

            return new SafeJsonHelper(allTypes.ToHashSet());
        });

        _serviceCollection.AddTransient<AddRepeatingSection>();
    }

    public AddRepeatingSectionTestBuilder WithFormDataStore(IFormDataStore formDataStore)
    {
        _serviceCollection.AddSingleton(formDataStore);
        return this;
    }

    public AddRepeatingSection Build()
    {
        _serviceProvider = _serviceCollection.BuildServiceProvider();
        return _serviceProvider.GetRequiredService<AddRepeatingSection>();
    }
}