using System;
using Component.Form.Model;

namespace Component.Form.Model.PageHandler;

public class InlineRepeatingPage : PageBase
{
    public bool RepeatStart { get; set; }
    public bool RepeatEnd { get; set; }
    public int RepeatIndex { get; set; }
    public string SectionId { get; set; }
}
