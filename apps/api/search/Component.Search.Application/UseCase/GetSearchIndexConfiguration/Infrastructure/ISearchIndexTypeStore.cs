using System;
using Component.Search.Model;

namespace Component.Search.Application.UseCase.GetSearchIndexConfiguration.Infrastructure;

public interface ISearchIndexTypeStore
{
    Task<SearchIndexTypeModel> GetSearchIndexTypeAsync(string searchIndexTypeId);
}
