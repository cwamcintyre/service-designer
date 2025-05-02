using Component.Search.Application.UseCase.GetData.infrastructure;
using Component.Search.Model;

using Newtonsoft.Json;

namespace Component.Search.Infrastructure.Fake;

public class FakeSearchTypeStore : ISearchTypeStore
{
    public async Task<SearchTypeModel> GetSearchTypeAsync(string searchTypeId)
    {
        var json = File.ReadAllText($"{searchTypeId}SearchResultsType.json");
        var searchType = JsonConvert.DeserializeObject<SearchTypeModel>(json);

        if (searchType != null)
        {
            return searchType;
        }
        else return null;
    }
}