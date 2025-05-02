using System;
using System.Diagnostics.CodeAnalysis;
using Component.Form.Model;

namespace Component.Form.Application.Tests.Doubles.Infrastructure;

[ExcludeFromCodeCoverage]
public class FormDataExamples
{
    public const string ApplicantId = "a1b2c3d4-e5f6-7a8b-9c0d-e1f2g3h4i5j6";

    public const string EmptyForm = "{}";

    public const string DoYouWantToFillInThisForm_Name = "do_you_want_to_fill_in_this_form";
    public const string WhatIsYourName_Name = "what_is_your_name";

    public static Dictionary<string, string> DoYouWantToFillInThisForm_Form_Yes = new Dictionary<string, string>
    {
        { DoYouWantToFillInThisForm_Name, "yes" }
    };

    public static Dictionary<string, string> DoYouWantToFillInThisForm_Form_No = new Dictionary<string, string>
    {
        { DoYouWantToFillInThisForm_Name, "no" }
    };

    public static Dictionary<string, string> WhatIsYourName_Form_Valid = new Dictionary<string, string>
    {
        { WhatIsYourName_Name, "John Doe" }
    };

    public static Dictionary<string, string> WhatIsYourName_Form_Empty = new Dictionary<string, string>
    {
        { WhatIsYourName_Name, "" }
    };

    public static Dictionary<string, string> WhatIsYourName_Form_Invalid = new Dictionary<string, string>
    {
        { WhatIsYourName_Name, "BOB" }
    };

    public static Dictionary<string, string> WhatIsYourName_Form_Changed = new Dictionary<string, string>
    {
        { WhatIsYourName_Name, "Jane Doe" }
    };

    public const string DoYouWantToFillInThisFormAnswered_Yes = 
        """
        {"do_you_want_to_fill_in_this_form":"yes"}
        """;

    public const string DoYouWantToFillInThisFormAnswered_No = 
        """
        {"do_you_want_to_fill_in_this_form":"no"}
        """;

    public const string WhatIsYourNameChanged_Saved = 
        """
        {"what_is_your_name":"Jane Doe"}
        """;

    public const string WhatIsYourName_Valid = 
        """
        {"what_is_your_name":"John Doe"}
        """;

    public const string WhatIsYourName_Invalid = 
        """
        {"what_is_your_name":"BOB"}
        """;

    public static string UnknownComponentData = 
        """
        {
            "what_is_your_name": "John Doe",
            "do_you_want_branch_a": "yes",
            "what_do_you_think_of_branch_a": "I like it"
        }
        """;

    public static string ExistingBranchChangeData = 
        """
        {
            "what_is_your_name": "John Doe",
            "do_you_want_branch_a": "yes",
            "what_do_you_think_of_branch_a": "I like it"
        }
        """;

    public static string ExistingBranchInvalidChangeData = 
        """
        {
            "what_is_your_name": "John Doe",
            "do_you_want_branch_a": "yes",
            "what_do_you_think_of_branch_a": "INVALID"
        }
        """;        

    public static string ExistingBranchPreviousLinkData = 
        """
        {
            "what_is_your_name": "John Doe",
            "do_you_want_branch_a": "no",
            "what_do_you_think_of_branch_b": "I like it"
        }
        """;

    public const string BranchChangeDataGoesToSummary = """
        {"what_is_your_name":"Jane Doe","do_you_want_branch_a":"yes","what_do_you_think_of_branch_a":"I like it"}
        """;

    public const string BranchChangeDataGoesToInvalidPage = """
        {"what_is_your_name":"John Doe","do_you_want_branch_a":"yes","what_do_you_think_of_branch_a":"INVALID"}
        """;

    public const string BranchChangeDataGoesToIncompletePageInDifferentBranch = """
        {"what_is_your_name":"John Doe","do_you_want_branch_a":"no","what_do_you_think_of_branch_a":"I like it"}
        """;

    public static Dictionary<string, string> DoYouWantBranchA_No_Form_Changed = new Dictionary<string, string>
    {
        { "do_you_want_branch_a", "no" }
    };

    public static Dictionary<string, string> DoYouWantBranchA_Yes_Form_Changed = new Dictionary<string, string>
    {
        { "do_you_want_branch_a", "yes" }
    };
}