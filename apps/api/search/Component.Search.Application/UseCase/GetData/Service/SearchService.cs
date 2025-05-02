using Component.Search.Application.UseCase.GetData.Model;
using Component.Search.Application.UseCase.GetData.infrastructure;

namespace Component.Search.Application.UseCase.GetData.Service;

public class SearchService
{
    private readonly ISearchTypeStore _searchTypeStore;
    private readonly ISearchDataStore _searchDataStore;

    public SearchService(ISearchTypeStore searchTypeStore, ISearchDataStore searchDataStore)
    {
        _searchTypeStore = searchTypeStore;
        _searchDataStore = searchDataStore;
    }

    public async Task<GetDataResponseModel> GetDataAsync(GetDataRequestModel request)
    {
        var searchType = await _searchTypeStore.GetSearchTypeAsync(request.SearchDataTypeId);
        var data = await _searchDataStore.GetDataAsync(request.SearchDataTypeId, request.SearchDetail);
        
        return new GetDataResponseModel
        {
            SearchType = searchType,
            Data = data.Data,
            TotalItems = data.TotalItems
        };
    }
}
