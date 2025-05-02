using Newtonsoft.Json.Linq;
using Component.Search.Application.UseCase.GetData.Model;
using Component.Search.Application.UseCase.GetData.infrastructure;

namespace Component.Search.Infrastructure.Fake;

public class FakeSearchDataStore : ISearchDataStore
{
    public async Task<DataStoreResponseModel> GetDataAsync(string searchDataTypeId, SearchDetail searchDetail)
    {
        var data = FakeData.Instance.GetDetails(searchDataTypeId);

        // Filter data based on searchDetail properties
        var filteredData = data.Where(d =>
        {
            bool matches = true;
            foreach (var filter in searchDetail.Filters)
            {
                var value = filter.Value?.ToString();
                if (!string.IsNullOrEmpty(value) && d.ContainsKey(filter.Field))
                {
                    if (filter.Field == "DateOfBirth")
                    {
                        var dateRange = JArray.Parse(value);
                        var startDate = DateTime.Parse(dateRange[0].ToString());
                        var endDate = DateTime.Parse(dateRange[1].ToString());
                        var dateOfBirth = DateTime.Parse(d[filter.Field]);
                        matches &= dateOfBirth >= startDate && dateOfBirth <= endDate;
                    }
                    else
                    {
                        matches &= d[filter.Field].Contains(value, StringComparison.OrdinalIgnoreCase);
                    }
                }
            }
            foreach (var query in searchDetail.Queries)
            {
                if (d.ContainsKey(query.Key))
                {
                    matches &= d[query.Key].Contains(query.Value, StringComparison.OrdinalIgnoreCase);
                }
            }
            return matches;
        }).ToList();

        // Apply sorting
        if (!string.IsNullOrEmpty(searchDetail.SortKey) && filteredData.Any() && filteredData.First().ContainsKey(searchDetail.SortKey))
        {
            filteredData = searchDetail.SortOrder == "desc"
                ? filteredData.OrderByDescending(d => d[searchDetail.SortKey]).ToList()
                : filteredData.OrderBy(d => d[searchDetail.SortKey]).ToList();
        }

        // Apply pagination
        var pagedData = filteredData
            .Skip((searchDetail.PageNumber - 1) * searchDetail.ItemsPerPage)
            .Take(searchDetail.ItemsPerPage)
            .ToList();

        return new DataStoreResponseModel
        {
            Data = pagedData,
            TotalItems = filteredData.Count()
        };
    }
}