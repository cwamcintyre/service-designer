namespace Component.Search.Model
{
    public class SearchIndexTypeModel
    {
        public SearchIndexPage SearchIndexPage { get; set; }
    }

    public class SearchIndexPage
    {
        public string Title { get; set; } = string.Empty;
        public string SearchType { get; set;} = string.Empty;
        public string SearchTypeId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<IndexField> IndexFields { get; set; } = new List<IndexField>();
        public RelatedContent RelatedContent { get; set; }
    }

    public class IndexField
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Placeholder { get; set; } = string.Empty;
    }

    public class RelatedContent
    {
        public string Title { get; set; } = string.Empty;
        public List<RelatedContentItem> Items { get; set; } = new List<RelatedContentItem>();
    }

    public class RelatedContentItem
    {
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }
}