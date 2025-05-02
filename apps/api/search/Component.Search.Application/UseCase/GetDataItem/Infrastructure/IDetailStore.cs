using System;

namespace Component.Search.Application.UseCase.GetDataItem.Infrastructure;

public interface IDetailStore
{
    Task<Dictionary<string, string>> GetDetail(string detailTypeId, string detailId);
}
