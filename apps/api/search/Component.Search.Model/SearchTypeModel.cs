using System;
using System.Collections.Generic;

namespace Component.Search.Model;

public class SearchTypeModel
{
    public SearchPage SearchPage { get; set; }
}

public class SearchPage
{
    public string Title { get; set; }
    public string SearchTypeId { get; set; }
    public string Description { get; set; }
    public List<Column> Columns { get; set; }
    public List<Filter> Filters { get; set; }
}

public class Column
{
    public string Label { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public bool Sortable { get; set; }
    public bool Clickable { get; set; }
}

public class Filter
{
    public string Name { get; set; }
    public string Type { get; set; }
    public string Label { get; set; }
}