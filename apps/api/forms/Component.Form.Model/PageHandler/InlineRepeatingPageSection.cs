using Component.Form.Model;

namespace Component.Form.Model.PageHandler
{
    public class InlineRepeatingPageSection : PageBase
    {
        public string RepeatKey { get; set; }
        public string SummaryLabel { get; set; }
        public List<InlineRepeatingPage> RepeatingPages { get; set; }
        public Dictionary<string, object> DataThatMeetsCondition { get; set; } = new Dictionary<string, object>();
        public Dictionary<string, object> DataThatDoesNotMeetCondition { get; set; } = new Dictionary<string, object>();   
    }
}