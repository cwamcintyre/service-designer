using System;

namespace Component.Search.Application.UseCase.GetData.Model;

public class GetDataRequestModel
{
    public string SearchDataTypeId { get; set; }
    public SearchDetail SearchDetail { get; set; }
}

public class SearchDetail
{
    public List<SearchFilter> Filters { get; set; }
    public Dictionary<string, string> Queries { get; set; }
    public string SortKey { get; set; }
    public string SortOrder { get; set; }
    public int ItemsPerPage { get; set; }
    public int PageNumber { get; set; }
}

public class SearchFilter
{
    public string Field { get; set; }
    public string Value { get; set; }
}
