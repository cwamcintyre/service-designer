using Component.Search.Application.UseCase.GetDataItem.Infrastructure;
using Component.Search.Application.UseCase.GetDataItem.Model;

namespace Component.Search.Application.UseCase.GetDataItem.Service;

public class DetailService
{
    private readonly IDetailStore _detailStore;
    private readonly IDetailTypeStore _detailTypeStore;

    public DetailService(IDetailStore detailStore, IDetailTypeStore detailTypeStore)
    {
        _detailStore = detailStore;
        _detailTypeStore = detailTypeStore;
    }

    public async Task<GetDataItemResponseModel> GetDetailAsync(GetDataItemRequestModel request)
    {
        var detailType = await _detailTypeStore.GetDetailType(request.ItemTypeId);
        var detail = await _detailStore.GetDetail(request.ItemTypeId, request.ItemId);

        return new GetDataItemResponseModel
        {
            DetailTypeModel = detailType,
            Data = detail
        };
    }
}
