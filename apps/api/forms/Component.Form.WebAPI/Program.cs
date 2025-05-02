using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Component.Core.Application;

using Component.Form.Application.UseCase.ProcessChangeInForm;
using Component.Form.Application.UseCase.CreateForm;
using Component.Form.Application.UseCase.GetAllForms;
using Component.Form.Application.UseCase.DeleteForm;
using Component.Form.Application.UseCase.GetForm;
using Component.Form.Application.UseCase.GetData;
using Component.Form.Application.UseCase.GetDataForPage;
using Component.Form.Application.UseCase.ProcessForm;
using Component.Form.Application.UseCase.AddRepeatingSection;
using Component.Form.Application.UseCase.RemoveRepeatingSection;
using Component.Form.Application.UseCase.UpdateForm;

using Component.Form.Application.UseCase.UpdateForm.Model;
using Component.Form.Application.UseCase.RemoveRepeatingSection.Model;
using Component.Form.Application.UseCase.ProcessForm.Model;
using Component.Form.Application.UseCase.GetForm.Model;
using Component.Form.Application.UseCase.GetDataForPage.Model;
using Component.Form.Application.UseCase.GetData.Model;
using Component.Form.Application.UseCase.GetAllForms.Model;
using Component.Form.Application.UseCase.DeleteForm.Model;
using Component.Form.Application.UseCase.CreateForm.Model;
using Component.Form.Application.UseCase.AddRepeatingSection.Model;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Infrastructure.Cosmos;
using Component.Form.Application.ComponentHandler;
using Component.Form.Model.ComponentHandler;
using Component.Form.Application.ComponentHandler.DateParts;
using Component.Form.Application.ComponentHandler.Email;
using Component.Form.Application.ComponentHandler.PhoneNumber;
using Component.Form.Application.ComponentHandler.Default;
using Component.Form.Application.PageHandler;
using Component.Form.Application.PageHandler.Default;
using Component.Form.Application.PageHandler.InlineRepeating;
using Component.Form.Application.Helpers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Update CORS policy with null check for origins
var corsOrigin = builder.Configuration["Host:CORS"];
if (string.IsNullOrEmpty(corsOrigin))
{
    throw new InvalidOperationException("CORS origin is not configured in appsettings.json");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins(corsOrigin.Split(','))
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

// Dependency Injection for Use Cases
builder.Services.AddScoped<IRequestResponseUseCase<UpdateFormRequestModel, UpdateFormResponseModel>, UpdateForm>();
builder.Services.AddScoped<IRequestResponseUseCase<RemoveRepeatingSectionRequestModel, RemoveRepeatingSectionResponseModel>, RemoveRepeatingSection>();
builder.Services.AddScoped<IRequestResponseUseCase<ProcessChangeInFormRequestModel, ProcessChangeInFormResponseModel>, ProcessChangeInForm>();
builder.Services.AddScoped<IRequestResponseUseCase<ProcessFormRequestModel, ProcessFormResponseModel>, ProcessForm>();
builder.Services.AddScoped<IRequestResponseUseCase<GetFormRequestModel, GetFormResponseModel>, GetForm>();
builder.Services.AddScoped<IRequestResponseUseCase<GetDataForPageRequestModel, GetDataForPageResponseModel>, GetDataForPage>();
builder.Services.AddScoped<IRequestResponseUseCase<GetDataRequestModel, GetDataResponseModel>, GetData>();
builder.Services.AddScoped<IResponseUseCase<GetAllFormsResponseModel>, GetAllForms>();
builder.Services.AddScoped<IRequestResponseUseCase<DeleteFormRequestModel, DeleteFormResponseModel>, DeleteForm>();
builder.Services.AddScoped<IRequestResponseUseCase<CreateFormRequestModel, CreateFormResponseModel>, CreateForm>();
builder.Services.AddScoped<IRequestResponseUseCase<AddRepeatingSectionRequestModel, AddRepeatingSectionResponseModel>, AddRepeatingSection>();

builder.Services.AddScoped<IFormStore, CosmosFormStore>();
builder.Services.AddScoped<IFormDataStore, CosmosFormDataStore>();

builder.Services.AddScoped<IComponentHandlerFactory, ComponentHandlerFactory>();
builder.Services.AddScoped<IComponentHandler, UkAddressHandler>();
builder.Services.AddScoped<IComponentHandler, DatePartsHandler>();
builder.Services.AddScoped<IComponentHandler, EmailHandler>();
builder.Services.AddScoped<IComponentHandler, PhoneNumberHandler>();
builder.Services.AddScoped<IComponentHandler, DefaultHandler>();

builder.Services.AddScoped<IPageHandlerFactory, PageHandlerFactory>();
builder.Services.AddScoped<IPageHandler, DefaultPageHandler>();
builder.Services.AddScoped<IPageHandler, InlineRepeatingPageHandler>();

// Add null check for componentHandlerFactory
builder.Services.AddScoped(serviceProvider => {
    var componentHandlerFactory = serviceProvider.GetService<IComponentHandlerFactory>();
    if (componentHandlerFactory == null)
    {
        throw new InvalidOperationException("IComponentHandlerFactory is not registered in the service container.");
    }

    var allTypes = componentHandlerFactory.GetAllTypes();

    // will have to do the page handlers manually as they have SafeJsonHelper injected in them...
    allTypes.Add(DefaultPageHandler.GetSafeType());
    allTypes.Add(InlineRepeatingPageHandler.GetSafeType());

    return new SafeJsonHelper(allTypes.ToHashSet());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors("AllowSpecificOrigin");
app.MapControllers();

app.Run();
