using System;
using System.Threading.Tasks;
using Component.Core.Application;
using Component.Search.Application.UseCase.GetDataItem.Model;
using Component.Search.Application.UseCase.GetDataItem.Service;

namespace Component.Search.Application.UseCase.GetDataItem
{
    public class GetDataItem : IRequestResponseUseCase<GetDataItemRequestModel, GetDataItemResponseModel>
    {
        private readonly DetailService _detailService;

        public GetDataItem(DetailService detailService)
        {
            _detailService = detailService;
        }

        public async Task<GetDataItemResponseModel> HandleAsync(GetDataItemRequestModel request)
        {
            var details = await _detailService.GetDetailAsync(request);
            return details;
        }
    }
}

