using System.Diagnostics.CodeAnalysis;
using Component.Form.Application.ComponentHandler;
using Component.Form.Application.ComponentHandler.DateParts;
using Component.Form.Application.ComponentHandler.Default;
using Component.Form.Application.ComponentHandler.Email;
using Component.Form.Application.ComponentHandler.PhoneNumber;
using Component.Form.Application.Helpers;
using Component.Form.Application.PageHandler;
using Component.Form.Application.PageHandler.Default;
using Component.Form.Application.PageHandler.InlineRepeating;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Application.UseCase.ProcessChangeInForm;
using Component.Form.Infrastructure.Fake;
using Component.Form.Model.ComponentHandler;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;

namespace Component.Form.Application.Tests.Doubles.UseCase;

[ExcludeFromCodeCoverage]
public class ProcessChangeInFormTestBuilder
{
    private readonly ServiceCollection _serviceCollection;

    public ProcessChangeInFormTestBuilder()
    {
        // Set up the DI container
        _serviceCollection = new ServiceCollection();

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string>
            {
            { "FakeFormDirectory", @"d:\development\component-library\Forms\Component.Form.Infrastructure.Fake" }
            })
            .Build();

        _serviceCollection.AddSingleton<IConfiguration>(configuration);

        _serviceCollection.AddSingleton<IFormStore, FakeFormStore>();

        _serviceCollection.AddSingleton(new Mock<ILogger<ProcessChangeInForm>>().Object);

        _serviceCollection.AddSingleton<IComponentHandlerFactory, ComponentHandlerFactory>();
        _serviceCollection.AddSingleton<IComponentHandler, UkAddressHandler>();
        _serviceCollection.AddSingleton<IComponentHandler, DatePartsHandler>();
        _serviceCollection.AddSingleton<IComponentHandler, EmailHandler>();
        _serviceCollection.AddSingleton<IComponentHandler, PhoneNumberHandler>();
        _serviceCollection.AddSingleton<IComponentHandler, DefaultHandler>();

        _serviceCollection.AddSingleton<IPageHandlerFactory, PageHandlerFactory>();
        _serviceCollection.AddSingleton<IPageHandler, DefaultPageHandler>();
        _serviceCollection.AddSingleton<IPageHandler, InlineRepeatingPageHandler>();

        _serviceCollection.AddSingleton(serviceProvider => {
            var componentHandlerFactory = serviceProvider.GetService<IComponentHandlerFactory>();
            var allTypes = componentHandlerFactory.GetAllTypes();

            // will have to do the page handlers manually as they have SafeJsonHelper injected in them...
            allTypes.Add(DefaultPageHandler.GetSafeType());
            allTypes.Add(InlineRepeatingPageHandler.GetSafeType());

            return new SafeJsonHelper(allTypes.ToHashSet());
        });

        // Register the class under test
        _serviceCollection.AddTransient<ProcessChangeInForm>();
    }

    public ProcessChangeInFormTestBuilder WithFormDataStore(IFormDataStore formDataStore)
    {
        _serviceCollection.AddSingleton(formDataStore);
        return this;
    }

    public ProcessChangeInForm Build()
    {
        var serviceProvider = _serviceCollection.BuildServiceProvider();
        return serviceProvider.GetRequiredService<ProcessChangeInForm>();
    }
}