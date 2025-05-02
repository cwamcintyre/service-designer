using System.Collections.Generic;
using Component.Form.Model;

namespace Component.Form.Application.UseCase.GetAllForms.Model;

public class GetAllFormsResponseModel
{
    public IEnumerable<FormModel> Forms { get; set; }
}
