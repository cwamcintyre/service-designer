using Component.Form.Application.UseCase.RemoveRepeatingSection;
using Component.Form.Application.Shared.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Component.Form.Infrastructure.Fake;
using Component.Form.Application.PageHandler;
using Component.Form.Application.Helpers;
using Component.Form.Application.PageHandler.Default;
using Component.Form.Application.PageHandler.InlineRepeating;
using Component.Form.Application.ComponentHandler;
using Component.Form.Model.ComponentHandler;
using Component.Form.Application.ComponentHandler.DateParts;
using Component.Form.Application.ComponentHandler.Email;
using Component.Form.Application.ComponentHandler.PhoneNumber;
using Component.Form.Application.ComponentHandler.Default;
using Microsoft.Extensions.Configuration;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Application.Tests.Doubles.UseCase;

[ExcludeFromCodeCoverage]
public class RemoveRepeatingSectionTestBuilder
{
    private readonly ServiceCollection _serviceCollection;
    private ServiceProvider _serviceProvider;

    public RemoveRepeatingSectionTestBuilder()
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
        _serviceCollection.AddSingleton<IFormDataStore, FakeFormDataStore>();

        _serviceCollection.AddSingleton<IComponentHandlerFactory, ComponentHandlerFactory>();
        _serviceCollection.AddSingleton<IComponentHandler, UkAddressHandler>();
        _serviceCollection.AddSingleton<IComponentHandler, DatePartsHandler>();
        _serviceCollection.AddSingleton<IComponentHandler, EmailHandler>();
        _serviceCollection.AddSingleton<IComponentHandler, PhoneNumberHandler>();
        _serviceCollection.AddSingleton<IComponentHandler, DefaultHandler>();

        _serviceCollection.AddSingleton<IPageHandlerFactory, PageHandlerFactory>();
        _serviceCollection.AddSingleton<IPageHandler, DefaultPageHandler>();
        _serviceCollection.AddSingleton<IPageHandler, InlineRepeatingPageHandler>();
        
        _serviceCollection.AddSingleton(new Mock<ILogger<RemoveRepeatingSection>>().Object);
        _serviceCollection.AddSingleton(serviceProvider => {
            var allTypes = new HashSet<string>
            {
                // will have to do the page handlers manually as they have SafeJsonHelper injected in them...
                DefaultPageHandler.GetSafeType(),
                InlineRepeatingPageHandler.GetSafeType()
            };

            return new SafeJsonHelper(allTypes.ToHashSet());
        });

        _serviceCollection.AddTransient<RemoveRepeatingSection>();
    }

    public RemoveRepeatingSectionTestBuilder WithFormDataStore(IFormDataStore formDataStore)
    {
        _serviceCollection.AddSingleton(formDataStore);
        return this;
    }

    public RemoveRepeatingSectionTestBuilder WithFormStore(IFormStore formStore)
    {
        _serviceCollection.Remove(new ServiceDescriptor(typeof(IFormStore), typeof(FakeFormStore), ServiceLifetime.Singleton));
        _serviceCollection.AddSingleton(formStore);
        return this;
    }

    public RemoveRepeatingSection Build()
    {
        _serviceProvider = _serviceCollection.BuildServiceProvider();
        return _serviceProvider.GetRequiredService<RemoveRepeatingSection>();
    }
}