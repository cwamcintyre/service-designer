using System;
using System.Collections.Generic;

namespace Component.Search.Model;

public class DetailTypeModel
{
    public DetailsPage DetailsPage { get; set; }
}

public class DetailsPage
{
    public string Title { get; set; }
    public List<Section> Sections { get; set; }
}

public class Section
{
    public string Title { get; set; }
    public List<DetailComponent> Components { get; set; }
}

public class DetailComponent
{
    public string Type { get; set; }
    public string Content { get; set; }
    public List<Field> Fields { get; set; }
}

public class Field
{
    public string Label { get; set; }
    public string Type { get; set; }
    public string Name { get; set; }
}
