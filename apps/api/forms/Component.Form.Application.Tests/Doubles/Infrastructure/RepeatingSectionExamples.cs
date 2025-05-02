using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Component.Form.Model;

namespace Component.Form.Application.Tests.Doubles.Infrastructure;

[ExcludeFromCodeCoverage]
public class RepeatingSectionExamples
{
    public const string ApplicantId = "applicant-123";
    public const string FormId = "repeatingInlinePage";
    public const string PageId = "tasks-repeat";

    public static Dictionary<string, string> WhatAreYouGoingToDoToday_Form_AddedData = new Dictionary<string, string>()
    {
        { "tasks",  """{ "formData": { "what_are_you_going_to_do_today":"test this thing again" }, "repeatIndex": 1 }""" },
        { "RepeatIndex", "1" },
        { "RepeatPageId", "what-do-you-want-to-do-today" },
        { "ExtraData", "1-what-do-you-want-to-do-today" }
    };

    public static Dictionary<string, string> HowLongWillItTake_Form_AddedData = new Dictionary<string, string>()
    {
        { "tasks",  """{ "formData": { "how_long_will_it_take":"2 hours" }, "repeatIndex": 1 }""" },
        { "RepeatIndex", "1" },
        { "RepeatPageId", "how-long-will-it-take" },
        { "ExtraData", "1-how-long-will-it-take" }
    };

    public static Dictionary<string, string> HowLongWillItTakeInvalid_Form_AddedData = new Dictionary<string, string>()
    {
        { "tasks",  """{ "formData": { "how_long_will_it_take":"TOO LONG" }, "repeatIndex": 1 }""" },
        { "RepeatIndex", "1" },
        { "RepeatPageId", "how-long-will-it-take" },
        { "ExtraData", "1-how-long-will-it-take" }
    };

    public static Dictionary<string, string> WhatAreYouGoingToDoToday_Form_Data = new Dictionary<string, string>()
    {
        { "tasks",  """{ "formData": { "what_are_you_going_to_do_today":"test this thing" }, "repeatIndex": 0 }""" },
        { "RepeatIndex", "0" },
        { "RepeatPageId", "what-do-you-want-to-do-today" },
        { "ExtraData", "0-what-do-you-want-to-do-today" }
    };

    public static Dictionary<string, string> HowLongWillItTake_Form_Data = new Dictionary<string, string>()
    {
        { "tasks",  """{ "formData": { "how_long_will_it_take":"2 hours" }, "repeatIndex": 0 }""" },
        { "RepeatIndex", "0" },
        { "RepeatPageId", "how-long-will-it-take" },
        { "ExtraData", "0-how-long-will-it-take" }
    };

    public static Dictionary<string, string> DoYouWantToAddAnother_Yes_Form_Data = new Dictionary<string, string>()
    {
        { "tasks",  """{ "formData": { "do_you_want_to_add_another_task":"yes" }, "repeatIndex": 0 }""" },
        { "RepeatIndex", "0" },
        { "RepeatPageId", "do-you-want-to-add-another-task" },
        { "ExtraData", "0-do-you-want-to-add-another-task" }
    };

    public static Dictionary<string, string> DoYouWantToAddAnother_No_Form_Data = new Dictionary<string, string>()
    {
        { "tasks",  """{ "formData": { "do_you_want_to_add_another_task":"no" }, "repeatIndex": 0 }""" },
        { "RepeatIndex", "0" },
        { "RepeatPageId", "do-you-want-to-add-another-task" },
        { "ExtraData", "0-do-you-want-to-add-another-task" }
    };

    public static Dictionary<string, string> HowLongWillItTakeInvalid_Form_Data = new Dictionary<string, string>()
    {
        { "tasks",  """{ "formData": { "how_long_will_it_take":"TOO LONG" }, "repeatIndex": 0 }""" },
        { "RepeatIndex", "0" },
        { "RepeatPageId", "how-long-will-it-take" },
        { "ExtraData", "0-how-long-will-it-take" }
    };

    public static Dictionary<string, object> NewRepeatingSectionData = new Dictionary<string, object>
    {
        { "what_are_you_going_to_do_today", "test some more" },
        { "how_long_will_it_take", "2 hours" },
        { "do_you_want_to_add_another_task", "no" }
    };

    public const string EmptyForm = "{}";

    public const string FormWithNoRepeatSection = """
        {
            "do_you_want_to_fill_in_this_form": "yes",
            "what_is_your_name": "John Doe"
        }
        """;

    public const string EmptyTasks = """
        {"tasks":[]}
        """;

    public const string EmptyForm_Tasks_Added = """
        {"tasks":[{"do_you_want_to_add_another_task":"no"}]}
        """;

    public const string CorruptedTasks = """
        {"tasks":{"this-is-not-a-list":{}}}
        """;

