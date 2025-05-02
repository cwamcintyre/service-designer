using System;
using Component.Core.Application;
using Component.Search.Application.UseCase.GetData.Service;
using Component.Search.Application.UseCase.GetData.Model;

namespace Component.Search.Application.UseCase.GetData;

public class GetData : IRequestResponseUseCase<GetDataRequestModel, GetDataResponseModel>
{
    private readonly SearchService _searchService;

    public GetData(SearchService searchService)
    {
        _searchService = searchService;
    }

    public async Task<GetDataResponseModel> HandleAsync(GetDataRequestModel request)
    {
        var data = await _searchService.GetDataAsync(request);
        return data;
    }
}
