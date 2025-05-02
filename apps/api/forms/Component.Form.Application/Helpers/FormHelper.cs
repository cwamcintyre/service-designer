using System.Dynamic;
using Component.Form.Application.ComponentHandler;
using Component.Form.Application.PageHandler;
using Component.Form.Model;
using Newtonsoft.Json;

namespace Component.Form.Application.Helpers;

public static class FormHelper
{
    public static dynamic ParseData(string formData, IComponentHandlerFactory _componentHandlerFactory) 
    {
        var jsonSettings = GetJsonSerializerSettings(_componentHandlerFactory);
        var data = JsonConvert.DeserializeObject<ExpandoObject>(formData, jsonSettings);
        
        if (data == null) 
        {
            data = new ExpandoObject();
        }

        return data;
    }

    public static JsonSerializerSettings GetJsonSerializerSettings(IComponentHandlerFactory _componentHandlerFactory)
    {
        return new JsonSerializerSettings
        {
            TypeNameHandling = TypeNameHandling.None,
            ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver(), // Ensures JsonProperty attributes are respected
            SerializationBinder = new SafeTypeResolver(_componentHandlerFactory.GetAllTypes())
        };
    }

    // considering that the user has the back link and the back button (and we cannot effectively test for the back button), we have to calculate the previous page
    // based on first principles every time a page is loaded.
    public static async Task<PreviousPageModel> CalculatePreviousPage(
        IPageHandlerFactory pageHandlerFactory,
        FormModel formModel, 
        string currentPageId, 
        IDictionary<string, object> data, 
        string extraData)
    {
        // calculate forward journey up until now...
        var pages = new Stack<PreviousPageModel>();

        if (!String.IsNullOrEmpty(extraData))
        {
            currentPageId = $"{currentPageId}/{extraData}";
        }

        await CalculatePreviousPageRecursive(
            pageHandlerFactory, 
            formModel, 
            formModel.Pages[0], 
            currentPageId, 
            data, 
            pages,
            extraData);

        if (pages.Count == 0)
        {
            return new PreviousPageModel
            {
                PageId = "",
                RepeatIndex = 0
            };
        }

        return pages.Peek();
    }

    private static async Task CalculatePreviousPageRecursive(
        IPageHandlerFactory pageHandlerFactory,
        FormModel formModel,
        PageBase page, 
        string currentPageId, 
        IDictionary<string, object> data, 
        Stack<PreviousPageModel> pages,
        string extraData,
        string nextExtraData = "")
    {
        var checkPageId = page.PageId;
        if (!String.IsNullOrEmpty(nextExtraData))
        {
            checkPageId = $"{checkPageId}/{nextExtraData}";
        }

        if (checkPageId == currentPageId)
        {
            return;
        }   

        pages.Push(new PreviousPageModel { PageId = page.PageId, ExtraData = nextExtraData });
                
        var pageHandler = pageHandlerFactory.GetFor(page.PageType);

        var nextPageIdResult = await pageHandler.GetNextPageId(page, data, nextExtraData, extraData);

        // kill it here..
        if (nextPageIdResult.ForceRedirect)
        {
            pages.Peek().ForceRedirect = true;
            return;
        }

        var nextPage = formModel.Pages.Find(p => p.PageId == nextPageIdResult.NextPageId);
        if (nextPage == null)
        {
            throw new ArgumentException($"Next page {nextPageIdResult.NextPageId} not found");
        }

        await CalculatePreviousPageRecursive(pageHandlerFactory, formModel, nextPage, currentPageId, data, pages, extraData, nextPageIdResult.ExtraData);        
    }

    public static async Task<WalkResult> WalkToNextInvalidOrUnfilledPageRecursive(
        IPageHandlerFactory pageHandlerFactory, 
        FormModel formModel, 
        PageBase currentPage, 
        IDictionary<string, object> data,
        string extraData)
    {
        // if the page is a summary or stop page, return the current page and stop
        if (currentPage.PageType == "summary" || currentPage.PageType == "stop")
        {
            return new WalkResult
            {
                Page = currentPage,
                Stop = true
            };
        }

        var pageHandler = pageHandlerFactory.GetFor(currentPage.PageType);

        var walkResult = await pageHandler.WalkToNextInvalidOrUnfilledPage(formModel, currentPage, data, extraData);

        if (!walkResult.Stop)
        {
            return await WalkToNextInvalidOrUnfilledPageRecursive(pageHandlerFactory, formModel, walkResult.Page, data, extraData);
        }

        return walkResult;
    }
}

public class PreviousPageModel 
{
    public string PageId { get; set; }
    public int RepeatIndex { get; set; }
    public string ExtraData { get; set; }
    public bool ForceRedirect { get; set; }
}

public class ConditionResult
{
    public bool MetCondition { get; set; }
    public string NextPageId { get; set; }
    public string ExtraData { get; set; }
    public int RepeatIndex { get; set; }
}

public class WalkResult
{
    public PageBase Page { get; set; }
    public bool Stop { get; set; }
    public string ExtraData { get; set; }
}