    public const string ExistingFormData_OneEntry = """
            {
                "tasks": [
                    {
                        "what_are_you_going_to_do_today": "test this thing",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "no" 
                    }
                ]
            }
        """;

    public const string ExistingFormDataInvalid_OneEntry = """
            {
                "tasks": [
                    {
                        "what_are_you_going_to_do_today": "test this thing",
                        "how_long_will_it_take": "TOO LONG" 
                    }
                ]
            }
        """;

    public const string ExistingFormData_OneEntry_AddRepeatSection_Called = """
            {
                "tasks": [
                    {
                        "what_are_you_going_to_do_today": "test this thing",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "yes" 
                    },
                    {
                        "do_you_want_to_add_another_task": "no" 
                    }
                ]
            }    
    """;

    public const string ExistingFormData_OneEntry_WhatAreYouGoingToDoToday_Added = """
            {
                "tasks": [
                    {
                        "what_are_you_going_to_do_today": "test this thing",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "yes" 
                    },
                    {
                        "what_are_you_going_to_do_today": "test this thing again",
                        "do_you_want_to_add_another_task": "no" 
                    }
                ]
            }    
    """;


    public const string WhatAreYouGoingToDoToday_Saved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing"}]}
        """;

    public const string HowLongWillItTake_Saved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"2 hours"}]}
        """;

    public const string HowLongWillItTakeInvalid_Saved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"TOO LONG"}]}
        """;

    public const string DoYouWantToAddAnother_Yes_Saved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"2 hours","do_you_want_to_add_another_task":"yes"}]}
        """;

    public const string DoYouWantToAddAnother_No_Saved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"2 hours","do_you_want_to_add_another_task":"no"}]}
        """;

    public const string Processed_Yes_Saved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"yes"}]}
        """;

    public const string WhatAreYouGoingToDoToday_ProcessedConditionAndSaved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"yes"},{"what_are_you_going_to_do_today":"test this thing again"}]}
        """;

    public const string WhatAreYouGoingToDoToday_AddedAndSaved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"yes"},{"do_you_want_to_add_another_task":"no","what_are_you_going_to_do_today":"test this thing again"}]}
        """;

    public const string HowLongWillItTake_AddedAndSaved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"yes"},{"what_are_you_going_to_do_today":"test this thing again","do_you_want_to_add_another_task":"no","how_long_will_it_take":"2 hours"}]}
        """;

    public const string HowLongWillItTakeInvalid_AddedAndSaved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"yes"},{"what_are_you_going_to_do_today":"test this thing again","do_you_want_to_add_another_task":"no","how_long_will_it_take":"TOO LONG"}]}
        """;

    public const string AddRepeatingSectionSaved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"yes"},{"do_you_want_to_add_another_task":"no"}]}
        """;

    public const string ExistingFormDataForTestJson_Three_Entries = """
            {
                "do_you_want_to_fill_in_this_form": "yes",
                "what_is_your_name": "John Doe",
                "tasks": [
                    {
                        "what_are_you_going_to_do_today": "test this thing",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "yes" 
                    },
                    {
                        "what_are_you_going_to_do_today": "test this thing again",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "yes" 
                    },
                    {
                        "what_are_you_going_to_do_today": "test this thing some more",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "no" 
                    }
                ]
            }
        """;

    public const string ExistingFormDataForTestJsonWhereUserWentBackAndSaidNo_Three_Entries = """
            {
                "do_you_want_to_fill_in_this_form": "yes",
                "what_is_your_name": "John Doe",
                "tasks": [
                    {
                        "what_are_you_going_to_do_today": "test this thing",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "no" 
                    },
                    {
                        "what_are_you_going_to_do_today": "test this thing again",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "yes" 
                    },
                    {
                        "what_are_you_going_to_do_today": "test this thing some more",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "no" 
                    }
                ]
            }
        """;

    public const string ExistingFormData_Three_Entries = """
            {
                "tasks": [
                    {
                        "what_are_you_going_to_do_today": "test this thing",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "yes" 
                    },
                    {
                        "what_are_you_going_to_do_today": "test this thing again",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "yes" 
                    },
                    {
                        "what_are_you_going_to_do_today": "test this thing some more",
                        "how_long_will_it_take": "1 hour",
                        "do_you_want_to_add_another_task": "no" 
                    }
                ]
            }
        """;

    public const string RemovedFromThreeEntries_StartSaved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing again","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"yes"},{"what_are_you_going_to_do_today":"test this thing some more","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"no"}]}
        """;

    public const string RemovedFromThreeEntries_MiddleSaved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"yes"},{"what_are_you_going_to_do_today":"test this thing some more","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"no"}]}
        """;

    public const string RemovedFromThreeEntries_EndSaved = """
        {"tasks":[{"what_are_you_going_to_do_today":"test this thing","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"yes"},{"what_are_you_going_to_do_today":"test this thing again","how_long_will_it_take":"1 hour","do_you_want_to_add_another_task":"no"}]}
        """;
}