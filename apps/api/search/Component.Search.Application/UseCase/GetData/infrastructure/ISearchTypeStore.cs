using System;
using Component.Search.Application.UseCase.GetData.Model;
using Component.Search.Model;

namespace Component.Search.Application.UseCase.GetData.infrastructure;

public interface ISearchTypeStore
{
    Task<SearchTypeModel> GetSearchTypeAsync(string searchTypeId);
}
