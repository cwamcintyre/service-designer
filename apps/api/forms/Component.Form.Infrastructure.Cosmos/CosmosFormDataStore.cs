using System;
using System.Collections.Generic;
using System.Net.Http;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Model;

namespace Component.Form.Infrastructure.Cosmos;

public class CosmosFormDataStore : IFormDataStore
{
    private readonly Container _container;

    public CosmosFormDataStore(IConfiguration configuration)
    {
        var cosmosClient = new CosmosClient(configuration["CosmosDB:ConnectionString"], new CosmosClientOptions
        {
            HttpClientFactory = () =>
                {
                    var httpClientHandler = new HttpClientHandler();
                    if (bool.TryParse(configuration["VerifySSL"], out var verifySSL) && !verifySSL)
                    {
                        httpClientHandler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
                    }
                    return new HttpClient(httpClientHandler);
                },
                SerializerOptions = new CosmosSerializationOptions { PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase }
        });

        var databaseResponse = cosmosClient.CreateDatabaseIfNotExistsAsync(configuration["CosmosDB:DatabaseName"]).GetAwaiter().GetResult();
        var database = databaseResponse.Database;

        var containerResponse = database.CreateContainerIfNotExistsAsync(configuration["CosmosDB:DataContainerName"], "/id").GetAwaiter().GetResult();
        _container = containerResponse.Container;
    }

    public async Task<FormData> GetFormDataAsync(string applicantId)
    {
        try
        {
            var response = await _container.ReadItemAsync<FormData>(applicantId, new PartitionKey(applicantId));
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return new FormData { Data = "" };
        }
    }

    public async Task SaveFormDataAsync(string formId, string applicantId, string formData)
    {
        var data = new FormData { Id = applicantId, Data = formData };
        await _container.UpsertItemAsync(data, new PartitionKey(applicantId));
    }
}
