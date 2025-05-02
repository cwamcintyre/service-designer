namespace Component.Form.Model.PageHandler;

public class RepeatingModel
{
    public Dictionary<string, string> FormData { get; set; } = new Dictionary<string, string>();
    public int RepeatIndex { get; set; }
}
