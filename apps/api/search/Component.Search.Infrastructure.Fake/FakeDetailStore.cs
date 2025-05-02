using Newtonsoft.Json;
using Bogus;
using Component.Search.Application.UseCase.GetDataItem.Infrastructure;
using Component.Search.Application.UseCase.GetDataItem.Model;

namespace Component.Search.Infrastructure.Fake
{
    public class FakeDetailStore : IDetailStore
    {
        public async Task<Dictionary<string, string>> GetDetail(string detailTypeId, string detailId)
        {
            return FakeData.Instance.GetDetail(detailTypeId, detailId);
        }
    }
}
