namespace Component.Search.Application.UseCase.GetData.Model;
public class DataStoreResponseModel
{
    public List<Dictionary<string, string>> Data { get; set; }
    public int TotalItems { get; set; }
}