using System;
using System.Diagnostics.CodeAnalysis;
using Component.Form.Model;

namespace Component.Form.Application.Tests.Doubles.PageHandler;

[ExcludeFromCodeCoverage]
public class DefaultPageTestBuilder
{
    private readonly PageBase _pageBase;

    public DefaultPageTestBuilder()
    {
        _pageBase = new PageBase
        {
            Components = new List<Model.Component>(),
            Conditions = new List<Condition>()
        };
    }

    public DefaultPageTestBuilder WithPageId(string pageId)
    {
        _pageBase.PageId = pageId;
        return this;
    }

    public DefaultPageTestBuilder WithPageType(string pageType)
    {
        _pageBase.PageType = pageType;
        return this;
    }

    public DefaultPageTestBuilder WithTitle(string title)
    {
        _pageBase.Title = title;
        return this;
    }

    public DefaultPageTestBuilder WithNextPageId(string nextPageId)
    {
        _pageBase.NextPageId = nextPageId;
        return this;
    }

    public DefaultPageTestBuilder WithComponent(string name, List<ValidationRule> validationRules, string questionId = "", string type = "text", string label = "default", bool required = true)
    {
        _pageBase.Components.Add(new Model.Component
        {
            Name = name,
            QuestionId = string.IsNullOrEmpty(questionId) ? Guid.NewGuid().ToString() : questionId,
            Type = type,
            Label = label, 
            Required = required,
            ValidationRules = validationRules
        });
        return this;
    }

    public DefaultPageTestBuilder WithCondition(string expression, string nextPageId)
    {
        _pageBase.Conditions.Add(new Condition
        {
            Expression = expression,
            NextPageId = nextPageId
        });
        return this;
    }

    public PageBase Build()
    {
        return _pageBase;
    }
}
