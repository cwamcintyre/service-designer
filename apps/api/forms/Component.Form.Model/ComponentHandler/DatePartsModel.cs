namespace Component.Form.Model.ComponentHandler;

public class DatePartsModel
{
    public int Day { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public DateTime? Date 
    { 
        get
        {
            DateTime? date = null;
            
            try
            {
                date = new DateTime(Year, Month, Day);
            }
            catch (Exception)
            {
                // Do nothing
            }

            return date;
        }  
    }
}
