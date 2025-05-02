using Component.Search.Application.UseCase.GetDataItem.Model;
using Component.Search.Model;

namespace Component.Search.Application.UseCase.GetDataItem.Infrastructure;

public interface IDetailTypeStore
{
    Task<DetailTypeModel> GetDetailType(string detailTypeId);
}
