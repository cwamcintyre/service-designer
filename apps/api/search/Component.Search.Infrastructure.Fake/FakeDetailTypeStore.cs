using Newtonsoft.Json;
using Component.Search.Model;
using Component.Search.Application.UseCase.GetDataItem.Infrastructure;

namespace Component.Search.Infrastructure.Fake;

public class FakeDetailTypeStore : IDetailTypeStore
{
    public async Task<DetailTypeModel> GetDetailType(string id)
    {
        var json = File.ReadAllText($"{id}DetailType.json");
        var detailType = JsonConvert.DeserializeObject<DetailTypeModel>(json);

        if (detailType != null)
        {
            return detailType;
        }
        else return null;
    }
}
