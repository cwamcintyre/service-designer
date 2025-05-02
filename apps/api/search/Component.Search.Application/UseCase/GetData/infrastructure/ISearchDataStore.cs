using System;
using Component.Search.Application.UseCase.GetData.Model;

namespace Component.Search.Application.UseCase.GetData.infrastructure;

public interface ISearchDataStore
{
    Task<DataStoreResponseModel> GetDataAsync(string searchDataTypeId, SearchDetail searchDetail);
}
