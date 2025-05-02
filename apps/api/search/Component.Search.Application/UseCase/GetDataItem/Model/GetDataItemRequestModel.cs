using System;

namespace Component.Search.Application.UseCase.GetDataItem.Model;

public class GetDataItemRequestModel
{
    public string ItemTypeId { get; set; }
    public string ItemId { get; set; }
}
