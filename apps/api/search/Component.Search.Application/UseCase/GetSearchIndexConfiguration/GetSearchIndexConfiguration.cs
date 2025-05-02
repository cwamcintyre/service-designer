using System;
using Component.Core.Application;
using Component.Search.Application.UseCase.GetSearchIndexConfiguration.Infrastructure;
using Component.Search.Application.UseCase.GetSearchIndexConfiguration.Model;

namespace Component.Search.Application.UseCase.GetSearchIndexConfiguration;

public class GetSearchIndexConfiguration : IRequestResponseUseCase<GetSearchIndexRequestModel, GetSearchIndexResponseModel>
{
    private readonly ISearchIndexTypeStore _searchIndexTypeStore;

    public GetSearchIndexConfiguration(ISearchIndexTypeStore searchIndexTypeStore)
    {
        _searchIndexTypeStore = searchIndexTypeStore;
    }

    public async Task<GetSearchIndexResponseModel> HandleAsync(GetSearchIndexRequestModel request)
    {
        var searchIndexType = await _searchIndexTypeStore.GetSearchIndexTypeAsync(request.SearchIndexTypeId);
        return new GetSearchIndexResponseModel
        {
            SearchIndexType = searchIndexType
        };
    }
}
