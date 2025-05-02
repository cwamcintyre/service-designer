    using Component.Form.Application.Shared.Infrastructure;
    using Component.Form.Model;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Azure.Cosmos;

    namespace Component.Form.Infrastructure.Cosmos;

    public class CosmosFormStore : IFormStore
    {
        private readonly Container _container;

        public CosmosFormStore(IConfiguration configuration)
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

            var containerResponse = database.CreateContainerIfNotExistsAsync(configuration["CosmosDB:ContainerName"], "/formId").GetAwaiter().GetResult();
            _container = containerResponse.Container;
        }

        public async Task CreateFormAsync(string formId, FormModel model)
        {
            await _container.CreateItemAsync(model, new PartitionKey(formId));
        }

        public async Task DeleteFormAsync(string formId)
        {
            await _container.DeleteItemAsync<FormModel>(formId, new PartitionKey(formId));
        }

        public async Task<IEnumerable<FormModel>> GetAllFormsAsync()
        {
            var query = _container.GetItemQueryIterator<FormModel>();
            var results = new List<FormModel>();

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response);
            }

            return results;
        }

        public async Task<FormModel> GetFormAsync(string formId)
        {
            try
            {
                var response = await _container.ReadItemAsync<FormModel>(formId, new PartitionKey(formId));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
            throw new Exception($"Form with ID {formId} not found.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving the form with ID {formId}.", ex);
            }
        }

        public async Task UpdateFormAsync(string formId, FormModel model)
        {
            await _container.UpsertItemAsync(model, new PartitionKey(formId));
        }
    }
