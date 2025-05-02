using Component.Form.Model;

namespace Component.Form.Application.Shared.Infrastructure;

public interface IFormStore
{
    Task<FormModel> GetFormAsync(string formId);
    Task<IEnumerable<FormModel>> GetAllFormsAsync();
    Task UpdateFormAsync(string formId, FormModel model);
    Task CreateFormAsync(string formId, FormModel model);
    Task DeleteFormAsync(string formId);
}
